# 📊 Expense Tracking Guide

## 🚀 Getting Started

Your expense tracking app is now fully functional with Google Sheets integration! Here's how to use it:

## 📱 App Features

### 1. **Create Expense Groups**
- Tap the "New Expense Group" button on the main screen
- Enter a group name (e.g., "Trip to Paris", "Weekend Trip")
- Groups are automatically created in your Google Spreadsheet

### 2. **Add People to Groups**
- Open any expense group
- Tap "Add Person" button
- Enter the person's name
- Choose a color for easy identification
- People are stored in separate sheets for each group

### 3. **Add Expenses**
- In an expense group, tap "Add Expense"
- Fill in the expense details:
  - **Title**: What the expense was for
  - **Amount**: How much it cost
  - **Category**: Food, Transportation, etc.
  - **Paid By**: Who paid for it
  - **Split Between**: Who should share the cost
  - **Location**: Where it happened (optional)
  - **Notes**: Additional details (optional)

### 4. **View Balances**
- The app automatically calculates who owes what
- Shows total paid, total owed, and final balance for each person
- Positive balance = they're owed money
- Negative balance = they owe money

### 5. **Manage Expenses**
- View all expenses in chronological order
- Delete expenses by tapping the × button
- See detailed information including split details

## 🔗 Google Sheets Integration

### **Automatic Sheet Creation**
The app automatically creates these sheets in your Google Spreadsheet:

1. **Groups** - Main list of all expense groups
2. **People_[GroupID]** - People in each specific group
3. **Expenses_[GroupID]** - Expenses for each specific group

### **Real-time Sync**
- All changes are immediately saved to Google Sheets
- Multiple people can access the same spreadsheet
- Perfect for group trips and shared expenses

## 📊 Understanding the Data

### **Groups Sheet Structure**
```
ID | Name | Currency | Created Date | Updated Date
```

### **People Sheet Structure**
```
ID | Name | Color | Avatar
```

### **Expenses Sheet Structure**
```
ID | Title | Amount | Currency | Paid By | Split Between | Date | Category | Notes | Location
```

## 🎯 Use Cases

### **Group Trips**
- Create a group for your trip
- Add all travelers as people
- Add expenses as they happen
- See who owes what at the end

### **Roommates**
- Create a group for shared household expenses
- Add all roommates
- Track rent, utilities, groceries, etc.

### **Events**
- Create a group for an event
- Add attendees
- Track event costs and split them

## 🔧 Troubleshooting

### **If the app shows "No Expense Groups"**
- Check your Google Sheets configuration
- Ensure the spreadsheet ID is correct
- Verify the service account has access

### **If expenses aren't saving**
- Check your internet connection
- Verify the Cloud Function is running
- Check the Google Sheets permissions

### **If people can't be added**
- Make sure you're in an expense group
- Check that Google Sheets integration is working
- Try refreshing the app

## 🚀 Next Steps

The app is now ready for use! You can:

1. **Start creating expense groups**
2. **Add people to your groups**
3. **Begin tracking expenses**
4. **Share the Google Spreadsheet with others**

The expense tracking functionality is complete and fully integrated with Google Sheets for seamless collaboration! 🎉 