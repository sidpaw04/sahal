import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { TicketData } from '../services/StorageService';
import { predefinedTicketTypes } from '../utils/ticketIcons';

interface AddTicketModalProps {
  visible: boolean;
  onClose: () => void;
  onAddTicket: (ticket: { type: string; title: string; url?: string }) => Promise<void>;
}

export default function AddTicketModal({ visible, onClose, onAddTicket }: AddTicketModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('flight');
  const [selectedFile, setSelectedFile] = useState<{ name: string; uri: string } | null>(null);

  // Use predefined ticket types from utils
  const ticketTypes = predefinedTicketTypes.map(t => ({
    key: t.name,
    label: t.name.charAt(0).toUpperCase() + t.name.slice(1),
    icon: t.icon,
    color: t.color,
  }));

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile({
          name: file.name || 'Unknown file',
          uri: file.uri,
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select file. Please try again.');
      console.error('Document picker error:', error);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a ticket title');
      return;
    }

    try {
      await onAddTicket({
        type,
        title: title.trim(),
        url: selectedFile?.uri || undefined,
      });

      // Reset form
      setTitle('');
      setType('flight');
      setSelectedFile(null);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleCancel = () => {
    // Reset form
    setTitle('');
    setType('flight');
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Ticket</Text>
          <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {/* Ticket Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket Type</Text>
            <View style={styles.typeContainer}>
              {ticketTypes.map((ticketType) => (
                <TouchableOpacity
                  key={ticketType.key}
                  style={[
                    styles.typeButton,
                    type === ticketType.key && {
                      backgroundColor: ticketType.color,
                      borderColor: ticketType.color,
                    },
                  ]}
                  onPress={() => setType(ticketType.key)}
                >
                  <Ionicons
                    name={ticketType.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={type === ticketType.key ? '#fff' : ticketType.color}
                  />
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === ticketType.key && styles.typeButtonTextActive,
                    ]}
                  >
                    {ticketType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ticket Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter ticket title"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* File Upload */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upload Ticket</Text>
            
            <TouchableOpacity style={styles.fileUploadButton} onPress={handleFileSelect}>
              <Ionicons name="cloud-upload-outline" size={24} color="#6366f1" />
              <Text style={styles.fileUploadText}>
                {selectedFile ? selectedFile.name : 'Select ticket file'}
              </Text>
            </TouchableOpacity>
            
            {selectedFile && (
              <View style={styles.selectedFileContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text style={styles.selectedFileText}>{selectedFile.name}</Text>
                <TouchableOpacity onPress={() => setSelectedFile(null)}>
                  <Ionicons name="close-circle" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Ticket</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 6,
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1e293b',
  },
  fileUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  fileUploadText: {
    fontSize: 16,
    color: '#6366f1',
    marginLeft: 8,
    fontWeight: '500',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  selectedFileText: {
    flex: 1,
    fontSize: 14,
    color: '#166534',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
}); 