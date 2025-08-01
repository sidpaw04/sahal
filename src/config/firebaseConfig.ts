import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export interface FirebaseConfig {
  cloudFunctionUrl: string;
  credentials: {
    client_email: string;
    private_key: string;
  };
}

// 🔧 CONFIGURATION REQUIRED
// Replace these values with your actual Firebase configuration

const firebaseConfig: FirebaseConfig = {
  cloudFunctionUrl: 'https://us-central1-azun-466715.cloudfunctions.net/sahalBackend',
  credentials: {
    client_email: 'sahal-358@azun-466715.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDNZU496Y+Ta6Im\nXIQdl42jioYO5Qmk6emIMI/KNQwfMu/El+W/M6RXDL1Jsean51T1fh67nnhq4ef6\ndGOqQc8Cw/gWYYbhWAGdBx1WY9U11jewzxe5iBJ1MtWXMnIHhXn6/OPvYIE8KVHQ\nrsE4PhKB2BCZKtZiPW8FLMk092qSP+6qi2+fUktcvkvfM0aS81m8n1rPQnWvJ+lt\nLg51Kv0FS1QAutRAGYYPAtLTp/KuepYGU18u+5XpxEebrZSgGiHtuYcbvO/A7jVn\nc9rqtj/3myELtzMp2S2+6IysYhMhNp+Z6uzgmbNEaM50n2Cy218RHfPbWtrCovP7\nwE0YvVdDAgMBAAECgf9xhw04K2Cwm02E5p4fvSUMwARZNz+dZ60tGapgmfGZTQ46\nG7thc6nic6gsk6hqJfNPveY+zdjBOxx90tdDxBwn6ym1NTLYW0yI/uW4WnX+y+j8\nUXtLkWqiXPayG6/reFtz31Qde7nzBuOx9OXXsHeKTWLfRk44/rveoGKWZCsDqlRh\nnr8yQ1bfMUT0dGCnGlz046oIfQZvEwiQSSdSqdFh5WWiYJuD8ib88HN78sXqGIL+\nZ4pFEyXowq2K/WqZdWq+qr8PnE9ysIVDc2KeXc8Yx80bO87EvI6mbGWDzXvj7a+X\njVJTo7cbI5dQRlqQo0B2fiQjgQ6XghCwGZAKrN0CgYEA+T55fNLkV7LznP/ynd8y\nQbFpHgivQ8xJ72jY0nY1e4CwDkNPNZh2DWk+nGYEiVRnK3j0SRSydyzR4+CMCY5f\nNEUjJPKYCBl/kQhOxyRerXx6uLnxhi4aI2IP+jKJYW8K/K5MAMXYDzQgYS+bX6SA\n1h4D8T4jlsQhGZclAut+DY8CgYEA0vaQXBBBj+n12R8S0+2u+S4IyghVk7kTaCCz\n0t3R+NdxJ9VZFyjmG5gIKs6cnSl3Dh8pp21M4xBVvLyi+USdDAvw295SXgy/NTEQ\nAKchbXWJhmAuw5gpMXcdPKa3OfC+8nzUcxu7O5dUvA4T++sXBZoCTXUmoP5jt6n2\nM05JaQ0CgYEAlhvIMyMYHrFKAu4rAmWf8OyWMF5un9hzVtrAatCCmWUBozVqiQ7P\nWnheGvdeGA9bK1VnWnQ6n4fAyQs9i6vRLrvM1L2+TnJ8364vM8R1uOpVRtfF3Ff7\nqf+vO7IgByxHY7LdV0HQRCfSsHVpkAqVBV+CZFJWQMDSZoUe50lI24UCgYEAxtPZ\ndNthX0jLC8psjU77VSAc6oT2WtbYwo/ny3qCtfwfSsKaR+ilDya3s9is5La63ZVj\nRcgO6gZwOAS1uScAuOTcKe0cRkXPREusYGEkcSyQ5BPsny3ezR8NcCdUkwgifxpF\nhQOC8IQNOXwvO4PzW7UuLGCYeq2nv+cxAmPrblUCgYAU9pjkWaVFaMFWKWK791ou\nOgz0z5rAEBFHuu+/d9uYJPeLAXs+REw2069CU1FMy+wEwPXe8+MW0UGyph81fYhF\nzs+GFFWW0p6JkZh8BrogmGMBZ375kk+sIpPFPvPKmxMn7mDyLbGN/4ggGjsVHd5n\nBR5amQFIzVH26aMb7H1UYw==\n-----END PRIVATE KEY-----\n',
  },
};

// Firebase configuration for the app
const appConfig = {
  apiKey: "AIzaSyBxXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
  authDomain: "azun-466715.firebaseapp.com",
  projectId: "azun-466715",
  storageBucket: "azun-466715.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

// Initialize Firebase
const app = initializeApp(appConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default firebaseConfig;

// 📋 NEXT STEPS:
// 1. The Firebase backend is already configured and deployed
// 2. The cloud function URL points to our sahalBackend
// 3. All expense and ticket data is stored in Firebase Firestore
// 4. File uploads go to Google Cloud Storage

// 🏗️ DATABASE STRUCTURE:
// Firebase Firestore Collections:

// Collection: "tickets"
// Documents: { id, type, title, url, createdAt }

// Collection: "expenseGroups"
// Documents: { id, name, currency, createdDate, updatedDate }
//   Subcollection: "people" - { id, name, color, avatar }
//   Subcollection: "expenses" - { id, title, amount, currency, paidBy, splitBetween, splitRatio, date, category, notes, location }

// Collection: "people" (global)
// Documents: { id, name, color, avatar }

// Collection: "expenses" (global)
// Documents: { id, title, amount, currency, paidBy, splitBetween, splitRatio, date, category, notes, location }

// ✅ TESTING:
// Once configured, run the app and try creating an expense group or adding tickets.
// All data will be stored in Firebase Firestore and files in Google Cloud Storage!

export const firebaseStructure = {
  // Collections
  collections: {
    tickets: 'tickets',
    expenseGroups: 'expenseGroups',
    people: 'people',
    expenses: 'expenses',
  },
  
  // Subcollections
  subcollections: {
    people: 'people',
    expenses: 'expenses',
  },
};

// Sample data structure for reference:
export const sampleData = {
  tickets: [
    {
      id: '1',
      type: 'flight',
      title: 'Paris Flight',
      url: 'https://storage.googleapis.com/sahal-tickets/flight-ticket.pdf',
      createdAt: new Date().toISOString(),
    },
  ],
  expenseGroups: [
    {
      id: '1',
      name: 'France Trip',
      currency: 'EUR',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    },
  ],
  people: [
    {
      id: '1',
      name: 'Alice',
      color: '#6366f1',
      avatar: '',
    },
    {
      id: '2',
      name: 'Bob',
      color: '#10b981',
      avatar: '',
    },
  ],
  expenses: [
    {
      id: '1',
      title: 'Hotel Booking',
      amount: 450,
      currency: 'EUR',
      paidBy: 'Alice',
      splitBetween: ['Alice', 'Bob', 'Charlie'],
      splitRatio: '1:1:1',
      date: '2024-08-27',
      category: 'Accommodation',
      notes: 'Hotel in Paris',
      location: 'Paris, France',
    },
  ],
}; 