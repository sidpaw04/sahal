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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  dayCard: {
    width: 85,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  activeDayCard: {
    borderWidth: 3,
    shadowOpacity: 0.25,
    elevation: 6,
  },
  dayNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 3,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  cityText: {
    fontSize: 9,
    fontWeight: '500',
    marginLeft: 3,
  },
  activityCount: {
    fontSize: 9,
    fontWeight: '400',
  },
}); 