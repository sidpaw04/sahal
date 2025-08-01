export interface Activity {
  id: string;
  time?: string; // Made optional
  title: string;
  icon: string;
  description?: string;
  location?: string;
  duration?: string;
  ticketLink?: string;
  websiteLink?: string;
  notes?: string;
  price?: string;
}

export interface Day {
  id: string;
  date: string;
  summary?: string;
  activities: Activity[];
}

export interface WeatherData {
  high: number;
  low: number;
  condition: string;
  icon: string;
  description: string;
  link: string;
}

export interface WeatherForecast {
  [date: string]: WeatherData;
}

export interface TripWeather {
  paris: WeatherForecast;
  nice: WeatherForecast;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  weather?: TripWeather;
  days: Day[];
}

// New types for expense tracking
export interface Person {
  id: string;
  name: string;
  color: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  paidBy: string; // Person ID
  splitBetween: string[]; // Array of Person IDs
  date: string;
  category: string;
  notes?: string;
  location?: string;
}

export interface ExpenseGroup {
  id: string;
  name: string;
  people: Person[];
  expenses: Expense[];
  currency: string;
}

export interface ExpenseSummary {
  personId: string;
  personName: string;
  totalPaid: number;
  totalOwed: number;
  balance: number; // positive = they're owed money, negative = they owe money
}

export type RootStackParamList = {
  TripTimeline: undefined;
  AddDay: undefined;
  AddActivity: { dayId: string };
  ExpenseGroups: undefined;
  AddExpense: { groupId: string };
  AddPerson: { groupId: string };
  ExpenseGroup: { groupId: string; people?: any[] };
  BookingsList: undefined;
  TicketDetails: { ticketId: string };
  // New UX screens
  ExpensesMain: undefined;
  BookingsMain: undefined;
}; 