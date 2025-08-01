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
import { ExpenseData, PersonData, GroupData } from '../services/FirebaseService';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useExpenseService } from '../hooks/useExpenseService';
import AddExpenseModal from '../components/AddExpenseModal';
import ExpenseItem from '../components/ExpenseItem';
import SettlementsSection from '../components/SettlementsSection';
import { MoneyAnimatedBackground } from '../components/AnimatedBackground';

type NewExpensesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExpensesMain'>;

interface Props {
  navigation: NewExpensesScreenNavigationProp;
}

interface Person {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export default function NewExpensesScreen({ navigation }: Props) {
  const { groups, loadingGroups, errorGroups } = useExpenseService();
  const [selectedGroup, setSelectedGroup] = useState<GroupData | null>(null);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'transport' | 'accommodation' | 'activities' | 'shopping' | 'other'>('all');

  // Convert existing data to new format
  const people: Person[] = useMemo(() => {
    if (!selectedGroup?.people) return [];
    return selectedGroup.people.map(person => ({
      id: person.id,
      name: person.name,
      color: getPersonColor(person.id),
    }));
  }, [selectedGroup]);

  const getPersonColor = (id: string) => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
    const index = parseInt(id) % colors.length;
    return colors[index];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'food': return 'restaurant';
      case 'transport': return 'car';
      case 'accommodation': return 'bed';
      case 'activities': return 'camera';
      case 'shopping': return 'bag';
      case 'other': return 'ellipse';
      default: return 'ellipse';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'food': return '#f59e0b';
      case 'transport': return '#3b82f6';
      case 'accommodation': return '#8b5cf6';
      case 'activities': return '#10b981';
      case 'shopping': return '#ef4444';
      case 'other': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const filteredExpenses = useMemo(() => {
    if (!selectedGroup?.expenses) return [];
    return selectedGroup.expenses.filter(expense => 
      activeFilter === 'all' || expense.category === activeFilter
    );
  }, [selectedGroup, activeFilter]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const expensesByPerson = useMemo(() => {
    const personTotals: { [key: string]: number } = {};
    people.forEach(person => {
      personTotals[person.id] = 0;
    });

    filteredExpenses.forEach(expense => {
      if (expense.paidBy) {
        personTotals[expense.paidBy] += expense.amount;
      }
    });

    return personTotals;
  }, [filteredExpenses, people]);

  const handleGroupSelect = (group: GroupData) => {
    setSelectedGroup(group);
  };

  const handleAddExpense = () => {
    if (!selectedGroup) {
      Alert.alert('No Group Selected', 'Please select a group first.');
      return;
    }
    setShowAddExpenseModal(true);
  };

  const handleExpenseAdded = async (expense: Omit<ExpenseData, 'id'>) => {
    // The expense service will handle the update
    setShowAddExpenseModal(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          // Handle deletion through expense service
        }},
      ]
    );
  };

  const renderGroupCard = ({ item }: { item: GroupData }) => (
    <TouchableOpacity
      style={[
        NewExpensesStyles.groupCard,
        selectedGroup?.id === item.id && NewExpensesStyles.selectedGroupCard
      ]}
      onPress={() => handleGroupSelect(item)}
      activeOpacity={0.7}
    >
      <View style={NewExpensesStyles.groupHeader}>
        <View style={[
          NewExpensesStyles.groupIcon,
          { backgroundColor: getPersonColor(item.id) + '20' }
        ]}>
          <Ionicons name="people" size={20} color={getPersonColor(item.id)} />
        </View>
        <View style={NewExpensesStyles.groupInfo}>
          <Text style={NewExpensesStyles.groupName}>{item.name}</Text>
          <Text style={NewExpensesStyles.groupMembers}>
            {item.people?.length || 0} members
          </Text>
        </View>
        <View style={NewExpensesStyles.groupTotal}>
          <Text style={NewExpensesStyles.groupTotalAmount}>
            €{item.expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExpenseItem = ({ item }: { item: ExpenseData }) => (
    <ExpenseItem
      item={item}
      people={selectedGroup?.people || []}
      onDelete={handleDeleteExpense}
    />
  );

  const renderPersonAvatar = (person: Person) => (
    <View key={person.id} style={NewExpensesStyles.personAvatar}>
      <View style={[
        NewExpensesStyles.avatar,
        { backgroundColor: person.color }
      ]}>
        <Text style={NewExpensesStyles.avatarText}>
          {person.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={NewExpensesStyles.personName}>{person.name}</Text>
      <Text style={NewExpensesStyles.personTotal}>
        €{expensesByPerson[person.id] || 0}
      </Text>
    </View>
  );

  if (loadingGroups) {
    return (
      <SafeAreaView style={NewExpensesStyles.container}>
        <View style={NewExpensesStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={NewExpensesStyles.loadingText}>Loading expenses...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorGroups) {
    return (
      <SafeAreaView style={NewExpensesStyles.container}>
        <View style={NewExpensesStyles.errorContainer}>
          <Text style={NewExpensesStyles.errorText}>
            {errorGroups}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={NewExpensesStyles.container}>
      <MoneyAnimatedBackground>
        <View style={NewExpensesStyles.mainContent}>
          {/* Header */}
          <View style={NewExpensesStyles.header}>
            <View style={NewExpensesStyles.headerContent}>
              <View>
                <Text style={NewExpensesStyles.headerTitle}>Expenses</Text>
                <Text style={NewExpensesStyles.headerSubtitle}>
                  Track and split expenses
                </Text>
              </View>
              <TouchableOpacity
                style={NewExpensesStyles.addButton}
                onPress={handleAddExpense}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Groups */}
          {groups && groups.length > 0 && (
            <View style={NewExpensesStyles.groupsSection}>
              <Text style={NewExpensesStyles.sectionTitle}>Groups</Text>
              <FlatList
                data={groups}
                renderItem={renderGroupCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={NewExpensesStyles.groupsList}
              />
            </View>
          )}

          {selectedGroup ? (
            <>
              {/* People Summary */}
              <View style={NewExpensesStyles.peopleSection}>
                <Text style={NewExpensesStyles.sectionTitle}>Members</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={NewExpensesStyles.peopleList}
                >
                  {people.map(renderPersonAvatar)}
                </ScrollView>
              </View>

              {/* Filter Tabs */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={NewExpensesStyles.filterContainer}
                contentContainerStyle={NewExpensesStyles.filterContent}
              >
                {[
                  { id: 'all', label: 'All', icon: 'apps' },
                  { id: 'food', label: 'Food', icon: 'restaurant' },
                  { id: 'transport', label: 'Transport', icon: 'car' },
                  { id: 'accommodation', label: 'Accommodation', icon: 'bed' },
                  { id: 'activities', label: 'Activities', icon: 'camera' },
                  { id: 'shopping', label: 'Shopping', icon: 'bag' },
                  { id: 'other', label: 'Other', icon: 'ellipse' },
                ].map(filter => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      NewExpensesStyles.filterTab,
                      activeFilter === filter.id && NewExpensesStyles.activeFilterTab
                    ]}
                    onPress={() => setActiveFilter(filter.id as any)}
                  >
                    <Ionicons
                      name={filter.icon as any}
                      size={16}
                      color={activeFilter === filter.id ? '#fff' : '#6366f1'}
                    />
                    <Text style={[
                      NewExpensesStyles.filterText,
                      activeFilter === filter.id && NewExpensesStyles.activeFilterText
                    ]}>
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Total Summary */}
              <View style={NewExpensesStyles.totalSection}>
                <View style={NewExpensesStyles.totalCard}>
                  <Text style={NewExpensesStyles.totalLabel}>Total Expenses</Text>
                  <Text style={NewExpensesStyles.totalAmount}>
                    €{totalExpenses.toFixed(2)}
                  </Text>
                  <Text style={NewExpensesStyles.totalSubtext}>
                    {filteredExpenses.length} expenses
                  </Text>
                </View>
              </View>

              {/* Settlements */}
              {selectedGroup && (
                <SettlementsSection
                  expenses={filteredExpenses}
                  people={selectedGroup.people}
                  group={selectedGroup}
                />
              )}

              {/* Expenses List */}
              <View style={NewExpensesStyles.expensesSection}>
                <View style={NewExpensesStyles.expensesHeader}>
                  <Text style={NewExpensesStyles.sectionTitle}>Expenses</Text>
                  <TouchableOpacity
                    style={NewExpensesStyles.addExpenseButton}
                    onPress={handleAddExpense}
                  >
                    <Text style={NewExpensesStyles.addExpenseButtonText}>+ Add</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={filteredExpenses}
                  renderItem={renderExpenseItem}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={NewExpensesStyles.expensesList}
                  ListEmptyComponent={
                    <View style={NewExpensesStyles.emptyContainer}>
                      <Ionicons name="receipt-outline" size={48} color="#9ca3af" />
                      <Text style={NewExpensesStyles.emptyText}>No expenses yet</Text>
                      <Text style={NewExpensesStyles.emptySubtext}>
                        Add your first expense to get started
                      </Text>
                    </View>
                  }
                />
              </View>
            </>
          ) : (
            <View style={NewExpensesStyles.noGroupContainer}>
              <Ionicons name="people-outline" size={48} color="#9ca3af" />
              <Text style={NewExpensesStyles.noGroupText}>Select a Group</Text>
              <Text style={NewExpensesStyles.noGroupSubtext}>
                Choose a group to view and manage expenses
              </Text>
            </View>
          )}
        </View>

        {/* Add Expense Modal */}
        {selectedGroup && (
          <AddExpenseModal
            visible={showAddExpenseModal}
            onClose={() => setShowAddExpenseModal(false)}
            onAddExpense={handleExpenseAdded}
            group={selectedGroup}
          />
        )}
      </MoneyAnimatedBackground>
    </SafeAreaView>
  );
}

const NewExpensesStyles = StyleSheet.create({
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ef4444',
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
  groupsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  groupsList: {
    paddingRight: 20,
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedGroupCard: {
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  groupMembers: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  groupTotal: {
    alignItems: 'flex-end',
  },
  groupTotalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  peopleSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  peopleList: {
    paddingRight: 20,
  },
  personAvatar: {
    alignItems: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  personName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  personTotal: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 2,
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
  totalSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  totalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  totalSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  expensesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addExpenseButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addExpenseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  expensesList: {
    paddingBottom: 20,
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
  noGroupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noGroupText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  noGroupSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
}); 