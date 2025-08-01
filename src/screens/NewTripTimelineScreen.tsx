import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Activity } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, addDays, subDays, isSameDay } from 'date-fns';
import { useTripData } from '../hooks/useTripData';
import { ActivityDrawer } from '../components/ActivityDrawer';
import { HorizontalTimeline } from '../components/HorizontalTimeline';
import WeatherWidget from '../components/WeatherWidget';
import { Linking } from 'react-native';

type NewTripTimelineScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripTimeline'>;

interface Props {
  navigation: NewTripTimelineScreenNavigationProp;
}

interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  location: string;
  address?: string;
  city: string;
  type: 'flight' | 'hotel' | 'activity' | 'meal' | 'transport';
  status: 'confirmed' | 'pending' | 'cancelled';
  description?: string;
  date: string;
  duration?: string;
  price?: number;
  currency?: string;
  notes?: string;
  bookingUrl?: string;
  mapsUrl?: string;
}

export default function NewTripTimelineScreen({ navigation }: Props) {
  const { tripData, days, weather, loading, error } = useTripData();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<ItineraryItem | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'flight' | 'hotel' | 'activity' | 'meal' | 'transport'>('all');

  const getActivityType = (icon: string): ItineraryItem['type'] => {
    switch (icon) {
      case 'airplane': return 'flight';
      case 'bed': return 'hotel';
      case 'restaurant': case 'cafe': return 'meal';
      case 'train': case 'car': case 'boat': return 'transport';
      default: return 'activity';
    }
  };

  // Convert existing trip data to new format
  const itineraryItems: ItineraryItem[] = useMemo(() => {
    if (!days) return [];
    
    return days.flatMap(day => 
      day.activities.map(activity => ({
        id: activity.id,
        time: activity.time || '09:00',
        title: activity.title,
        location: activity.location || '',
        address: activity.location,
        city: day.date.includes('2025-08-27') || day.date.includes('2025-08-28') ? 'Paris' : 'Nice',
        type: getActivityType(activity.icon),
        status: 'confirmed' as const,
        description: activity.notes,
        date: day.date,
        duration: activity.duration,
        price: activity.price ? parseFloat(activity.price.replace('€', '')) : undefined,
        currency: 'EUR',
        notes: activity.notes,
        bookingUrl: activity.ticketLink || activity.websiteLink,
        mapsUrl: activity.location ? `https://maps.google.com/?q=${encodeURIComponent(activity.location)}` : undefined,
      }))
    );
  }, [days]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flight': return 'airplane';
      case 'hotel': return 'bed';
      case 'meal': return 'restaurant';
      case 'transport': return 'train';
      case 'activity': return 'camera';
      default: return 'ellipse';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCityColor = (city: string) => {
    switch (city) {
      case 'Paris': return '#3b82f6';
      case 'Nice': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const filteredItems = useMemo(() => {
    // First filter by selected day
    const selectedDayItems = itineraryItems.filter(item => {
      if (!days || days.length === 0) return false;
      const selectedDay = days[selectedDayIndex];
      return item.date === selectedDay.date;
    });
    
    // Then filter by activity type
    return selectedDayItems.filter(item => 
      activeFilter === 'all' || item.type === activeFilter
    );
  }, [itineraryItems, activeFilter, selectedDayIndex, days]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: ItineraryItem[] } = {};
    filteredItems.forEach(item => {
      const date = item.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(item);
    });
    return groups;
  }, [filteredItems]);

  const handleDayPress = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
  };

  const openActivityDrawer = (activity: ItineraryItem) => {
    setSelectedActivity(activity);
    setIsDrawerVisible(true);
  };

  const closeActivityDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedActivity(null);
  };

  const handleLinkPress = (type: 'maps' | 'tickets' | 'website', activity: ItineraryItem) => {
    let url = '';
    
    switch (type) {
      case 'maps':
        url = activity.mapsUrl || '';
        break;
      case 'tickets':
      case 'website':
        url = activity.bookingUrl || '';
        break;
    }
    
    if (url) {
      Linking.openURL(url).catch(err => {
        console.error('Error opening URL:', err);
      });
    }
  };

  const renderActivityItem = ({ item }: { item: ItineraryItem }) => (
    <TouchableOpacity
      style={NewTripTimelineStyles.activityCard}
      onPress={() => openActivityDrawer(item)}
      activeOpacity={0.7}
    >
      <View style={NewTripTimelineStyles.activityHeader}>
        <View style={[
          NewTripTimelineStyles.activityIcon,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Ionicons 
            name={getTypeIcon(item.type) as any} 
            size={14} 
            color={getStatusColor(item.status)} 
          />
        </View>
        <View style={NewTripTimelineStyles.activityInfo}>
          <Text style={NewTripTimelineStyles.activityTime}>{item.time}</Text>
          <Text style={NewTripTimelineStyles.activityTitle}>{item.title}</Text>
          <Text style={NewTripTimelineStyles.activityLocation}>{item.location}</Text>
        </View>
        <View style={NewTripTimelineStyles.activityStatus}>
          <View style={[
            NewTripTimelineStyles.statusDot,
            { backgroundColor: getStatusColor(item.status) }
          ]} />
        </View>
      </View>
      
      {item.price && (
        <View style={NewTripTimelineStyles.priceContainer}>
          <Text style={NewTripTimelineStyles.priceText}>
            {item.currency} {item.price}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderDateGroup = ({ item }: { item: { date: string; activities: ItineraryItem[] } }) => (
    <View style={NewTripTimelineStyles.dateGroup}>
      {item.activities.map((activity, index) => (
        <View key={activity.id} style={NewTripTimelineStyles.activityWrapper}>
          {renderActivityItem({ item: activity })}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={NewTripTimelineStyles.container}>
        <View style={NewTripTimelineStyles.loadingContainer}>
          <Text style={NewTripTimelineStyles.loadingText}>Loading trip data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !tripData) {
    return (
      <SafeAreaView style={NewTripTimelineStyles.container}>
        <View style={NewTripTimelineStyles.errorContainer}>
          <Text style={NewTripTimelineStyles.errorText}>
            {error || 'Failed to load trip data'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const selectedDay = days && days.length > 0 ? days[selectedDayIndex] : null;
  const groupedData = selectedDay ? [{
    date: selectedDay.date,
    activities: filteredItems
  }] : [];

  return (
    <SafeAreaView style={NewTripTimelineStyles.container}>
      {/* Header */}
      <View style={NewTripTimelineStyles.header}>
        <View style={NewTripTimelineStyles.headerContent}>
          <View>
            <Text style={NewTripTimelineStyles.headerTitle}>{tripData.name}</Text>
            <Text style={NewTripTimelineStyles.headerSubtitle}>
              {tripData.startDate} - {tripData.endDate}
            </Text>
          </View>
          <View style={NewTripTimelineStyles.avatarContainer}>
            <Text style={NewTripTimelineStyles.avatarText}>JD</Text>
          </View>
        </View>
      </View>

      {/* Horizontal Timeline */}
      {days && days.length > 0 && (
        <View style={NewTripTimelineStyles.timelineContainer}>
          <HorizontalTimeline
            days={days}
            selectedDayIndex={selectedDayIndex}
            onDayPress={handleDayPress}
          />
        </View>
      )}

      {/* Selected Day Info */}
      {selectedDay && (
        <View style={NewTripTimelineStyles.selectedDayContainer}>
          <Text style={NewTripTimelineStyles.selectedDayTitle}>
            {format(parseISO(selectedDay.date), 'EEEE, MMMM dd')}
          </Text>
          <Text style={NewTripTimelineStyles.selectedDaySubtitle}>
            {selectedDay.summary || `${filteredItems.length} activities`}
          </Text>
        </View>
      )}

      {/* Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={NewTripTimelineStyles.filterContainer}
        contentContainerStyle={NewTripTimelineStyles.filterContent}
      >
        {[
          { id: 'all', label: 'All', icon: 'apps' },
          { id: 'flight', label: 'Flights', icon: 'airplane' },
          { id: 'hotel', label: 'Hotels', icon: 'bed' },
          { id: 'activity', label: 'Activities', icon: 'camera' },
          { id: 'meal', label: 'Meals', icon: 'restaurant' },
          { id: 'transport', label: 'Transport', icon: 'train' },
        ].map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              NewTripTimelineStyles.filterTab,
              activeFilter === filter.id && NewTripTimelineStyles.activeFilterTab
            ]}
            onPress={() => setActiveFilter(filter.id as any)}
          >
            <Ionicons
              name={filter.icon as any}
              size={16}
              color={activeFilter === filter.id ? '#fff' : '#6366f1'}
            />
            <Text style={[
              NewTripTimelineStyles.filterText,
              activeFilter === filter.id && NewTripTimelineStyles.activeFilterText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <FlatList
        data={groupedData}
        renderItem={renderDateGroup}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={NewTripTimelineStyles.contentContainer}
      />

      {/* Activity Drawer */}
      {selectedActivity && (
        <ActivityDrawer
          visible={isDrawerVisible}
          activity={{
            id: selectedActivity.id,
            title: selectedActivity.title,
            icon: getTypeIcon(selectedActivity.type),
            location: selectedActivity.location,
            duration: selectedActivity.duration,
            price: selectedActivity.price?.toString(),
            notes: selectedActivity.notes,
            ticketLink: selectedActivity.bookingUrl,
            websiteLink: selectedActivity.bookingUrl,
          } as Activity}
          onClose={closeActivityDrawer}
          onLinkPress={(type, activity) => handleLinkPress(type, selectedActivity)}
        />
      )}
    </SafeAreaView>
  );
}

import { StyleSheet } from 'react-native';

const NewTripTimelineStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6366f1',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedDayContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectedDayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  selectedDaySubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  timelineContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
  },
  filterContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  activeFilterTab: {
    backgroundColor: '#6366f1',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 4,
  },
  activeFilterText: {
    color: '#fff',
  },
  contentContainer: {
    padding: 16,
  },
  dateGroup: {
    marginBottom: 16,
  },
  dateHeader: {
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dateSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  activityWrapper: {
    marginBottom: 4,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTime: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 1,
  },
  activityLocation: {
    fontSize: 11,
    color: '#6b7280',
  },
  activityStatus: {
    marginLeft: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priceContainer: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  priceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0369a1',
  },
}); 