import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, ExpenseSummary } from '../types';

import { useFirebase } from '../hooks/useFirebase';
import { GroupData, ExpenseData, PersonData } from '../services/FirebaseService';
import AddExpenseModal from '../components/AddExpenseModal';
import AddPersonModal from '../components/AddPersonModal';
import ExpenseItem from '../components/ExpenseItem';
import SettlementsSection from '../components/SettlementsSection';
import { ExpenseGroupScreenStyles } from '../styles/ExpenseGroupScreenStyles';

type ExpenseGroupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExpenseGroup'>;
type ExpenseGroupScreenRouteProp = RouteProp<RootStackParamList, 'ExpenseGroup'>;

interface Props {
  navigation: ExpenseGroupScreenNavigationProp;
  route: ExpenseGroupScreenRouteProp;
}

export default function ExpenseGroupScreen({ navigation, route }: Props) {
  const { groupId, people: routePeople } = route.params;
  
  console.log('ExpenseGroupScreen: Component rendered with groupId:', groupId);
  
  const {
    getGroup,
    getAllExpenses,
    getAllPeople,
    addExpense,
    updateExpense,
    deleteExpense,
    isConfigured,
  } = useFirebase();

  const [group, setGroup] = useState<GroupData | null>(null);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [groupPeople, setGroupPeople] = useState<PersonData[]>(routePeople || []);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);

  console.log('ExpenseGroupScreen: Current state - loadingGroup:', loadingGroup, 'group:', group ? 'exists' : 'null');

  useEffect(() => {
    console.log('ExpenseGroupScreen: Loading group with ID:', groupId);
    loadGroup();
  }, [groupId]);

  // Load people and expenses when group data is available
  useEffect(() => {
    if (group) {
      loadPeople();
      loadExpenses();
    }
  }, [group]);

  // Debug: Log expenses state changes
  useEffect(() => {
    console.log('ExpenseGroupScreen: Expenses state updated:', {
      expensesCount: expenses.length,
      expenses: expenses.map(e => ({ id: e.id, title: e.title, amount: e.amount }))
    });
  }, [expenses]);

  useEffect(() => {
    if (group) {
      navigation.setOptions({
        title: group.name,
      });
    }
  }, [group, navigation]);

  const loadGroup = async () => {
    console.log('ExpenseGroupScreen: Starting to load group...');
    setLoadingGroup(true);
    try {
      const groupData = await getGroup(groupId);
      console.log('ExpenseGroupScreen: Group data loaded:', groupData);
      setGroup(groupData);
    } catch (error) {
      console.error('ExpenseGroupScreen: Error loading group:', error);
    } finally {
      setLoadingGroup(false);
    }
  };

  const loadExpenses = async () => {
    console.log('ExpenseGroupScreen: Loading expenses...');
    setLoadingExpenses(true);
    try {
      // Get expenses from the group data instead of all expenses
      if (group && group.expenses) {
        console.log('ExpenseGroupScreen: Group expenses loaded:', group.expenses.length);
        console.log('ExpenseGroupScreen: Expenses data:', group.expenses);
        setExpenses(group.expenses);
        console.log('ExpenseGroupScreen: Expenses state updated with', group.expenses.length, 'expenses');
      } else {
        console.log('ExpenseGroupScreen: No expenses found in group');
        setExpenses([]);
      }
    } catch (error) {
      console.error('ExpenseGroupScreen: Error loading expenses:', error);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const loadPeople = async () => {
    console.log('ExpenseGroupScreen: Loading people...');
    try {
      // Get people from the group data instead of all people
      if (group && group.people) {
        console.log('ExpenseGroupScreen: Group people loaded:', group.people.length);
        setGroupPeople(group.people);
      } else {
        console.log('ExpenseGroupScreen: No people found in group');
        setGroupPeople([]);
      }
    } catch (error) {
      console.error('ExpenseGroupScreen: Error loading people:', error);
    }
  };

  const handleAddExpense = () => {
    console.log('ExpenseGroupScreen: Opening Add Expense modal');
    setShowAddExpenseModal(true);
  };

  const handleExpenseAdded = async (expense: Omit<ExpenseData, 'id'>) => {
    console.log('ExpenseGroupScreen: Adding expense:', expense);
    try {
      await addExpense(groupId, expense);
      console.log('ExpenseGroupScreen: Expense added successfully');
      setShowAddExpenseModal(false);
      // Reload the entire group to get updated data
      await loadGroup();
    } catch (error) {
      console.error('ExpenseGroupScreen: Error adding expense:', error);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(groupId, expenseId);
              console.log('ExpenseGroupScreen: Expense deleted successfully');
              // Reload the entire group to get updated data
              await loadGroup();
            } catch (error) {
              console.error('ExpenseGroupScreen: Error deleting expense:', error);
              Alert.alert('Error', 'Failed to delete expense. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderEmptyExpenses = () => (
    <View style={ExpenseGroupScreenStyles.emptyContainer}>
      <Text style={ExpenseGroupScreenStyles.emptyTitle}>No Expenses Found</Text>
      <Text style={ExpenseGroupScreenStyles.emptySubtitle}>
        Add your first expense to start tracking!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={ExpenseGroupScreenStyles.container} edges={['left', 'right']}>
      
      {/* Main content */}
      <View style={ExpenseGroupScreenStyles.mainContent}>
        {loadingGroup || loadingExpenses ? (
          <View style={ExpenseGroupScreenStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={ExpenseGroupScreenStyles.loadingText}>Loading...</Text>
          </View>
        ) : group ? (
          <View style={ExpenseGroupScreenStyles.groupContent}>
            {/* People Section - Compact at top */}
            <View style={ExpenseGroupScreenStyles.peopleSection}>
              <View style={ExpenseGroupScreenStyles.peopleContainer}>
                {groupPeople.map((person) => (
                  <View key={person.id} style={ExpenseGroupScreenStyles.personItem}>
                    <View style={[ExpenseGroupScreenStyles.personIcon, { backgroundColor: person.color }]}>
                      <Text style={ExpenseGroupScreenStyles.personInitial}>
                        {person.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                    <Text style={ExpenseGroupScreenStyles.personName}>{person.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            {/* Balances Section */}
            <SettlementsSection 
              expenses={expenses} 
              people={groupPeople} 
              group={group} 
            />
            
            {/* Expenses List */}
            <View style={ExpenseGroupScreenStyles.expensesSection}>
              <View style={ExpenseGroupScreenStyles.expensesHeader}>
              </View>
              {loadingExpenses ? (
                <ActivityIndicator size="small" color="#6366f1" style={ExpenseGroupScreenStyles.loadingIndicator} />
              ) : (
                <View style={ExpenseGroupScreenStyles.expensesListContainer}>
                  <FlatList
                    data={expenses}
                    renderItem={({ item }) => (
                      <ExpenseItem 
                        item={item} 
                        people={groupPeople} 
                        onDelete={handleDeleteExpense}
                      />
                    )}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyExpenses}
                    contentContainerStyle={ExpenseGroupScreenStyles.expensesList}
                  />
                </View>
              )}
            </View>
            <TouchableOpacity
              style={ExpenseGroupScreenStyles.addExpenseIcon}
              onPress={handleAddExpense}
            >
              <Text style={ExpenseGroupScreenStyles.addExpenseIconText}>+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={ExpenseGroupScreenStyles.centerContent}>
            <Text style={ExpenseGroupScreenStyles.errorTitle}>Group Not Found</Text>
            <Text style={ExpenseGroupScreenStyles.errorSubtitle}>The requested expense group could not be found.</Text>
          </View>
        )}
      </View>

      {/* Modals */}
      <AddExpenseModal
        visible={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        onAddExpense={handleExpenseAdded}
        group={{ ...group, people: groupPeople } as GroupData}
      />
      
    </SafeAreaView>
  );
} 