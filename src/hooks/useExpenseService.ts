import { useState, useEffect, useCallback } from 'react';
import ExpenseService, { GroupData, PersonData, ExpenseData } from '../services/ExpenseService';

interface UseExpenseServiceReturn {
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
  addPerson: (groupId: string, person: Omit<PersonData, 'id'>) => Promise<string>;
  
  // Expenses
  expenses: ExpenseData[];
  loadingExpenses: boolean;
  errorExpenses: string | null;
  refreshExpenses: (groupId: string) => Promise<void>;
  addExpense: (groupId: string, expense: Omit<ExpenseData, 'id'>) => Promise<string>;
  updateExpense: (groupId: string, expenseId: string, updates: Partial<ExpenseData>) => Promise<void>;
  deleteExpense: (groupId: string, expenseId: string) => Promise<void>;
  
  // Group management
  getGroup: (groupId: string) => Promise<GroupData | null>;
  
  // Data management
  clearAllData: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<void>;
}

export const useExpenseService = (): UseExpenseServiceReturn => {
  const [expenseService] = useState(() => new ExpenseService());
  
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

  // Groups functions
  const refreshGroups = useCallback(async () => {
    setLoadingGroups(true);
    setErrorGroups(null);
    
    try {
      const groupsData = await expenseService.getExpenseGroups();
      setGroups(groupsData);
    } catch (error) {
      setErrorGroups(error instanceof Error ? error.message : 'Failed to load groups');
    } finally {
      setLoadingGroups(false);
    }
  }, [expenseService]);

  const addGroup = useCallback(async (group: Omit<GroupData, 'id' | 'createdDate' | 'updatedDate'>): Promise<string> => {
    try {
      const groupId = await expenseService.addExpenseGroup(group);
      await refreshGroups(); // Refresh the list
      return groupId;
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshGroups]);

  const updateGroup = useCallback(async (groupId: string, updates: Partial<GroupData>): Promise<void> => {
    try {
      await expenseService.updateExpenseGroup(groupId, updates);
      await refreshGroups(); // Refresh the list
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshGroups]);

  const deleteGroup = useCallback(async (groupId: string): Promise<void> => {
    try {
      await expenseService.deleteExpenseGroup(groupId);
      await refreshGroups(); // Refresh the list
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshGroups]);

  // People functions
  const refreshPeople = useCallback(async (groupId: string) => {
    setLoadingPeople(true);
    setErrorPeople(null);
    
    try {
      const group = await expenseService.getGroup(groupId);
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
  }, [expenseService]);

  const addPerson = useCallback(async (groupId: string, person: Omit<PersonData, 'id'>): Promise<string> => {
    try {
      const personId = await expenseService.addPerson(groupId, person);
      await refreshPeople(groupId); // Refresh the list
      return personId;
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshPeople]);

  // Expenses functions
  const refreshExpenses = useCallback(async (groupId: string) => {
    setLoadingExpenses(true);
    setErrorExpenses(null);
    
    try {
      const group = await expenseService.getGroup(groupId);
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
  }, [expenseService]);

  const addExpense = useCallback(async (groupId: string, expense: Omit<ExpenseData, 'id'>): Promise<string> => {
    try {
      const expenseId = await expenseService.addExpense(groupId, expense);
      await refreshExpenses(groupId); // Refresh the list
      return expenseId;
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshExpenses]);

  const updateExpense = useCallback(async (groupId: string, expenseId: string, updates: Partial<ExpenseData>): Promise<void> => {
    try {
      await expenseService.updateExpense(groupId, expenseId, updates);
      await refreshExpenses(groupId); // Refresh the list
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshExpenses]);

  const deleteExpense = useCallback(async (groupId: string, expenseId: string): Promise<void> => {
    try {
      await expenseService.deleteExpense(groupId, expenseId);
      await refreshExpenses(groupId); // Refresh the list
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshExpenses]);

  // Group management
  const getGroup = useCallback(async (groupId: string): Promise<GroupData | null> => {
    try {
      return await expenseService.getGroup(groupId);
    } catch (error) {
      console.error('Error getting group:', error);
      return null;
    }
  }, [expenseService]);

  // Data management
  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      await expenseService.clearAllData();
      await refreshGroups();
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshGroups]);

  const exportData = useCallback(async (): Promise<string> => {
    try {
      return await expenseService.exportData();
    } catch (error) {
      throw error;
    }
  }, [expenseService]);

  const importData = useCallback(async (jsonData: string): Promise<void> => {
    try {
      await expenseService.importData(jsonData);
      await refreshGroups();
    } catch (error) {
      throw error;
    }
  }, [expenseService, refreshGroups]);

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
    addPerson,
    
    // Expenses
    expenses,
    loadingExpenses,
    errorExpenses,
    refreshExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    
    // Group management
    getGroup,
    
    // Data management
    clearAllData,
    exportData,
    importData,
  };
}; 