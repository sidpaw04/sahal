import axios from 'axios';

export interface FirebaseConfig {
  cloudFunctionUrl: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

export interface ExpenseData {
  id: string;
  title: string;
  amount: number;
  currency: string;
  paidBy: string;
  splitBetween: string[];
  splitRatio?: string;
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

class FirebaseService {
  private config: FirebaseConfig;

  constructor(config: FirebaseConfig) {
    this.config = config;
  }

  // Helper method to make API calls through our backend proxy
  private async makeRequest(action: string, data: any) {
    try {
      const requestBody = {
        action,
        data: {
          ...data,
          credentials: this.config.credentials,
        },
      };

      console.log('FirebaseService: Making request to Cloud Function:', {
        action,
        hasCredentials: !!this.config.credentials,
        hasData: !!data
      });

      const response = await axios.post(this.config.cloudFunctionUrl, requestBody);

      console.log('FirebaseService: Cloud Function response status:', response.status);
      console.log('FirebaseService: Cloud Function response data:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Request failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('FirebaseService: Request failed:', error instanceof Error ? error.message : 'Unknown error');
      if (axios.isAxiosError(error)) {
        console.error('FirebaseService: Response status:', error.response?.status);
        console.error('FirebaseService: Response data:', error.response?.data);
      }
      throw error;
    }
  }

  // Get all groups from Firebase
  async getExpenseGroups(): Promise<GroupData[]> {
    try {
      const response = await this.makeRequest('getExpenseGroups', {});
      return response.groups || [];
    } catch (error) {
      console.error('Error getting expense groups:', error);
      return [];
    }
  }

  // Add a new expense group
  async addExpenseGroup(group: Omit<GroupData, 'id' | 'createdDate' | 'updatedDate'>): Promise<string> {
    try {
      const response = await this.makeRequest('addExpenseGroup', {
        name: group.name,
        currency: group.currency,
        people: group.people,
      });
      return response.groupId;
    } catch (error) {
      console.error('Error adding expense group:', error);
      throw error;
    }
  }

  // Get a specific group with its people and expenses
  async getGroup(groupId: string): Promise<GroupData | null> {
    try {
      const response = await this.makeRequest('getGroup', { groupId });
      return response.group || null;
    } catch (error) {
      console.error('Error getting group:', error);
      return null;
    }
  }

  // Add a person to a group
  async addPerson(groupId: string, person: Omit<PersonData, 'id'>): Promise<string> {
    try {
      const response = await this.makeRequest('addPerson', {
        groupId,
        name: person.name,
        color: person.color,
        avatar: person.avatar,
      });
      return response.personId;
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  }

  // Add an expense to a group
  async addExpense(groupId: string, expense: Omit<ExpenseData, 'id'>): Promise<string> {
    try {
      const response = await this.makeRequest('addExpense', {
        groupId,
        title: expense.title,
        amount: expense.amount,
        currency: expense.currency,
        paidBy: expense.paidBy,
        splitBetween: expense.splitBetween,
        splitRatio: expense.splitRatio,
        date: expense.date,
        category: expense.category,
        notes: expense.notes,
        location: expense.location,
      });
      return response.expenseId;
    } catch (error) {
      console.error('Error adding expense:', error);
      throw error;
    }
  }

  // Update an expense
  async updateExpense(groupId: string, expenseId: string, updates: Partial<ExpenseData>): Promise<void> {
    try {
      await this.makeRequest('updateExpense', {
        groupId,
        expenseId,
        updates,
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  // Delete an expense
  async deleteExpense(groupId: string, expenseId: string): Promise<void> {
    try {
      await this.makeRequest('deleteExpense', {
        groupId,
        expenseId,
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }

  // Get all people across all groups
  async getAllPeople(): Promise<PersonData[]> {
    try {
      const response = await this.makeRequest('getAllPeople', {});
      return response.people || [];
    } catch (error) {
      console.error('Error getting all people:', error);
      return [];
    }
  }

  // Get all expenses across all groups
  async getAllExpenses(): Promise<ExpenseData[]> {
    try {
      const response = await this.makeRequest('getAllExpenses', {});
      return response.expenses || [];
    } catch (error) {
      console.error('Error getting all expenses:', error);
      return [];
    }
  }

  // Test connection to Firebase
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('getExpenseGroups', {});
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // Initialize Firebase (no-op for Firebase, kept for compatibility)
  async initializeSpreadsheet(): Promise<void> {
    // Firebase doesn't need initialization like Google Sheets
    console.log('Firebase is ready to use!');
  }
}

export default FirebaseService; 