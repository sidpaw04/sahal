import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types';
import { TicketAnimatedBackground } from '../components/AnimatedBackground';
import { useStorage } from '../hooks/useStorage';
import { TicketData } from '../services/StorageService';
import AddTicketModal from '../components/AddTicketModal';
import FileViewer from '../components/FileViewer';
import * as FileSystem from 'expo-file-system';
import { getTicketIcon } from '../utils/ticketIcons';

type BookingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingsList'>;

interface Props {
  navigation: BookingsScreenNavigationProp;
}

export default function BookingsScreen({ navigation }: Props) {
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ url: string; name: string } | null>(null);
  
  const {
    tickets,
    loadingTickets,
    errorTickets,
    refreshTickets,
    addTicket,
    deleteTicket,
    uploadTicketFile,
    isConfigured,
  } = useStorage();

  useEffect(() => {
    if (isConfigured) {
      refreshTickets();
    }
  }, [isConfigured, refreshTickets]);

  const handleAddTicket = () => {
    if (!isConfigured) {
      Alert.alert(
        'Storage Not Configured',
        'Please configure Google Cloud Storage integration first. Check the configuration file for setup instructions.',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowAddTicketModal(true);
  };

  const testFileUpload = async () => {
    try {
      console.log('Testing file upload with paris.jpg...');
      
      // Simulate uploading the paris.jpg file
      const fileName = `test-paris-${Date.now()}.jpg`;
      
      // Read the paris.jpg file from assets
      const assetUri = FileSystem.documentDirectory + 'assets/paris.jpg';
      
      // For testing, we'll create a simple base64 content
      const testFileContent = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='; // 1x1 pixel PNG
      
      console.log('Uploading test file:', fileName);
      const uploadResult = await uploadTicketFile(testFileContent, fileName, 'image/jpeg');
      
      console.log('Upload result:', uploadResult);
      if (uploadResult.success && uploadResult.url) {
        Alert.alert('Success', `File uploaded successfully!\nURL: ${uploadResult.url}`);
      } else {
        Alert.alert('Error', `Upload failed: ${uploadResult.error}`);
      }
      
    } catch (error) {
      console.error('Test upload error:', error);
      Alert.alert('Error', `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTicketAdded = async (ticketData: { type: string; title: string; url?: string }) => {
    try {
      console.log('BookingsScreen: Adding ticket with data:', ticketData);
      
      // If there's a file to upload, upload it first
      let fileUrl = ticketData.url;
      if (ticketData.url && ticketData.url.startsWith('file://')) {
        const fileName = `ticket-${Date.now()}.pdf`;
        
        console.log('BookingsScreen: Uploading file:', fileName);
        
        // Read the actual file content
        const fileContent = await FileSystem.readAsStringAsync(ticketData.url, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const uploadResult = await uploadTicketFile(fileContent, fileName, 'application/pdf');
        console.log('BookingsScreen: Upload result:', uploadResult);
        
        if (uploadResult.success && uploadResult.url) {
          fileUrl = uploadResult.url;
          console.log('BookingsScreen: File uploaded successfully, URL:', fileUrl);
        } else {
          console.error('BookingsScreen: Upload failed:', uploadResult.error);
          Alert.alert('Error', 'Failed to upload file. Please try again.');
          return;
        }
      }

      // Add the ticket with the uploaded file URL
      const ticketToAdd = {
        type: ticketData.type,
        title: ticketData.title,
        url: fileUrl,
      };
      
      console.log('BookingsScreen: Adding ticket to database:', ticketToAdd);
      await addTicket(ticketToAdd);
      setShowAddTicketModal(false);
    } catch (error) {
      console.error('BookingsScreen: Error adding ticket:', error);
      Alert.alert('Error', 'Failed to add ticket. Please try again.');
      throw error;
    }
  };

  const handleDeleteTicket = (ticketTitle: string) => {
    Alert.alert(
      'Delete Ticket',
      'Are you sure you want to delete this ticket?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // For now, we'll need to implement delete by title since we removed id
              // This is a temporary solution - ideally we'd have a unique identifier
              console.log('Delete ticket:', ticketTitle);
              Alert.alert('Info', 'Delete functionality needs to be updated for the new schema.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete ticket. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Using the ticket icon utility from utils/ticketIcons.ts

  const renderTicket = ({ item }: { item: TicketData }) => {
    // Handle both old and new schema
    const ticketTitle = item.title || (item as any).name || 'Untitled Ticket';
    const ticketType = item.type || 'other';
    const ticketIcon = getTicketIcon(ticketType);
    
    return (
      <TouchableOpacity
        style={styles.ticketCard}
        onPress={() => {
          // Navigate to ticket details screen
          navigation.navigate('TicketDetails', { ticketId: ticketTitle });
        }}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketIconContainer}>
            <Ionicons name={ticketIcon.name} size={24} color={ticketIcon.color} />
          </View>
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketTitle}>{ticketTitle}</Text>
            <Text style={styles.ticketType}>{ticketType.toUpperCase()}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteTicket(ticketTitle)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
        
        {item.url && (
          <TouchableOpacity 
            style={styles.fileIndicator}
            onPress={() => {
              setSelectedFile({ url: item.url!, name: ticketTitle });
              setShowFileViewer(true);
            }}
          >
            <Ionicons name="eye-outline" size={16} color="#3b82f6" />
            <Text style={styles.fileText}>View File</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="ticket-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyStateTitle}>No Tickets</Text>
      <Text style={styles.emptyStateSubtitle}>
        {isConfigured 
          ? 'Add your first ticket to start organizing your bookings.'
          : 'Configure Google Drive integration to start managing tickets.'
        }
      </Text>
      {!isConfigured && (
        <TouchableOpacity style={styles.configureButton} onPress={() => {
          Alert.alert(
            'Setup Instructions',
            '1. Go to Google Cloud Console\n2. Enable Google Drive API\n3. Create an API Key\n4. Create a Google Drive folder\n5. Update the config file with your API key and folder ID',
            [{ text: 'OK' }]
          );
        }}>
          <Text style={styles.configureButtonText}>Setup Instructions</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
      <Text style={styles.errorStateTitle}>Connection Error</Text>
      <Text style={styles.errorStateSubtitle}>{errorTickets}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshTickets}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TicketAnimatedBackground>
        <View style={styles.content}>
          {loadingTickets ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading tickets...</Text>
            </View>
          ) : errorTickets ? (
            renderErrorState()
          ) : tickets.length === 0 ? (
            <>
              {renderEmptyState()}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleAddTicket}
                >
                  <Text style={styles.actionButtonText}>Add Ticket</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <FlatList
                data={tickets}
                renderItem={renderTicket}
                keyExtractor={(item, index) => `${item.title}-${index}`}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={handleAddTicket}
                >
                  <Text style={styles.actionButtonText}>Add Ticket</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </TicketAnimatedBackground>
      
      <AddTicketModal
        visible={showAddTicketModal}
        onClose={() => setShowAddTicketModal(false)}
        onAddTicket={handleTicketAdded}
      />
      
      <FileViewer
        visible={showFileViewer}
        onClose={() => {
          setShowFileViewer(false);
          setSelectedFile(null);
        }}
        fileUrl={selectedFile?.url || ''}
        fileName={selectedFile?.name || ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
  },
  listContainer: {
    paddingBottom: 100,
  },
  ticketCard: {
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  ticketType: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
  ticketDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
  },
  detailIcon: {
    marginLeft: 12,
  },
  fileIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  fileText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  configureButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  configureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
  },
  errorStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 