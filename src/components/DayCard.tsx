import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Day, Activity } from '../types';
import { TripTimelineStyles, CARD_WIDTH, CARD_HEIGHT } from '../styles/TripTimelineStyles';
import WeatherWidget from './WeatherWidget';
import { TripWeather } from '../types';

interface DayCardProps {
  day: Day;
  index: number;
  scrollX: Animated.Value;
  onActivityPress: (activity: Activity) => void;
  weather?: TripWeather;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  index,
  scrollX,
  onActivityPress,
  weather,
}) => {
  const inputRange = [
    (index - 1) * CARD_HEIGHT,
    index * CARD_HEIGHT,
    (index + 1) * CARD_HEIGHT,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.85, 1, 0.85],
    extrapolate: 'clamp',
  });

  const opacity = scrollX.interpolate({
    inputRange,
    outputRange: [0.1, 1, 0.1],
    extrapolate: 'clamp',
  });

  const rotateX = scrollX.interpolate({
    inputRange,
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  // Animated background values
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const bubble1Animation = useRef(new Animated.Value(0)).current;
  const bubble2Animation = useRef(new Animated.Value(0)).current;
  const bubble3Animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backgroundLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnimation, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );

    const bubble1Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble1Animation, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: false,
        }),
        Animated.timing(bubble1Animation, {
          toValue: 0,
          duration: 12000,
          useNativeDriver: false,
        }),
      ])
    );

    const bubble2Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble2Animation, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: false,
        }),
        Animated.timing(bubble2Animation, {
          toValue: 0,
          duration: 15000,
          useNativeDriver: false,
        }),
      ])
    );

    const bubble3Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble3Animation, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: false,
        }),
        Animated.timing(bubble3Animation, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: false,
        }),
      ])
    );

    backgroundLoop.start();
    pulseLoop.start();
    bubble1Loop.start();
    bubble2Loop.start();
    bubble3Loop.start();

    return () => {
      backgroundLoop.stop();
      pulseLoop.stop();
      bubble1Loop.stop();
      bubble2Loop.stop();
      bubble3Loop.stop();
    };
  }, [backgroundAnimation, pulseAnimation, bubble1Animation, bubble2Animation, bubble3Animation]);

  const getIconName = (icon: string) => {
    const iconMap: { [key: string]: string } = {
      airplane: 'airplane',
      restaurant: 'restaurant',
      business: 'business',
      cafe: 'cafe',
      walk: 'walk',
      camera: 'camera',
      bed: 'bed',
      car: 'car',
      wine: 'wine',
      'shopping-bag': 'bag',
      boat: 'boat',
      train: 'train',
      umbrella: 'umbrella',
    };
    return iconMap[icon] || 'ellipse';
  };

  const renderActivity = (activity: Activity) => {
    const isTrainActivity = activity.icon === 'train';
    
    return (
      <TouchableOpacity 
        key={activity.id} 
        style={TripTimelineStyles.activityItem}
        onPress={() => onActivityPress(activity)}
        activeOpacity={0.7}
      >
        <View style={[
          TripTimelineStyles.activityIcon,
          isTrainActivity && { backgroundColor: '#fef3c7', borderWidth: 2, borderColor: '#f59e0b' }
        ]}>
          <Ionicons 
            name={getIconName(activity.icon) as any} 
            size={16} 
            color={isTrainActivity ? '#f59e0b' : '#6366f1'} 
          />
        </View>
        <View style={TripTimelineStyles.activityDetails}>
          {activity.time && <Text style={TripTimelineStyles.activityTime}>{activity.time}</Text>}
          <Text style={TripTimelineStyles.activityTitle}>{activity.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
      {/* Animated Background */}
      <Animated.View 
        style={[
          TripTimelineStyles.cardAnimatedBackground,
          {
            opacity: backgroundAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.6],
            }),
            transform: [
              {
                scale: pulseAnimation,
              },
            ],
          },
        ]}
      >
        <Animated.View 
          style={[
            TripTimelineStyles.cardAnimatedGradient1,
            {
              opacity: backgroundAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 0.8],
              }),
            },
          ]}
        />
        <Animated.View 
          style={[
            TripTimelineStyles.cardAnimatedGradient2,
            {
              opacity: backgroundAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.5],
              }),
            },
          ]}
        />
        
        {/* Additional Animated Bubbles */}
        <Animated.View 
          style={[
            TripTimelineStyles.cardAnimatedBubble1,
            {
              opacity: bubble1Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.05, 0.15],
              }),
              transform: [
                {
                  scale: bubble1Animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            TripTimelineStyles.cardAnimatedBubble2,
            {
              opacity: bubble2Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.03, 0.12],
              }),
              transform: [
                {
                  scale: bubble2Animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1.1],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            TripTimelineStyles.cardAnimatedBubble3,
            {
              opacity: bubble3Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.08, 0.18],
              }),
              transform: [
                {
                  scale: bubble3Animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.3],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
      
      <Animated.View
        style={[
          TripTimelineStyles.dayCard,
          {
            transform: [
              { scale },
              { rotateX },
            ],
            opacity,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          {day.summary && (
            <View style={TripTimelineStyles.summaryCard}>
              <Text style={TripTimelineStyles.summaryText}>{day.summary}</Text>
            </View>
          )}
          
          <ScrollView 
            style={[
              TripTimelineStyles.activitiesContainer,
              { marginTop: 30 },
              day.summary && { marginTop: 35 }
            ]} 
            showsVerticalScrollIndicator={false}
          >
            {day.activities.map((activity) => renderActivity(activity))}
          </ScrollView>
          
          <View style={TripTimelineStyles.dayHeader}>
            <View style={TripTimelineStyles.dayTitleContainer}>
              <Text style={TripTimelineStyles.dayTitle}>
                {format(parseISO(day.date), 'MMM dd, yyyy')}
              </Text>
            </View>
            {/* Weather Widget */}
            {weather && (() => {
              const city = index < 2 ? 'paris' : 'nice';
              const dayWeather = weather[city]?.[day.date];
              if (dayWeather) {
                return (
                  <View style={{ marginTop: 8 }}>
                    <WeatherWidget
                      weather={dayWeather}
                      date={day.date}
                      city={city.charAt(0).toUpperCase() + city.slice(1)}
                    />
                  </View>
                );
              }
              return null;
            })()}
          </View>
        </View>
      </Animated.View>
    </View>
  );
}; 