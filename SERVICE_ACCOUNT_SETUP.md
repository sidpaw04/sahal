# Google Sheets Service Account Setup Guide

This guide will help you set up Google Sheets integration using a service account for full read/write access.

## Prerequisites

- Google account
- Basic knowledge of Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" at the top
3. Click "New Project"
4. Enter a project name (e.g., "Expense Tracker App")
5. Click "Create"

## Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on "Google Sheets API"
4. Click "Enable"

## Step 3: Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - **Name**: "expense-tracker-service"
   - **Description**: "Service account for expense tracker app"
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Choose "JSON" format
5. Click "Create"
6. The JSON file will download automatically

## Step 5: Create Google Sheets Document

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Expense Tracker Data"
4. Copy the spreadsheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

## Step 6: Share the Spreadsheet

1. In your Google Sheets document, click "Share"
2. Add your service account email (found in the JSON file) with "Editor" permissions
3. The email format is: `service-account-name@project-id.iam.gserviceaccount.com`

## Step 7: Update Configuration

1. Open the downloaded JSON file
2. Copy the `client_email` and `private_key` values
3. Open `src/config/googleSheetsConfig.ts`
4. Replace the placeholder values:

```typescript
export const googleSheetsConfig: GoogleSheetsConfig = {
  spreadsheetId: 'YOUR_ACTUAL_SPREADSHEET_ID_HERE',
  credentials: {
    client_email: 'your-service-account@project.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nYour actual private key here\n-----END PRIVATE KEY-----\n',
  },
};
```

## Step 8: Test the Integration

1. Run your app: `npm start`
2. Go to the Expenses tab
3. Try creating a new expense group
4. Check your Google Sheets document to see if the data appears

## Troubleshooting

### Common Issues:

1. **"Service account not configured" error**
   - Make sure you've updated the configuration file with your actual credentials
   - Check that the spreadsheet ID is correct

2. **"Permission denied" error**
   - Ensure the service account email has "Editor" permissions on the spreadsheet
   - Check that the Google Sheets API is enabled

3. **"Invalid credentials" error**
   - Verify the private key is copied correctly (including newlines)
   - Make sure the client_email matches your service account

4. **"Spreadsheet not found" error**
   - Check that the spreadsheet ID is correct
   - Ensure the spreadsheet is shared with the service account

### Security Notes:

- Keep your service account JSON file secure
- Never commit credentials to version control
- Consider using environment variables for production

## Environment Variables (Recommended for Production)

Instead of hardcoding credentials, use environment variables:

```typescript
export const googleSheetsConfig: GoogleSheetsConfig = {
  spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '',
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL || '',
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY || '',
  },
};
```

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all setup steps were completed correctly
3. Test the Google Sheets API directly in the Google Cloud Console
4. Ensure your Google Cloud project has billing enabled (required for API usage)

## Next Steps

Once the basic setup is working:
1. Add more features like expense categories
2. Implement real-time collaboration
3. Add data validation and error handling
4. Consider implementing offline support with sync 