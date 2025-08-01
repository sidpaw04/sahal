import { useState, useEffect, useCallback } from 'react';
import FirebaseService, { GroupData, PersonData, ExpenseData } from '../services/FirebaseService';
import firebaseConfig from '../config/firebaseConfig';

interface UseFirebaseReturn {
  // Groups
  groups: GroupData[];
  loadingGroups: boolean;
  errorGroups: string | null;
  refreshGroups: () => Promise<void>;
  addGroup: (group: Omit<GroupData, 'id' | 'createdDate' | 'updatedDate'>) => Promise<string>;
  updateGroup: (groupId: string, updates: Partial<GroupData>) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  
  // People
  people: PersonData[];
  loadingPeople: boolean;
  errorPeople: string | null;
  refreshPeople: (groupId: string) => Promise<void>;
  getAllPeople: () => Promise<PersonData[]>;
  addPerson: (groupId: string, person: Omit<PersonData, 'id'>) => Promise<string>;
  
  // Expenses
  expenses: ExpenseData[];
  loadingExpenses: boolean;
  errorExpenses: string | null;
  refreshExpenses: (groupId: string) => Promise<void>;
  getAllExpenses: () => Promise<ExpenseData[]>;
  addExpense: (groupId: string, expense: Omit<ExpenseData, 'id'>) => Promise<string>;
  updateExpense: (groupId: string, expenseId: string, updates: Partial<ExpenseData>) => Promise<void>;
  deleteExpense: (groupId: string, expenseId: string) => Promise<void>;
  
  // Group management
  getGroup: (groupId: string) => Promise<GroupData | null>;
  
  // Connection status
  isConfigured: boolean;
  testConnection: () => Promise<boolean>;
  initializeSpreadsheet: () => Promise<void>;
}

export const useFirebase = (): UseFirebaseReturn => {
  const [firebaseService] = useState(() => new FirebaseService(firebaseConfig));
  
  // Groups state
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [errorGroups, setErrorGroups] = useState<string | null>(null);
  
  // People state
  const [people, setPeople] = useState<PersonData[]>([]);
  const [loadingPeople, setLoadingPeople] = useState(false);
  const [errorPeople, setErrorPeople] = useState<string | null>(null);
  
  // Expenses state
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [errorExpenses, setErrorExpenses] = useState<string | null>(null);

  // Check if configured
  const isConfigured = firebaseConfig.cloudFunctionUrl !== 'YOUR_CLOUD_FUNCTION_URL' && 
                      firebaseConfig.credentials.client_email !== 'YOUR_SERVICE_ACCOUNT_EMAIL@project.iam.gserviceaccount.com' &&
                      firebaseConfig.credentials.private_key !== '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n';

  // Initialize Firebase
  const initializeSpreadsheet = useCallback(async (): Promise<void> => {
    if (!isConfigured) {
      return;
    }
    
    try {
      await firebaseService.initializeSpreadsheet();
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }, [firebaseService, isConfigured]);

  // Test connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!isConfigured) {
      return false;
    }
    
    try {
      return await firebaseService.testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }, [firebaseService, isConfigured]);

  // Groups functions
  const refreshGroups = useCallback(async () => {
    if (!isConfigured) {
      setErrorGroups('Firebase not configured');
      return;
    }

    setLoadingGroups(true);
    setErrorGroups(null);
    
    try {
      const groupsData = await firebaseService.getExpenseGroups();
      setGroups(groupsData);
    } catch (error) {
      setErrorGroups(error instanceof Error ? error.message : 'Failed to load groups');
    } finally {
      setLoadingGroups(false);
    }
  }, [firebaseService, isConfigured]);

  const addGroup = useCallback(async (group: Omit<GroupData, 'id' | 'createdDate' | 'updatedDate'>): Promise<string> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const groupId = await firebaseService.addExpenseGroup(group);
      await refreshGroups(); // Refresh the list
      return groupId;
    } catch (error) {
      throw error;
    }
  }, [firebaseService, refreshGroups, isConfigured]);

  const updateGroup = useCallback(async (groupId: string, updates: Partial<GroupData>): Promise<void> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      // For now, we'll just refresh the groups since updating groups is complex
      // In a real implementation, you'd update the specific group in Firebase
      await refreshGroups();
    } catch (error) {
      throw error;
    }
  }, [firebaseService, refreshGroups, isConfigured]);

  const deleteGroup = useCallback(async (groupId: string): Promise<void> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      // For now, we'll just refresh the groups since deleting groups is complex
      // In a real implementation, you'd delete the specific group from Firebase
      await refreshGroups();
    } catch (error) {
      throw error;
    }
  }, [firebaseService, refreshGroups, isConfigured]);

  // People functions
  const refreshPeople = useCallback(async (groupId: string) => {
    if (!isConfigured) {
      setErrorPeople('Firebase not configured');
      return;
    }

    setLoadingPeople(true);
    setErrorPeople(null);
    
    try {
      const group = await firebaseService.getGroup(groupId);
      if (group) {
        setPeople(group.people);
      } else {
        setPeople([]);
      }
    } catch (error) {
      setErrorPeople(error instanceof Error ? error.message : 'Failed to load people');
    } finally {
      setLoadingPeople(false);
    }
  }, [firebaseService, isConfigured]);

  const addPerson = useCallback(async (groupId: string, person: Omit<PersonData, 'id'>): Promise<string> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const personId = await firebaseService.addPerson(groupId, person);
      await refreshPeople(groupId); // Refresh the list
      return personId;
    } catch (error) {
      throw error;
    }
  }, [firebaseService, refreshPeople, isConfigured]);

  // Expenses functions
  const refreshExpenses = useCallback(async (groupId: string) => {
    if (!isConfigured) {
      setErrorExpenses('Firebase not configured');
      return;
    }

    setLoadingExpenses(true);
    setErrorExpenses(null);
    
    try {
      const group = await firebaseService.getGroup(groupId);
      if (group) {
        setExpenses(group.expenses);
      } else {
        setExpenses([]);
      }
    } catch (error) {
      setErrorExpenses(error instanceof Error ? error.message : 'Failed to load expenses');
    } finally {
      setLoadingExpenses(false);
    }
  }, [firebaseService, isConfigured]);

  const addExpense = useCallback(async (groupId: string, expense: Omit<ExpenseData, 'id'>): Promise<string> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      const expenseId = await firebaseService.addExpense(groupId, expense);
      await refreshExpenses(groupId); // Refresh the list
      return expenseId;
    } catch (error) {
      throw error;
    }
  }, [firebaseService, refreshExpenses, isConfigured]);

  const updateExpense = useCallback(async (groupId: string, expenseId: string, updates: Partial<ExpenseData>): Promise<void> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      await firebaseService.updateExpense(groupId, expenseId, updates);
      await refreshExpenses(groupId); // Refresh the list
    } catch (error) {
      throw error;
    }
  }, [firebaseService, refreshExpenses, isConfigured]);

  const deleteExpense = useCallback(async (groupId: string, expenseId: string): Promise<void> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      await firebaseService.deleteExpense(groupId, expenseId);
      await refreshExpenses(groupId); // Refresh the list
    } catch (error) {
      throw error;
    }
  }, [firebaseService, refreshExpenses, isConfigured]);

  const getAllExpenses = useCallback(async (): Promise<ExpenseData[]> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      return await firebaseService.getAllExpenses();
    } catch (error) {
      console.error('Error getting all expenses:', error);
      return [];
    }
  }, [firebaseService, isConfigured]);

  const getAllPeople = useCallback(async (): Promise<PersonData[]> => {
    if (!isConfigured) {
      throw new Error('Firebase not configured');
    }

    try {
      console.log('useFirebase: Calling getAllPeople...');
      const people = await firebaseService.getAllPeople();
      console.log('useFirebase: getAllPeople result:', people);
      return people;
    } catch (error) {
      console.error('Error getting all people:', error);
      return [];
    }
  }, [firebaseService, isConfigured]);

  // Group management
  const getGroup = useCallback(async (groupId: string): Promise<GroupData | null> => {
    if (!isConfigured) {
      return null;
    }

    try {
      return await firebaseService.getGroup(groupId);
    } catch (error) {
      console.error('Error getting group:', error);
      return null;
    }
  }, [firebaseService, isConfigured]);

  // Initialize Firebase on first load
  useEffect(() => {
    if (isConfigured) {
      initializeSpreadsheet();
    }
  }, [isConfigured, initializeSpreadsheet]);

  return {
    // Groups
    groups,
    loadingGroups,
    errorGroups,
    refreshGroups,
    addGroup,
    updateGroup,
    deleteGroup,
    
    // People
    people,
    loadingPeople,
    errorPeople,
    refreshPeople,
    getAllPeople,
    addPerson,
    
    // Expenses
    expenses,
    loadingExpenses,
    errorExpenses,
    refreshExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getAllExpenses,
    
    // Group management
    getGroup,
    
    // Connection status
    isConfigured,
    testConnection,
    initializeSpreadsheet,
  };
}; 