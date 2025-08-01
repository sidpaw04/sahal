import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  FlatList,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Activity } from '../types';
import { TripTimelineStyles, CARD_HEIGHT } from '../styles/TripTimelineStyles';
import { Timeline } from '../components/Timeline';
import { DayCard } from '../components/DayCard';
import { ActivityDrawer } from '../components/ActivityDrawer';
import WeatherWidget from '../components/WeatherWidget';
import { useTripData } from '../hooks/useTripData';

type TripTimelineScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripTimeline'>;

interface Props {
  navigation: TripTimelineScreenNavigationProp;
}

export default function TripTimelineScreen({ navigation }: Props) {
  const { tripData, days, weather, loading, error } = useTripData();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Animated background values
  const backgroundAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const bubble1Animation = useRef(new Animated.Value(0)).current;
  const bubble2Animation = useRef(new Animated.Value(0)).current;
  const bubble3Animation = useRef(new Animated.Value(0)).current;
  const bubble4Animation = useRef(new Animated.Value(0)).current;
  const bubble5Animation = useRef(new Animated.Value(0)).current;

  const handleTimelinePress = useCallback((index: number) => {
    setIsNavigating(true);
    setSelectedDayIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setTimeout(() => setIsNavigating(false), 500);
  }, []);

  const handleLinkPress = useCallback((type: 'maps' | 'tickets' | 'website', activity: Activity) => {
    let url = '';
    
    switch (type) {
      case 'maps':
        if (activity.location) {
          const encodedLocation = encodeURIComponent(activity.location);
          url = `https://maps.google.com/?q=${encodedLocation}`;
        }
        break;
      case 'tickets':
        url = activity.ticketLink || '';
        break;
      case 'website':
        url = activity.websiteLink || '';
        break;
    }
    
    if (url) {
      Linking.openURL(url).catch(err => {
        console.error('Error opening URL:', err);
      });
    }
  }, []);

  const handleActivityPress = useCallback((activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalVisible(true);
  }, []);

  // Background animation effects
  useEffect(() => {
    const backgroundLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundAnimation, {
          toValue: 1,
          duration: 80000,
          useNativeDriver: false,
        }),
        Animated.timing(backgroundAnimation, {
          toValue: 0,
          duration: 80000,
          useNativeDriver: false,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.05,
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

    // Bubble animations with different patterns
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

    const bubble4Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble4Animation, {
          toValue: 1,
          duration: 18000,
          useNativeDriver: false,
        }),
        Animated.timing(bubble4Animation, {
          toValue: 0,
          duration: 18000,
          useNativeDriver: false,
        }),
      ])
    );

    const bubble5Loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bubble5Animation, {
          toValue: 1,
          duration: 14000,
          useNativeDriver: false,
        }),
        Animated.timing(bubble5Animation, {
          toValue: 0,
          duration: 14000,
          useNativeDriver: false,
        }),
      ])
    );

    backgroundLoop.start();
    pulseLoop.start();
    bubble1Loop.start();
    bubble2Loop.start();
    bubble3Loop.start();
    bubble4Loop.start();
    bubble5Loop.start();

    return () => {
      backgroundLoop.stop();
      pulseLoop.stop();
      bubble1Loop.stop();
      bubble2Loop.stop();
      bubble3Loop.stop();
      bubble4Loop.stop();
      bubble5Loop.stop();
    };
  }, [backgroundAnimation, pulseAnimation, bubble1Animation, bubble2Animation, bubble3Animation, bubble4Animation, bubble5Animation]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        if (isNavigating || !tripData) return;
        const contentOffsetY = event.nativeEvent.contentOffset.y;
        const newIndex = Math.round(contentOffsetY / CARD_HEIGHT);
        if (newIndex !== selectedDayIndex && newIndex >= 0 && newIndex < tripData.days.length) {
          setSelectedDayIndex(newIndex);
        }
      },
    }
  );

  const renderDayCard = ({ item, index }: { item: any; index: number }) => (
    <DayCard
      day={item}
      index={index}
      scrollX={scrollX}
      onActivityPress={handleActivityPress}
      weather={weather || undefined}
    />
  );

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView style={TripTimelineStyles.container} edges={['left', 'right']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#6366f1' }}>Loading trip data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error || !tripData) {
    return (
      <SafeAreaView style={TripTimelineStyles.container} edges={['left', 'right']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#ef4444' }}>
            {error || 'Failed to load trip data'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={TripTimelineStyles.container} edges={['left', 'right']}>
      {/* Animated Background */}
      <Animated.View 
        style={[
          TripTimelineStyles.animatedBackground,
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
            TripTimelineStyles.animatedGradient1,
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
            TripTimelineStyles.animatedGradient2,
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
            TripTimelineStyles.animatedBubble1,
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
            TripTimelineStyles.animatedBubble2,
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
            TripTimelineStyles.animatedBubble3,
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
        <Animated.View 
          style={[
            TripTimelineStyles.animatedBubble4,
            {
              opacity: bubble4Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.04, 0.14],
              }),
              transform: [
                {
                  scale: bubble4Animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1.15],
                  }),
                },
              ],
            },
          ]}
        />
        <Animated.View 
          style={[
            TripTimelineStyles.animatedBubble5,
            {
              opacity: bubble5Animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.06, 0.16],
              }),
              transform: [
                {
                  scale: bubble5Animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.75, 1.25],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
      
      <View style={TripTimelineStyles.mainContent}>
        <Timeline
          days={days}
          selectedDayIndex={selectedDayIndex}
          onTimelinePress={handleTimelinePress}
        />

        <View style={TripTimelineStyles.carouselContainer}>
          <Animated.FlatList
            ref={flatListRef}
            data={days}
            renderItem={renderDayCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            pagingEnabled
            snapToInterval={CARD_HEIGHT}
            decelerationRate="fast"
            onScroll={onScroll}
            scrollEventThrottle={16}
            contentContainerStyle={TripTimelineStyles.carouselContent}
            getItemLayout={(data, index) => ({
              length: CARD_HEIGHT,
              offset: CARD_HEIGHT * index,
              index,
            })}
            contentInset={{ bottom: (CARD_HEIGHT * 0.1) }}
            contentInsetAdjustmentBehavior="automatic"
            onMomentumScrollEnd={(event) => {
              if (isNavigating) return;
              const contentOffsetY = event.nativeEvent.contentOffset.y;
              const newIndex = Math.round(contentOffsetY / CARD_HEIGHT);
              if (newIndex !== selectedDayIndex && newIndex >= 0 && newIndex < days.length) {
                setSelectedDayIndex(newIndex);
              }
            }}
          />
        </View>
      </View>

      <ActivityDrawer
        visible={isModalVisible}
        activity={selectedActivity}
        onClose={() => setIsModalVisible(false)}
        onLinkPress={handleLinkPress}
      />
    </SafeAreaView>
  );
} 