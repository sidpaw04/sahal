import { useState, useEffect } from 'react';
import { Trip, Day, Activity, TripWeather } from '../types';
import { tripDataService } from '../services/TripDataService';

export interface UseTripDataReturn {
  tripData: Trip | null;
  days: Day[];
  weather: TripWeather | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useTripData = (): UseTripDataReturn => {
  const [tripData, setTripData] = useState<Trip | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [weather, setWeather] = useState<TripWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTripData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching trip data from Firestore...');
      const data = await tripDataService.getTripData();
      
      if (data) {
        console.log('✅ Firestore data loaded successfully');
        console.log(`📊 Trip: ${data.name}`);
        console.log(`📅 Days: ${data.days.length}`);
        console.log(`🌤️ Weather: ${data.weather ? 'Available' : 'Not available'}`);
        
        data.days.forEach((day, index) => {
          console.log(`  Day ${index + 1}: ${day.date} - ${day.activities.length} activities`);
        });
        
        setTripData(data);
        setDays(data.days);
        setWeather(data.weather || null);
      } else {
        // Fallback to static data if Firestore is not available
        console.log('⚠️ Using fallback trip data');
        const fallbackData = require('../data/tripData').tripData;
        setTripData(fallbackData);
        setDays(fallbackData.days);
        setWeather(fallbackData.weather || null);
      }
    } catch (err) {
      console.error('❌ Error loading trip data:', err);
      setError('Failed to load trip data');
      
      // Fallback to static data on error
      const fallbackData = require('../data/tripData').tripData;
      setTripData(fallbackData);
      setDays(fallbackData.days);
      setWeather(fallbackData.weather || null);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    tripDataService.clearCache();
    await loadTripData();
  };

  useEffect(() => {
    loadTripData();
  }, []);

  return {
    tripData,
    days,
    weather,
    loading,
    error,
    refresh
  };
}; 