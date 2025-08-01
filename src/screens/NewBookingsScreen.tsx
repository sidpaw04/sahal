import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { Linking } from 'react-native';
import { TicketAnimatedBackground } from '../components/AnimatedBackground';

type NewBookingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingsMain'>;

interface Props {
  navigation: NewBookingsScreenNavigationProp;
}

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'car' | 'restaurant' | 'activity';
  title: string;
  provider: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  date: string;
  time?: string;
  location: string;
  confirmationNumber: string;
  details: string;
  price: number;
  currency: string;
  bookingUrl?: string;
}

export default function NewBookingsScreen({ navigation }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'flight' | 'hotel' | 'car' | 'restaurant' | 'activity'>('all');

  // Mock data for now - will be replaced with real API calls
  const mockBookings: Booking[] = [
    {
      id: '1',
      type: 'flight',
      title: 'Paris to Nice',
      provider: 'Air France',
      status: 'confirmed',
      date: '2025-08-29',
      time: '10:30',
      location: 'CDG Airport → NCE Airport',
      confirmationNumber: 'AF123456',
      details: 'Economy Class, Seat 12A',
      price: 180,
      currency: 'EUR',
      bookingUrl: 'https://www.airfrance.com',
    },
    {
      id: '2',
      type: 'hotel',
      title: 'Hotel de la Paix',
      provider: 'Booking.com',
      status: 'confirmed',
      date: '2025-08-29',
      time: '15:00',
      location: 'Nice, France',
      confirmationNumber: 'BK789456',
      details: 'Deluxe Room, 3 nights',
      price: 450,
      currency: 'EUR',
      bookingUrl: 'https://www.booking.com',
    },
    {
      id: '3',
      type: 'restaurant',
      title: 'Le Petit Bistrot',
      provider: 'OpenTable',
      status: 'confirmed',
      date: '2025-08-29',
      time: '19:00',
      location: 'Nice Old Town',
      confirmationNumber: 'OT987654',
      details: 'Dinner for 2',
      price: 85,
      currency: 'EUR',
      bookingUrl: 'https://www.opentable.com',
    },
    {
      id: '4',
      type: 'activity',
      title: 'Monaco Day Trip',
      provider: 'Viator',
      status: 'pending',
      date: '2025-08-30',
      time: '09:00',
      location: 'Monaco',
      confirmationNumber: 'VT123789',
      details: 'Guided tour with transportation',
      price: 120,
      currency: 'EUR',
      bookingUrl: 'https://www.viator.com',
    },
    {
      id: '5',
      type: 'car',
      title: 'Airport Transfer',
      provider: 'Uber',
      status: 'confirmed',
      date: '2025-08-29',
      time: '13:00',
      location: 'NCE Airport → Hotel',
      confirmationNumber: 'UB456123',
      details: 'Premium vehicle',
      price: 45,
      currency: 'EUR',
      bookingUrl: 'https://www.uber.com',
    }
  ];

  React.useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  }, []);

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight': return 'airplane';
      case 'hotel': return 'bed';
      case 'car': return 'car';
      case 'restaurant': return 'restaurant';
      case 'activity': return 'camera';
      default: return 'ellipse';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return 'checkmark-circle';
      case 'pending': return 'time';
      case 'cancelled': return 'close-circle';
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

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => 
      activeFilter === 'all' || booking.type === activeFilter
    );
  }, [bookings, activeFilter]);

  const handleBookingPress = (booking: Booking) => {
    if (booking.bookingUrl) {
      Linking.openURL(booking.bookingUrl).catch(err => {
        console.error('Error opening booking URL:', err);
      });
    }
  };

  const handleAddBooking = () => {
    Alert.alert('Add Booking', 'This feature will be implemented soon.');
  };

  const renderBookingItem = ({ item }: { item: Booking }) => (
    <TouchableOpacity
      style={NewBookingsStyles.bookingCard}
      onPress={() => handleBookingPress(item)}
      activeOpacity={0.7}
    >
      <View style={NewBookingsStyles.bookingHeader}>
        <View style={[
          NewBookingsStyles.bookingIcon,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Ionicons 
            name={getBookingIcon(item.type) as any} 
            size={20} 
            color={getStatusColor(item.status)} 
          />
        </View>
        <View style={NewBookingsStyles.bookingInfo}>
          <Text style={NewBookingsStyles.bookingTitle}>{item.title}</Text>
          <Text style={NewBookingsStyles.bookingProvider}>{item.provider}</Text>
          <Text style={NewBookingsStyles.bookingLocation}>{item.location}</Text>
        </View>
        <View style={NewBookingsStyles.bookingStatus}>
          <Ionicons
            name={getStatusIcon(item.status) as any}
            size={16}
            color={getStatusColor(item.status)}
          />
        </View>
      </View>
      
      <View style={NewBookingsStyles.bookingDetails}>
        <View style={NewBookingsStyles.detailRow}>
          <Text style={NewBookingsStyles.detailLabel}>Date:</Text>
          <Text style={NewBookingsStyles.detailValue}>
            {format(parseISO(item.date), 'MMM dd, yyyy')}
          </Text>
        </View>
        {item.time && (
          <View style={NewBookingsStyles.detailRow}>
            <Text style={NewBookingsStyles.detailLabel}>Time:</Text>
            <Text style={NewBookingsStyles.detailValue}>{item.time}</Text>
          </View>
        )}
        <View style={NewBookingsStyles.detailRow}>
          <Text style={NewBookingsStyles.detailLabel}>Confirmation:</Text>
          <Text style={NewBookingsStyles.detailValue}>{item.confirmationNumber}</Text>
        </View>
        <View style={NewBookingsStyles.detailRow}>
          <Text style={NewBookingsStyles.detailLabel}>Details:</Text>
          <Text style={NewBookingsStyles.detailValue}>{item.details}</Text>
        </View>
      </View>
      
      <View style={NewBookingsStyles.bookingFooter}>
        <View style={NewBookingsStyles.priceContainer}>
          <Text style={NewBookingsStyles.priceText}>
            {item.currency} {item.price}
          </Text>
        </View>
        <View style={[
          NewBookingsStyles.statusBadge,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[
            NewBookingsStyles.statusText,
            { color: getStatusColor(item.status) }
          ]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={NewBookingsStyles.container}>
        <View style={NewBookingsStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={NewBookingsStyles.loadingText}>Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={NewBookingsStyles.container}>
      <TicketAnimatedBackground>
        <View style={NewBookingsStyles.mainContent}>
          {/* Header */}
          <View style={NewBookingsStyles.header}>
            <View style={NewBookingsStyles.headerContent}>
              <View>
                <Text style={NewBookingsStyles.headerTitle}>Bookings</Text>
                <Text style={NewBookingsStyles.headerSubtitle}>
                  Manage your reservations
                </Text>
              </View>
              <TouchableOpacity
                style={NewBookingsStyles.addButton}
                onPress={handleAddBooking}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={NewBookingsStyles.filterContainer}
            contentContainerStyle={NewBookingsStyles.filterContent}
          >
            {[
              { id: 'all', label: 'All', icon: 'apps' },
              { id: 'flight', label: 'Flights', icon: 'airplane' },
              { id: 'hotel', label: 'Hotels', icon: 'bed' },
              { id: 'car', label: 'Transport', icon: 'car' },
              { id: 'restaurant', label: 'Restaurants', icon: 'restaurant' },
              { id: 'activity', label: 'Activities', icon: 'camera' },
            ].map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  NewBookingsStyles.filterTab,
                  activeFilter === filter.id && NewBookingsStyles.activeFilterTab
                ]}
                onPress={() => setActiveFilter(filter.id as any)}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={activeFilter === filter.id ? '#fff' : '#6366f1'}
                />
                <Text style={[
                  NewBookingsStyles.filterText,
                  activeFilter === filter.id && NewBookingsStyles.activeFilterText
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Bookings List */}
          <FlatList
            data={filteredBookings}
            renderItem={renderBookingItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={NewBookingsStyles.bookingsList}
            ListEmptyComponent={
              <View style={NewBookingsStyles.emptyContainer}>
                <Ionicons name="ticket-outline" size={48} color="#9ca3af" />
                <Text style={NewBookingsStyles.emptyText}>No bookings yet</Text>
                <Text style={NewBookingsStyles.emptySubtext}>
                  Add your first booking to get started
                </Text>
              </View>
            }
          />
        </View>
      </TicketAnimatedBackground>
    </SafeAreaView>
  );
}

const NewBookingsStyles = StyleSheet.create({
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
    marginTop: 12,
  },
  mainContent: {
    flex: 1,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
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
  bookingsList: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  bookingProvider: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  bookingLocation: {
    fontSize: 12,
    color: '#6b7280',
  },
  bookingStatus: {
    marginLeft: 8,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    width: 80,
  },
  detailValue: {
    fontSize: 12,
    color: '#1f2937',
    flex: 1,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
}); 