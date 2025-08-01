# Deploy Updated Cloud Function for Google Sheets and Drive Integration

## What's New

The Cloud Function has been updated to handle both Google Sheets and Google Drive operations:
- ✅ **Google Sheets API** - For expense tracking (existing)
- ✅ **Google Drive API** - For ticket management (new)
- ✅ **Unified Function** - Single endpoint for both services

## Prerequisites

1. **Google Cloud Project** - You already have one: `sahal-467419`
2. **Google Cloud CLI** - Install and authenticate with `gcloud auth login`
3. **Service Account** - You already have: `sahal-108@sahal-467419.iam.gserviceaccount.com`
4. **Enabled APIs** - Google Sheets API and Google Drive API

## Deployment Steps

### 1. Navigate to the Cloud Function Directory
```bash
cd google-sheets-function
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Deploy the Updated Function
```bash
npm run deploy
```

Or manually:
```bash
gcloud functions deploy sheetsAndDriveProxy \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1
```

### 4. Get the Function URL
After deployment, you'll get a URL like:
```
https://us-central1-sahal-467419.cloudfunctions.net/sheetsAndDriveProxy
```

### 5. Update the App Configuration
The config file `src/config/googleDriveConfig.ts` is already updated with:
- ✅ API Key: `AIzaSyD5tLAZ4afoLGJXs8bK0nkUmbM6E3kzQuw`
- ✅ Folder ID: `1-RdeokX3wEJlzLlgjL9DRWsIZ0ZD5AVD`
- ✅ Cloud Function URL: `https://us-central1-sahal-467419.cloudfunctions.net/sheetsAndDriveProxy`
- ✅ Spreadsheet ID: `1h0UXwNj9DKy6b9H-Mkqel1qJ7lALHdJt1LZwmKqIst8`

## How It Works

### Google Sheets Operations (Existing)
1. **React Native App** → Makes HTTP requests to Cloud Function
2. **Cloud Function** → Uses service account to authenticate with Google Sheets API
3. **Google Sheets API** → Returns expense data to Cloud Function
4. **Cloud Function** → Returns data to React Native App

### Google Drive Operations (New)
1. **React Native App** → Makes HTTP requests to Cloud Function
2. **Cloud Function** → Uses API key to authenticate with Google Drive API
3. **Google Drive API** → Returns ticket data to Cloud Function
4. **Cloud Function** → Returns data to React Native App

## Supported Operations

### Google Sheets (Expenses)
- `getAllGroups` - Get all expense groups
- `addGroup` - Add new expense group
- `getAllPeople` - Get all people
- `addPerson` - Add new person
- `getAllExpenses` - Get all expenses
- `addExpense` - Add new expense
- `updateExpense` - Update existing expense
- `deleteExpense` - Delete expense

### Google Drive (Tickets)
- `getAllTickets` - Get all tickets
- `addTicket` - Add new ticket
- `updateTicket` - Update existing ticket
- `deleteTicket` - Delete ticket
- `uploadTicketFile` - Upload ticket file to Drive
- `downloadTicketFile` - Download ticket file from Drive

## Security Benefits

- ✅ Service account credentials stay on Google Cloud (not in your app)
- ✅ API key is used for Drive operations (simpler than service account)
- ✅ JWT signing happens on the server (not in React Native)
- ✅ No need for complex crypto libraries in React Native
- ✅ Proper CORS handling for web/mobile apps

## Testing

After deployment, test both integrations:

### Test Expenses
1. Open the Expenses tab
2. Check if it shows expense groups
3. Try adding a new expense group

### Test Tickets
1. Open the Bookings tab
2. Check if it shows tickets
3. Try adding a new ticket

## Troubleshooting

### Function Deployment Issues
- Make sure you're in the correct Google Cloud project: `gcloud config set project sahal-467419`
- Check if the service account has the necessary permissions

### CORS Issues
- The function includes CORS headers for cross-origin requests
- If you get CORS errors, check the function logs in Google Cloud Console

### Authentication Issues
- Verify the service account has access to your Google Sheet
- Check that the spreadsheet ID is correct
- Ensure the private key is properly formatted
- Verify the API key has access to Google Drive

### Google Drive Issues
- Make sure Google Drive API is enabled in your Google Cloud project
- Verify the folder ID is correct and accessible
- Check that the API key has the necessary Drive permissions

## Next Steps

1. **Deploy the function** using the steps above
2. **Test both integrations** in the app
3. **Check the logs** in Google Cloud Console if there are issues
4. **Implement file upload** functionality for ticket attachments 