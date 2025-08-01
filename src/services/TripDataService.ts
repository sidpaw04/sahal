import { collection, doc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Trip, Day, Activity, WeatherData, WeatherForecast, TripWeather } from '../types';

export interface TripDataService {
  getTripData: () => Promise<Trip | null>;
  getTripDays: () => Promise<Day[]>;
  getTripActivities: (dayId: string) => Promise<Activity[]>;
  getTripWeather: () => Promise<TripWeather | null>;
}

class TripDataServiceImpl implements TripDataService {
  private cachedTripData: Trip | null = null;
  private lastFetchTime: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getTripData(): Promise<Trip | null> {
    try {
      // Check cache first
      const now = Date.now();
      if (this.cachedTripData && (now - this.lastFetchTime) < this.CACHE_DURATION) {
        return this.cachedTripData;
      }

      // Fetch trip metadata
      const tripDoc = await getDoc(doc(db, 'trips', 'viva-la-france'));
      if (!tripDoc.exists()) {
        console.log('Trip document not found, using fallback data');
        return null;
      }

      const tripData = tripDoc.data();
      
      // Fetch days
      const daysQuery = query(
        collection(db, 'trips', 'viva-la-france', 'days'),
        orderBy('date', 'asc')
      );
      const daysSnapshot = await getDocs(daysQuery);
      console.log(`📅 Found ${daysSnapshot.docs.length} days in Firestore`);
      
      const days: Day[] = [];

      for (const dayDoc of daysSnapshot.docs) {
        const dayData = dayDoc.data();
        console.log(`  📋 Processing day: ${dayDoc.id} - ${dayData.date}`);
        console.log(`    📄 Day document data:`, dayData);
        
        // Fetch activities for this day (without ordering to avoid issues with missing time fields)
        const activitiesQuery = query(
          collection(db, 'trips', 'viva-la-france', 'days', dayDoc.id, 'activities')
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        console.log(`    🎯 Found ${activitiesSnapshot.docs.length} activities for ${dayDoc.id}`);
        
        // Check if we're hitting any limits
        if (activitiesSnapshot.docs.length === 0) {
          console.log(`    ⚠️ No activities found for ${dayDoc.id} - checking if collection exists`);
        }
        
        const activities: Activity[] = activitiesSnapshot.docs.map((activityDoc: any) => ({
          id: activityDoc.id,
          ...activityDoc.data()
        } as Activity));

        // Sort activities by ID in ascending order
        activities.sort((a, b) => {
          const aId = parseInt(a.id);
          const bId = parseInt(b.id);
          return aId - bId;
        });

        days.push({
          id: dayDoc.id,
          date: dayData.date,
          summary: dayData.summary,
          activities
        });
      }

      // Fetch weather data
      const weatherDoc = await getDoc(doc(db, 'trips', 'viva-la-france', 'weather', 'forecast'));
      let weather: TripWeather | undefined;
      
      if (weatherDoc.exists()) {
        const weatherData = weatherDoc.data();
        weather = {
          paris: weatherData.paris || {},
          nice: weatherData.nice || {}
        };
      }

      const trip: Trip = {
        id: tripData.id || 'viva-la-france',
        name: tripData.name || 'Viva la France',
        startDate: tripData.startDate || '2024-08-27',
        endDate: tripData.endDate || '2024-09-01',
        weather,
        days
      };

      // Update cache
      this.cachedTripData = trip;
      this.lastFetchTime = now;

      return trip;
    } catch (error) {
      console.error('Error fetching trip data:', error);
      return null;
    }
  }

  async getTripDays(): Promise<Day[]> {
    const tripData = await this.getTripData();
    return tripData?.days || [];
  }

  async getTripActivities(dayId: string): Promise<Activity[]> {
    try {
      const activitiesQuery = query(
        collection(db, 'trips', 'viva-la-france', 'days', dayId, 'activities'),
        orderBy('time', 'asc')
      );
      const activitiesSnapshot = await getDocs(activitiesQuery);
      return activitiesSnapshot.docs.map((activityDoc: any) => ({
        id: activityDoc.id,
        ...activityDoc.data()
      } as Activity));
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  async getTripWeather(): Promise<TripWeather | null> {
    try {
      const weatherDoc = await getDoc(doc(db, 'trips', 'viva-la-france', 'weather', 'forecast'));
      if (weatherDoc.exists()) {
        const weatherData = weatherDoc.data();
        return {
          paris: weatherData.paris || {},
          nice: weatherData.nice || {}
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  // Clear cache (useful for testing or when data is updated)
  clearCache(): void {
    this.cachedTripData = null;
    this.lastFetchTime = 0;
  }
}

export const tripDataService = new TripDataServiceImpl(); 