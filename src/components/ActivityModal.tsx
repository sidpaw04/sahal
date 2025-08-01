import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
} from 'react-native';
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

interface ActivityModalProps {
  visible: boolean;
  activity: Activity | null;
  onClose: () => void;
  onLinkPress: (type: 'maps' | 'tickets' | 'website', activity: Activity) => void;
}

export const ActivityModal: React.FC<ActivityModalProps> = ({
  visible,
  activity,
  onClose,
  onLinkPress,
}) => {
  const mapButtonScale = useRef(new Animated.Value(1)).current;
  const ticketButtonScale = useRef(new Animated.Value(1)).current;
  const websiteButtonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && activity) {
      // Animate buttons in with staggered timing
      buttonOpacity.setValue(0);
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

  if (!activity) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={TripTimelineStyles.modalOverlay}>
        <View style={TripTimelineStyles.modalContent}>
          <View style={TripTimelineStyles.modalHeader}>
            <View style={TripTimelineStyles.modalHeaderContent}>
              <View style={TripTimelineStyles.modalHeaderIcon}>
                <Ionicons 
                  name={getIconName(activity.icon) as any} 
                  size={24} 
                  color="#6366f1" 
                />
              </View>
            <Text style={TripTimelineStyles.modalTitle}>{activity.title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={TripTimelineStyles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={TripTimelineStyles.modalBody} showsVerticalScrollIndicator={false}>
            {activity.time && (
              <View style={TripTimelineStyles.modalInfoRow}>
                <Ionicons name="time" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.modalInfoText}>{activity.time}</Text>
              </View>
            )}

            {activity.location && (
              <View style={TripTimelineStyles.modalInfoRow}>
                <Ionicons name="location" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.modalInfoText}>{activity.location}</Text>
              </View>
            )}

            {activity.duration && (
              <View style={TripTimelineStyles.modalInfoRow}>
                <Ionicons name="timer" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.modalInfoText}>{activity.duration}</Text>
              </View>
            )}

            {activity.price && (
              <View style={TripTimelineStyles.modalInfoRow}>
                <Ionicons name="card" size={16} color="#6366f1" />
                <Text style={TripTimelineStyles.modalInfoText}>{activity.price}</Text>
              </View>
            )}

            {activity.notes && (
              <View style={TripTimelineStyles.modalSection}>
                <Text style={TripTimelineStyles.modalSectionTitle}>Notes</Text>
                <Text style={TripTimelineStyles.modalNotes}>{activity.notes}</Text>
              </View>
            )}

            {(activity.ticketLink || activity.websiteLink || activity.location) && (
              <Animated.View 
                style={[
                  TripTimelineStyles.modalSection,
                  { opacity: buttonOpacity }
                ]}
              >
                {activity.location && (
                  <Animated.View style={{ transform: [{ scale: mapButtonScale }] }}>
                  <TouchableOpacity 
                      style={[TripTimelineStyles.linkButton, { backgroundColor: '#10b981' }]}
                      onPress={() => handleButtonPress('maps', activity, mapButtonScale)}
                      activeOpacity={0.8}
                  >
                    <Ionicons name="map" size={16} color="#fff" />
                    <Text style={TripTimelineStyles.linkButtonText}>Open in Google Maps</Text>
                  </TouchableOpacity>
                  </Animated.View>
                )}
                
                {activity.ticketLink && (
                  <Animated.View style={{ transform: [{ scale: ticketButtonScale }] }}>
                  <TouchableOpacity 
                      style={[TripTimelineStyles.linkButton, { backgroundColor: '#f59e0b' }]}
                      onPress={() => handleButtonPress('tickets', activity, ticketButtonScale)}
                      activeOpacity={0.8}
                  >
                    <Ionicons name="ticket" size={16} color="#fff" />
                    <Text style={TripTimelineStyles.linkButtonText}>Book Tickets</Text>
                  </TouchableOpacity>
                  </Animated.View>
                )}
                
                {activity.websiteLink && (
                  <Animated.View style={{ transform: [{ scale: websiteButtonScale }] }}>
                  <TouchableOpacity 
                      style={[TripTimelineStyles.linkButton, { backgroundColor: '#8b5cf6' }]}
                      onPress={() => handleButtonPress('website', activity, websiteButtonScale)}
                      activeOpacity={0.8}
                  >
                    <Ionicons name="globe" size={16} color="#fff" />
                    <Text style={TripTimelineStyles.linkButtonText}>Visit Website</Text>
                  </TouchableOpacity>
                  </Animated.View>
                )}
              </Animated.View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}; 