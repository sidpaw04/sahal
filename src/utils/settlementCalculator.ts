import { ExpenseData, PersonData } from '../services/FirebaseService';

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface Balance {
  [personId: string]: number;
}

export class SettlementCalculator {
  static calculateBalances(expenses: ExpenseData[], people: PersonData[]): Balance {
    const balances: Balance = {};
    
    // Initialize balances for all people
    people.forEach(person => {
      balances[person.id] = 0;
    });
    
    // Calculate net amounts for each person
    expenses.forEach(expense => {
      const paidBy = expense.paidBy;
      const amount = expense.amount;
      const splitBetween = expense.splitBetween;
      
      // Add the full amount to the person who paid
      balances[paidBy] += amount;
      
      // Subtract each person's share from their balance
      const splitAmount = amount / splitBetween.length; // Equal split for now
      splitBetween.forEach(personId => {
        balances[personId] -= splitAmount;
      });
    });
    
    return balances;
  }

  static getSettlements(expenses: ExpenseData[], people: PersonData[]): Settlement[] {
    const balances = this.calculateBalances(expenses, people);
    const settlements: Settlement[] = [];
    
    const creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0)
      .sort(([_, a], [__, b]) => b - a);
    
    const debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < 0)
      .sort(([_, a], [__, b]) => a - b);
    
    let creditorIndex = 0;
    let debtorIndex = 0;
    
    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const [creditorId, creditorBalance] = creditors[creditorIndex];
      const [debtorId, debtorBalance] = debtors[debtorIndex];
      
      const settlementAmount = Math.min(creditorBalance, Math.abs(debtorBalance));
      
      if (settlementAmount > 0.01) { // Only show settlements > 1 cent
        settlements.push({
          from: debtorId,
          to: creditorId,
          amount: settlementAmount
        });
      }
      
      if (creditorBalance - settlementAmount < 0.01) {
        creditorIndex++;
      } else {
        creditors[creditorIndex] = [creditorId, creditorBalance - settlementAmount];
      }
      
      if (Math.abs(debtorBalance) - settlementAmount < 0.01) {
        debtorIndex++;
      } else {
        debtors[debtorIndex] = [debtorId, debtorBalance + settlementAmount];
      }
    }
    
    return settlements;
  }
} 