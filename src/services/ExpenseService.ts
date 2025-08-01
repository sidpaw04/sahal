import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ExpenseData {
  id: string;
  title: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitBetween: string[];
  date: string;
  category: string;
  notes?: string;
  location?: string;
}

export interface PersonData {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface GroupData {
  id: string;
  name: string;
  currency: string;
  people: PersonData[];
  expenses: ExpenseData[];
  createdDate: string;
  updatedDate: string;
}

class ExpenseService {
  private storageKey = 'expense_tracker_data';

  // Get all groups
  async getExpenseGroups(): Promise<GroupData[]> {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error loading expense groups:', error);
      return [];
    }
  }

  // Save all groups
  private async saveExpenseGroups(groups: GroupData[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(groups));
    } catch (error) {
      console.error('Error saving expense groups:', error);
      throw error;
    }
  }

  // Add a new group
  async addExpenseGroup(group: Omit<GroupData, 'id' | 'createdDate' | 'updatedDate'>): Promise<string> {
    try {
      const groups = await this.getExpenseGroups();
      const newGroup: GroupData = {
        ...group,
        id: Date.now().toString(),
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      };
      
      groups.push(newGroup);
      await this.saveExpenseGroups(groups);
      return newGroup.id;
    } catch (error) {
      console.error('Error adding expense group:', error);
      throw error;
    }
  }

  // Update a group
  async updateExpenseGroup(groupId: string, updates: Partial<GroupData>): Promise<void> {
    try {
      const groups = await this.getExpenseGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        groups[groupIndex] = {
          ...groups[groupIndex],
          ...updates,
          updatedDate: new Date().toISOString(),
        };
        await this.saveExpenseGroups(groups);
      }
    } catch (error) {
      console.error('Error updating expense group:', error);
      throw error;
    }
  }

  // Delete a group
  async deleteExpenseGroup(groupId: string): Promise<void> {
    try {
      const groups = await this.getExpenseGroups();
      const filteredGroups = groups.filter(g => g.id !== groupId);
      await this.saveExpenseGroups(filteredGroups);
    } catch (error) {
      console.error('Error deleting expense group:', error);
      throw error;
    }
  }

  // Add a person to a group
  async addPerson(groupId: string, person: Omit<PersonData, 'id'>): Promise<string> {
    try {
      const groups = await this.getExpenseGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        const newPerson: PersonData = {
          ...person,
          id: Date.now().toString(),
        };
        
        groups[groupIndex].people.push(newPerson);
        groups[groupIndex].updatedDate = new Date().toISOString();
        await this.saveExpenseGroups(groups);
        return newPerson.id;
      }
      throw new Error('Group not found');
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  }

  // Add an expense to a group
  async addExpense(groupId: string, expense: Omit<ExpenseData, 'id'>): Promise<string> {
    try {
      const groups = await this.getExpenseGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        const newExpense: ExpenseData = {
          ...expense,
          id: Date.now().toString(),
        };
        
        groups[groupIndex].expenses.push(newExpense);
        groups[groupIndex].updatedDate = new Date().toISOString();
        await this.saveExpenseGroups(groups);
        return newExpense.id;
      }
      throw new Error('Group not found');
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  // Update an expense
  async updateExpense(groupId: string, expenseId: string, updates: Partial<ExpenseData>): Promise<void> {
    try {
      const groups = await this.getExpenseGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        const expenseIndex = groups[groupIndex].expenses.findIndex(e => e.id === expenseId);
        
        if (expenseIndex !== -1) {
          groups[groupIndex].expenses[expenseIndex] = {
            ...groups[groupIndex].expenses[expenseIndex],
            ...updates,
          };
          groups[groupIndex].updatedDate = new Date().toISOString();
          await this.saveExpenseGroups(groups);
        }
      }
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  // Delete an expense
  async deleteExpense(groupId: string, expenseId: string): Promise<void> {
    try {
      const groups = await this.getExpenseGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex !== -1) {
        groups[groupIndex].expenses = groups[groupIndex].expenses.filter(e => e.id !== expenseId);
        groups[groupIndex].updatedDate = new Date().toISOString();
        await this.saveExpenseGroups(groups);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  // Get a specific group
  async getGroup(groupId: string): Promise<GroupData | null> {
    try {
      const groups = await this.getExpenseGroups();
      return groups.find(g => g.id === groupId) || null;
    } catch (error) {
      console.error('Error getting group:', error);
      return null;
    }
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Export data (for backup)
  async exportData(): Promise<string> {
    try {
      const data = await this.getExpenseGroups();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Import data (for restore)
  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      await this.saveExpenseGroups(data);
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}

export default ExpenseService; 