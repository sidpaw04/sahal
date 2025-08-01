import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Day } from '../types';

const { width } = Dimensions.get('window');

interface HorizontalTimelineProps {
  days: Day[];
  selectedDayIndex: number;
  onDayPress: (index: number) => void;
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  days,
  selectedDayIndex,
  onDayPress,
}) => {
  const getCityInfo = (index: number) => {
    if (index < 2) {
      return {
        city: 'Paris',
        color: '#3b82f6',
        icon: 'location',
      };
    } else if (index < 5) {
      return {
        city: 'Nice',
        color: '#8b5cf6',
        icon: 'location',
      };
    } else {
      return {
        city: 'Berlin',
        color: '#6b7280',
        icon: 'location',
      };
    }
  };

  const getDayNumber = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'd');
  };

  const getMonthName = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'MMM');
  };

  return (
    <View style={HorizontalTimelineStyles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={HorizontalTimelineStyles.scrollContent}
      >
        {days.map((day, index) => {
          const isActive = index === selectedDayIndex;
          const { city, color, icon } = getCityInfo(index);
          
          return (
            <TouchableOpacity
              key={day.id}
              style={[
                HorizontalTimelineStyles.dayCard,
                isActive && HorizontalTimelineStyles.activeDayCard,
                { borderColor: color }
              ]}
              onPress={() => onDayPress(index)}
              activeOpacity={0.7}
            >
              {/* Day Number */}
              <View style={[
                HorizontalTimelineStyles.dayNumberContainer,
                { backgroundColor: isActive ? color : 'transparent' }
              ]}>
                <Text style={[
                  HorizontalTimelineStyles.dayNumber,
                  { color: isActive ? '#fff' : color }
                ]}>
                  {getDayNumber(day.date)}
                </Text>
              </View>
              
              {/* Month */}
              <Text style={[
                HorizontalTimelineStyles.monthText,
                { color: isActive ? color : '#6b7280' }
              ]}>
                {getMonthName(day.date)}
              </Text>
              
              {/* City */}
              <View style={HorizontalTimelineStyles.cityContainer}>
                <Ionicons
                  name={icon as any}
                  size={14}
                  color={isActive ? color : '#9ca3af'}
                />
                <Text style={[
                  HorizontalTimelineStyles.cityText,
                  { color: isActive ? color : '#6b7280' }
                ]}>
                  {city}
                </Text>
              </View>
              
              {/* Activity Count */}
              <Text style={[
                HorizontalTimelineStyles.activityCount,
                { color: isActive ? color : '#9ca3af' }
              ]}>
                {day.activities.length} activities
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

import { StyleSheet } from 'react-native';

const HorizontalTimelineStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  dayCard: {
    width: 100,
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeDayCard: {
    borderWidth: 3,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  dayNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cityText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
  activityCount: {
    fontSize: 10,
    fontWeight: '400',
  },
}); 