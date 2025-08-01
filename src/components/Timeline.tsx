import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Day } from '../types';
import { TripTimelineStyles } from '../styles/TripTimelineStyles';

const { height } = Dimensions.get('window');

interface TimelineProps {
  days: Day[];
  selectedDayIndex: number;
  onTimelinePress: (index: number) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  days,
  selectedDayIndex,
  onTimelinePress,
}) => {
  const getCityInfo = (index: number) => {
    if (index < 2) {
      return {
        city: 'Paris',
        cityStyle: TripTimelineStyles.timelineLabelParis,
        dotStyle: TripTimelineStyles.timelineDotParis,
        emoji: '🗼',
      };
    } else if (index < 5) {
      return {
        city: 'Nice',
        cityStyle: TripTimelineStyles.timelineLabelNice,
        dotStyle: TripTimelineStyles.timelineDotNice,
        emoji: '🏖️',
      };
    } else {
      return {
        city: 'Berlin',
        cityStyle: TripTimelineStyles.timelineLabelDeparture,
        dotStyle: TripTimelineStyles.timelineDotDeparture,
        emoji: '🏛️',
      };
    }
  };

  return (
    <View style={TripTimelineStyles.timelineContainer}>
      <View style={TripTimelineStyles.timelineLine} />
      <View style={TripTimelineStyles.timelineContent}>
        {days.map((day, index) => {
          const isActive = index === selectedDayIndex;
          const { city, cityStyle, dotStyle, emoji } = getCityInfo(index);
          const topPosition = (index * (height / 7));

          return (
            <TouchableOpacity
              key={day.id}
              style={[
                TripTimelineStyles.timelineDotContainer,
                { top: topPosition }
              ]}
              onPress={() => onTimelinePress(index)}
              activeOpacity={0.7}
            >
              <View style={[
                TripTimelineStyles.timelineDot,
                dotStyle,
                isActive && TripTimelineStyles.timelineDotActive
              ]}>
                <Text style={[
                  TripTimelineStyles.timelineDotEmoji,
                  isActive && TripTimelineStyles.timelineDotTextActive
                ]}>
                  {emoji}
                </Text>
              </View>
              <Text style={[
                TripTimelineStyles.timelineLabel,
                cityStyle,
                isActive && TripTimelineStyles.timelineLabelActive
              ]}>
                {city}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}; 