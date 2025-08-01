# Deploy Google Cloud Function for Google Sheets Integration

## Prerequisites

1. **Google Cloud Project** - You already have one: `sahal-467419`
2. **Google Cloud CLI** - Install and authenticate with `gcloud auth login`
3. **Service Account** - You already have: `sahal-108@sahal-467419.iam.gserviceaccount.com`

## Deployment Steps

### 1. Navigate to the Cloud Function Directory
```bash
cd google-sheets-function
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Deploy the Function
```bash
npm run deploy
```

Or manually:
```bash
gcloud functions deploy sheetsProxy \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region us-central1
```

### 4. Get the Function URL
After deployment, you'll get a URL like:
```
https://us-central1-sahal-467419.cloudfunctions.net/sheetsProxy
```

### 5. Update the App Configuration
Update `src/config/googleSheetsConfig.ts`:
```typescript
const googleSheetsConfig: GoogleSheetsConfig = {
  spreadsheetId: '1tHDxG3AcBxD09hsxYd6mmV1D_991I9e1o6cS3ZdfsXU',
  credentials: {
    client_email: 'sahal-108@sahal-467419.iam.gserviceaccount.com',
    private_key: 'your-private-key',
  },
  cloudFunctionUrl: 'https://us-central1-sahal-467419.cloudfunctions.net/sheetsProxy',
};
```

## How It Works

1. **React Native App** → Makes HTTP requests to Cloud Function
2. **Cloud Function** → Uses service account to authenticate with Google Sheets API
3. **Google Sheets API** → Returns data to Cloud Function
4. **Cloud Function** → Returns data to React Native App

## Security Benefits

- ✅ Service account credentials stay on Google Cloud (not in your app)
- ✅ JWT signing happens on the server (not in React Native)
- ✅ No need for complex crypto libraries in React Native
- ✅ Proper CORS handling for web/mobile apps

## Testing

After deployment, test the connection in your app:
1. Open the Expenses tab
2. Check if it shows "Setup Instructions" or actual data
3. Try adding a new expense group

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