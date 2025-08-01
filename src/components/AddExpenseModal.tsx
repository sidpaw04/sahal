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
import { GroupData, ExpenseData } from '../services/FirebaseService';
import { predefinedCategories } from '../utils/categoryIcons';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<ExpenseData, 'id'>) => Promise<void>;
  group: GroupData | null;
}

const EXPENSE_CATEGORIES = predefinedCategories.map(cat => cat.name);

export default function AddExpenseModal({
  visible,
  onClose,
  onAddExpense,
  group,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [paidBy, setPaidBy] = useState('');
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [splitRatio, setSplitRatio] = useState('1:1:1');
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle('');
    setAmount('');
    setCategory(EXPENSE_CATEGORIES[0]);
    setPaidBy('');
    setSplitBetween([]);
    setSplitRatio('1:1:1');
    setNotes('');
    setLocation('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddExpense = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an expense title.');
      return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount))) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    if (!paidBy) {
      Alert.alert('Error', 'Please select who paid for this expense.');
      return;
    }

    if (splitBetween.length === 0) {
      Alert.alert('Error', 'Please select who should split this expense.');
      return;
    }

    setLoading(true);
    try {
      await onAddExpense({
        title: title.trim(),
        amount: parseFloat(amount),
        currency: group?.currency || 'EUR',
        paidBy,
        splitBetween,
        splitRatio,
        date: new Date().toISOString().split('T')[0],
        category,
        notes: notes.trim() || undefined,
        location: location.trim() || undefined,
      });
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePersonInSplit = (personId: string) => {
    if (splitBetween.includes(personId)) {
      setSplitBetween(splitBetween.filter(id => id !== personId));
    } else {
      setSplitBetween([...splitBetween, personId]);
    }
  };

  const renderPersonSelector = (title: string, selectedId: string, onSelect: (id: string) => void) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.peopleScroll}>
        {group?.people.map((person) => (
          <TouchableOpacity
            key={person.id}
            style={[
              styles.personOption,
              selectedId === person.id && styles.selectedPersonOption,
            ]}
            onPress={() => onSelect(person.id)}
          >
            <View style={[styles.personAvatar, { backgroundColor: person.color }]}>
              <Text style={styles.personInitial}>{person.name.charAt(0)}</Text>
            </View>
            <Text style={[
              styles.personName,
              selectedId === person.id && styles.selectedPersonName,
            ]}>
              {person.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderSplitSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Split Between</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.peopleScroll}>
        {group?.people.map((person) => (
          <TouchableOpacity
            key={person.id}
            style={[
              styles.personOption,
              splitBetween.includes(person.id) && styles.selectedPersonOption,
            ]}
            onPress={() => togglePersonInSplit(person.id)}
          >
            <View style={[styles.personAvatar, { backgroundColor: person.color }]}>
              <Text style={styles.personInitial}>{person.name.charAt(0)}</Text>
            </View>
            <Text style={[
              styles.personName,
              splitBetween.includes(person.id) && styles.selectedPersonName,
            ]}>
              {person.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderCategorySelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {predefinedCategories.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            style={[
              styles.categoryOption,
              category === cat.name && styles.selectedCategoryOption,
            ]}
            onPress={() => setCategory(cat.name)}
          >
            <Ionicons 
              name={cat.icon as keyof typeof Ionicons.glyphMap} 
              size={24} 
              color={category === cat.name ? '#fff' : cat.color} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Expense</Text>
          <TouchableOpacity
            onPress={handleAddExpense}
            disabled={loading}
            style={[styles.addButton, loading && styles.disabledButton]}
          >
            <Text style={[styles.addButtonText, loading && styles.disabledButtonText]}>
              {loading ? 'Adding...' : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expense Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Expense title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          {renderCategorySelector()}

          {group && (
            <>
              {console.log('AddExpenseModal: Group people:', group.people)}
              {group.people && group.people.length > 0 ? (
                <>
                  {renderPersonSelector('Paid By', paidBy, setPaidBy)}
                  {renderSplitSelector()}
                  
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Split Ratio</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Split ratio (e.g., 2:1, 3:2:1)"
                      value={splitRatio}
                      onChangeText={setSplitRatio}
                    />
                    <Text style={styles.helperText}>
                      Default is 1:1:1 (equal split). Use ratios like 2:1:1 for uneven splits.
                    </Text>
                  </View>
                </>
              ) : (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>People</Text>
                  <Text style={styles.errorText}>No people found in this group. Please add people first.</Text>
                </View>
              )}
            </>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Location (optional)"
              value={location}
              onChangeText={setLocation}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  disabledButtonText: {
    color: '#d1d5db',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  contentContainer: {
    flexGrow: 1,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  peopleScroll: {
    marginBottom: 8,
  },
  personOption: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPersonOption: {
    borderColor: '#6366f1',
    backgroundColor: '#f0f4ff',
  },
  personAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  personInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  personName: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedPersonName: {
    color: '#6366f1',
    fontWeight: 'bold',
  },
  categoryScroll: {
    marginBottom: 8,
  },
  categoryOption: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 20,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  selectedCategoryOption: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 10,
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
}); 