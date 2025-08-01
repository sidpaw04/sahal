import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, ExpenseGroup } from '../types';
import { MoneyAnimatedBackground } from '../components/AnimatedBackground';
import { useFirebase } from '../hooks/useFirebase';
import AddGroupModal from '../components/AddGroupModal';

type ExpensesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExpenseGroups'>;

interface Props {
  navigation: ExpensesScreenNavigationProp;
}

export default function ExpensesScreen({ navigation }: Props) {
  const {
    groups,
    loadingGroups,
    errorGroups,
    refreshGroups,
    addGroup,
    getAllPeople,
    isConfigured,
    testConnection,
  } = useFirebase();

  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [allPeople, setAllPeople] = useState<any[]>([]);

  useEffect(() => {
    if (isConfigured) {
      refreshGroups();
      loadPeople();
    }
  }, [isConfigured, refreshGroups]);

  useEffect(() => {
    console.log('ExpensesScreen: allPeople state changed:', allPeople.length, 'people');
  }, [allPeople]);

  const loadPeople = async () => {
    try {
      console.log('ExpensesScreen: Loading people...');
      const people = await getAllPeople();
      console.log('ExpensesScreen: People loaded:', people.length, people);
      setAllPeople(people);
      console.log('ExpensesScreen: allPeople state updated with:', people.length, 'people');
    } catch (error) {
      console.error('ExpensesScreen: Error loading people:', error);
    }
  };

  const handleAddGroup = () => {
    if (!isConfigured) {
      Alert.alert(
        'Firebase Not Configured',
        'Please configure Firebase integration first. Check the configuration file for setup instructions.',
        [{ text: 'OK' }]
      );
      return;
    }

    setShowAddGroupModal(true);
  };

  const handleGroupCreated = async (groupData: { name: string; people: any[] }) => {
    try {
      await addGroup({
        name: groupData.name,
        currency: 'EUR',
        people: groupData.people,
        expenses: [],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create expense group. Please try again.');
      throw error;
    }
  };

  const calculateGroupSummary = (group: ExpenseGroup) => {
    const total = group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    // Use 3 people for per-person calculation as requested
    const perPerson = total / 3;
    return { total, perPerson };
  };

  const renderExpenseGroup = ({ item }: { item: ExpenseGroup }) => {
    const { total, perPerson } = calculateGroupSummary(item);
    
    return (
      <TouchableOpacity
        style={styles.groupCard}
        onPress={() => {
          console.log('ExpensesScreen: Navigating to ExpenseGroup with people:', allPeople);
          navigation.navigate('ExpenseGroup', { 
            groupId: item.id,
            people: allPeople 
          });
        }}
      >
        <View style={styles.groupHeader}>
          <Text style={styles.groupName}>{item.name}</Text>
          <View style={styles.groupStats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total</Text>
              <Text style={styles.statValue}>{item.currency} {total.toFixed(2)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Per Person</Text>
              <Text style={styles.statValue}>{item.currency} {perPerson.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.peopleList}>
          {item.people.slice(0, 3).map((person) => (
            <View key={person.id} style={[styles.personAvatar, { backgroundColor: person.color }]}>
              <Text style={styles.personInitial}>{person.name.charAt(0)}</Text>
            </View>
          ))}
          {item.people.length > 3 && (
            <View style={styles.morePeople}>
              <Text style={{ color: '#6b7280', fontSize: 12 }}>+{item.people.length - 3}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="wallet-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyStateTitle}>No Expense Groups</Text>
      <Text style={styles.emptyStateSubtitle}>
        {isConfigured 
          ? 'Create your first expense group to start tracking shared expenses.'
          : 'Configure Google Sheets integration to start tracking expenses.'
        }
      </Text>
      {!isConfigured && (
        <TouchableOpacity style={styles.configureButton} onPress={() => {
          Alert.alert(
            'Setup Instructions',
            '1. Go to Google Cloud Console\n2. Enable Google Sheets API\n3. Create an API Key\n4. Create a Google Sheets document\n5. Update the config file with your API key and spreadsheet ID',
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
      <Text style={styles.errorStateSubtitle}>{errorGroups}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={refreshGroups}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <MoneyAnimatedBackground>
        <View style={styles.content}>
          {loadingGroups ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="large" color="#6366f1" />
              <Text style={styles.loadingText}>Loading expense groups...</Text>
            </View>
          ) : errorGroups ? (
            renderErrorState()
          ) : groups.length === 0 ? (
            <>
              {renderEmptyState()}
              {
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButton} 
                  //onPress={handleAddGroup}
                >
                  <Text style={styles.actionButtonText}>Add Group</Text>
                </TouchableOpacity>
              </View>
              }
            </>
          ) : (
            <>
              <FlatList
                data={groups}
                renderItem={renderExpenseGroup}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
              { 
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButtonDisabled} 
                  //onPress={handleAddGroup}
                >
                  <Text style={styles.actionButtonText}>Add Group</Text>
                </TouchableOpacity>
              </View>
              }
            </>
          )}
        </View>
        <AddGroupModal
          visible={showAddGroupModal}
          onClose={() => setShowAddGroupModal(false)}
          onAddGroup={handleGroupCreated}
        />
      </MoneyAnimatedBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listContainer: {
    paddingBottom: 100,
  },
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupHeader: {
    marginBottom: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  groupStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  peopleList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  personInitial: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  morePeople: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  },
  configureButton: {
    marginTop: 24,
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  configureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 8,
  },
  errorStateSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'transparent',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 0,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonDisabled: {
    backgroundColor: '#9ca3af',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 