# 🔥 Firestore Permissions Setup Guide

## ❌ Current Issue
You're getting a "Missing or insufficient permissions" error when trying to fetch trip data from Firestore.

## ✅ Solution Steps

### 1. **Enable Anonymous Authentication**
Go to Firebase Console → Authentication → Sign-in method → Anonymous → Enable

### 2. **Update Firestore Security Rules**
In Firebase Console → Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to trip data for all users
    match /trips/{tripId} {
      allow read: if true;
      allow write: if false; // Only allow reads, not writes from client
      
      // Allow read access to trip subcollections
      match /{document=**} {
        allow read: if true;
        allow write: if false;
      }
    }
    
    // Allow read/write access to tickets collection
    match /tickets/{ticketId} {
      allow read, write: if true;
    }
    
    // Allow read/write access to expense groups
    match /expenseGroups/{groupId} {
      allow read, write: if true;
      
      // Allow access to subcollections
      match /{document=**} {
        allow read, write: if true;
      }
    }
    
    // Allow read/write access to people collection
    match /people/{personId} {
      allow read, write: if true;
    }
    
    // Allow read/write access to expenses collection
    match /expenses/{expenseId} {
      allow read, write: if true;
    }
  }
}
```

### 3. **Alternative: Use Firebase CLI**
If you prefer command line:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 4. **Test the Setup**
After updating rules, the app should be able to:
- ✅ Read trip data from Firestore
- ✅ Display weather information
- ✅ Show loading states properly
- ✅ Fall back to static data if needed

## 🔧 Manual Rules Deployment
If you can't use Firebase CLI, manually copy the rules above into Firebase Console → Firestore Database → Rules and click "Publish".

## 🎯 Expected Result
After following these steps, the app will successfully fetch trip data from Firestore without permission errors.

## 📱 App Behavior
- **With Firestore**: Dynamic trip data with real-time updates
- **Without Firestore**: Falls back to static data from `tripData.ts`
- **Loading State**: Shows "Loading trip data..." while fetching
- **Error State**: Shows error message if both Firestore and fallback fail 