# 📤 Manual Trip Data Upload Guide

Since the service account doesn't have write permissions, here's how to upload the trip data manually through Firebase Console.

## 🎯 Step-by-Step Manual Upload

### 1. **Access Firebase Console**
- Go to: https://console.firebase.google.com/
- Select your project: `azun-466715`
- Navigate to **Firestore Database**

### 2. **Create Trip Document**
- Click **Start collection** (if no collections exist)
- Collection ID: `trips`
- Document ID: `viva-la-france`
- Add these fields:
  ```
  id: viva-la-france
  name: Viva la France
  startDate: 2024-08-27
  endDate: 2024-09-01
  ```

### 3. **Upload Weather Data**
- In the `viva-la-france` document, click **Start collection**
- Collection ID: `weather`
- Document ID: `forecast`
- Add this JSON as a map:
  ```json
  {
    "paris": {
      "2024-08-27": {
        "high": 24,
        "low": 16,
        "condition": "sunny",
        "icon": "☀️",
        "description": "Perfect weather for outdoor activities",
        "link": "https://www.accuweather.com/en/fr/paris/623/weather-forecast/623?day=28"
      },
      "2024-08-28": {
        "high": 26,
        "low": 18,
        "condition": "partly-cloudy",
        "icon": "⛅",
        "description": "Great for Eiffel Tower visit and river cruise",
        "link": "https://www.accuweather.com/en/fr/paris/623/weather-forecast/623?day=29"
      }
    },
    "nice": {
      "2024-08-29": {
        "high": 28,
        "low": 20,
        "condition": "sunny",
        "icon": "☀️",
        "description": "Perfect beach weather for Nice exploration",
        "link": "https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=30"
      },
      "2024-08-30": {
        "high": 29,
        "low": 21,
        "condition": "sunny",
        "icon": "☀️",
        "description": "Ideal for island day trip and beach activities",
        "link": "https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=31"
      },
      "2024-08-31": {
        "high": 27,
        "low": 19,
        "condition": "partly-cloudy",
        "icon": "⛅",
        "description": "Good weather for train journey and Villefranche visit",
        "link": "https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=32"
      },
      "2024-09-01": {
        "high": 25,
        "low": 17,
        "condition": "sunny",
        "icon": "☀️",
        "description": "Perfect final day weather for Monaco and train back",
        "link": "https://www.accuweather.com/en/fr/vernier/2608391/daily-weather-forecast/2608391?day=33"
      }
    }
  }
  ```

### 4. **Upload Days Collection**
For each day, create a subcollection:

#### **Day 1 (2024-08-27)**
- In `viva-la-france`, click **Start collection**
- Collection ID: `days`
- Document ID: `day-1`
- Add fields:
  ```
  date: 2024-08-27
  summary: Paris Arrival & Iconic Landmarks
  ```

Then create activities subcollection:
- In `day-1`, click **Start collection**
- Collection ID: `activities`
- Document ID: `1`
- Add fields:
  ```
  time: 08:00
  title: Flight to Paris
  icon: airplane
  description: International flight to Charles de Gaulle Airport
  location: CDG Airport, Paris
  duration: 2 hours
  notes: Check-in 2 hours before departure
  ```

Continue for all activities (IDs 1-34).

### 5. **Quick Import Method**
Alternatively, you can use the **Import JSON** feature:

1. Go to **Firestore Database** → **Data** tab
2. Click the **Import** button (if available)
3. Use this JSON structure:
   ```json
   {
     "trips": {
       "viva-la-france": {
         "id": "viva-la-france",
         "name": "Viva la France",
         "startDate": "2024-08-27",
         "endDate": "2024-09-01",
         "weather": {
           "forecast": {
             "paris": { /* weather data */ },
             "nice": { /* weather data */ }
           }
         },
         "days": {
           "day-1": {
             "date": "2024-08-27",
             "summary": "Paris Arrival & Iconic Landmarks",
             "activities": {
               "1": { /* activity data */ },
               "2": { /* activity data */ }
               // ... continue for all activities
             }
           }
           // ... continue for all days
         }
       }
     }
   }
   ```

## 🎯 Expected Result
After uploading, the app should:
- ✅ Load trip data from Firestore
- ✅ Display weather information
- ✅ Show all 6 days with activities
- ✅ No more permission errors

## 📱 Testing
Once uploaded, restart the app and check:
- Trip timeline loads without errors
- Weather widgets appear on day cards
- All activities are displayed correctly
- Loading states work properly 