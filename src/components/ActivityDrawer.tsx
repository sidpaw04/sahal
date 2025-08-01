import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Activity } from '../types';
import { TripTimelineStyles } from '../styles/TripTimelineStyles';

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

interface ActivityDrawerProps {
  visible: boolean;
  activity: Activity | null;
  onClose: () => void;
  onLinkPress: (type: 'maps' | 'tickets' | 'website', activity: Activity) => void;
}

export const ActivityDrawer: React.FC<ActivityDrawerProps> = ({
  visible,
  activity,
  onClose,
  onLinkPress,
}) => {
  const translateX = useRef(new Animated.Value(400)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const mapButtonScale = useRef(new Animated.Value(1)).current;
  const ticketButtonScale = useRef(new Animated.Value(1)).current;
  const websiteButtonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && activity) {
      // Animate drawer in
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Animate buttons in with staggered timing
      buttonOpacity.setValue(0);
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.stagger(150, [
            Animated.spring(mapButtonScale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(ticketButtonScale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(websiteButtonScale, {
              toValue: 1,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ]),
        ]).start();
      }, 200);
    } else {
      // Animate drawer out
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 400,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, activity]);

  const handleButtonPress = (type: 'maps' | 'tickets' | 'website', activity: Activity, buttonScale: Animated.Value) => {
    // Add press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onLinkPress(type, activity);
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX } = event.nativeEvent;
      if (translationX > 50) {
        // Swipe right to close (reduced threshold)
        onClose();
      } else {
        // Snap back to open position
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (!activity || !visible) return null;

  return (
    <View style={TripTimelineStyles.drawerContainer}>
      {/* Overlay */}
      <Animated.View 
        style={[
          TripTimelineStyles.drawerOverlay,
          { opacity: overlayOpacity }
        ]}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Drawer */}
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-20, 20]}
      >
        <Animated.View 
          style={[
            TripTimelineStyles.drawerContent,
            { transform: [{ translateX }] }
          ]}
        >
          {/* Handle */}
          <View style={TripTimelineStyles.drawerHandle}>
            <View style={TripTimelineStyles.drawerHandleBar} />
          </View>

          {/* Header */}
          <View style={TripTimelineStyles.drawerHeader}>
            <View style={TripTimelineStyles.drawerHeaderContent}>
              <View style={TripTimelineStyles.drawerHeaderIcon}>
                <Ionicons 
                  name={getIconName(activity.icon) as any} 
                  size={24} 
                  color="#6366f1" 
                />
              </View>
              <Text style={TripTimelineStyles.drawerTitle}>{activity.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={TripTimelineStyles.drawerCloseButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={TripTimelineStyles.drawerBody} 
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {activity.time && (
              <View style={TripTimelineStyles.drawerInfoRow}>
                <Ionicons name="time" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.drawerInfoText}>{activity.time}</Text>
              </View>
            )}

            {activity.location && (
              <View style={TripTimelineStyles.drawerInfoRow}>
                <Ionicons name="location" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.drawerInfoText}>{activity.location}</Text>
              </View>
            )}

            {activity.duration && (
              <View style={TripTimelineStyles.drawerInfoRow}>
                <Ionicons name="timer" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.drawerInfoText}>{activity.duration}</Text>
              </View>
            )}

            {activity.price && (
              <View style={TripTimelineStyles.drawerInfoRow}>
                <Ionicons name="card" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.drawerInfoText}>{activity.price}</Text>
              </View>
            )}

            {activity.notes && (
              <View style={TripTimelineStyles.drawerSection}>
                <Text style={TripTimelineStyles.drawerSectionTitle}>Notes</Text>
                <Text style={TripTimelineStyles.drawerNotes}>{activity.notes}</Text>
              </View>
            )}

            {(activity.ticketLink || activity.websiteLink || activity.location) && (
              <Animated.View 
                style={[
                  TripTimelineStyles.drawerSection,
                  { opacity: buttonOpacity }
                ]}
              >
                {activity.location && (
                  <Animated.View style={{ transform: [{ scale: mapButtonScale }] }}>
                    <TouchableOpacity 
                      style={[TripTimelineStyles.drawerLinkButton, { backgroundColor: '#10b981' }]}
                      onPress={() => handleButtonPress('maps', activity, mapButtonScale)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="map" size={16} color="#fff" />
                      <Text style={TripTimelineStyles.drawerLinkButtonText}>Open in Google Maps</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
                
                {activity.ticketLink && (
                  <Animated.View style={{ transform: [{ scale: ticketButtonScale }] }}>
                    <TouchableOpacity 
                      style={[TripTimelineStyles.drawerLinkButton, { backgroundColor: '#f59e0b' }]}
                      onPress={() => handleButtonPress('tickets', activity, ticketButtonScale)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="ticket" size={16} color="#fff" />
                      <Text style={TripTimelineStyles.drawerLinkButtonText}>Book Tickets</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
                
                {activity.websiteLink && (
                  <Animated.View style={{ transform: [{ scale: websiteButtonScale }] }}>
                    <TouchableOpacity 
                      style={[TripTimelineStyles.drawerLinkButton, { backgroundColor: '#8b5cf6' }]}
                      onPress={() => handleButtonPress('website', activity, websiteButtonScale)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="globe" size={16} color="#fff" />
                      <Text style={TripTimelineStyles.drawerLinkButtonText}>Visit Website</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </Animated.View>
            )}
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}; 