import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Person {
  id: string;
  name: string;
  color: string;
}

interface AddGroupModalProps {
  visible: boolean;
  onClose: () => void;
  onAddGroup: (groupData: { name: string; people: Person[] }) => Promise<void>;
}

const COLORS = [
  '#6366f1', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#14b8a6'
];

export default function AddGroupModal({ visible, onClose, onAddGroup }: AddGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPerson = () => {
    if (!newPersonName.trim()) {
      Alert.alert('Error', 'Please enter a person name');
      return;
    }

    if (people.some(p => p.name.toLowerCase() === newPersonName.trim().toLowerCase())) {
      Alert.alert('Error', 'A person with this name already exists');
      return;
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      name: newPersonName.trim(),
      color: COLORS[people.length % COLORS.length],
    };

    setPeople([...people, newPerson]);
    setNewPersonName('');
  };

  const handleRemovePerson = (personId: string) => {
    setPeople(people.filter(p => p.id !== personId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (people.length === 0) {
      Alert.alert('Error', 'Please add at least one person to the group');
      return;
    }

    setLoading(true);
    try {
      await onAddGroup({
        name: groupName.trim(),
        people,
      });
      
      // Reset form
      setGroupName('');
      setPeople([]);
      setNewPersonName('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPerson = ({ item }: { item: Person }) => (
    <View style={styles.personItem}>
      <View style={[styles.personAvatar, { backgroundColor: item.color }]}>
        <Text style={styles.personInitial}>{item.name.charAt(0)}</Text>
      </View>
      <Text style={styles.personName}>{item.name}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePerson(item.id)}
      >
        <Ionicons name="close-circle" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Group</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Group Name */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Group Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              value={groupName}
              onChangeText={setGroupName}
              maxLength={50}
            />
          </View>

          {/* Add People */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add People</Text>
            <View style={styles.addPersonRow}>
              <TextInput
                style={[styles.input, styles.personInput]}
                placeholder="Enter person name"
                value={newPersonName}
                onChangeText={setNewPersonName}
                maxLength={30}
              />
              <TouchableOpacity
                style={styles.addPersonButton}
                onPress={handleAddPerson}
              >
                <Ionicons name="add" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* People List */}
          {people.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Group Members ({people.length})</Text>
              <FlatList
                data={people}
                renderItem={renderPerson}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleCreateGroup}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating...' : 'Create Group'}
            </Text>
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
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addPersonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personInput: {
    flex: 1,
  },
  addPersonButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  personAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  personInitial: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  personName: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  createButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 