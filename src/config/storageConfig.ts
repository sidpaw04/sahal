// Google Cloud Storage Configuration
export const STORAGE_CONFIG = {
  // Cloud Function URL for Sahal Backend operations
  // This should point to your deployed cloud function
  CLOUD_FUNCTION_URL: 'https://us-central1-azun-466715.cloudfunctions.net/sahalBackend',
  
  // Google Cloud Storage bucket name where files will be stored
  BUCKET_NAME: 'sahal-tickets',
  
  // Service account credentials for authentication
  CREDENTIALS: {
    client_email: 'sahal-358@azun-466715.iam.gserviceaccount.com',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDNZU496Y+Ta6Im\nXIQdl42jioYO5Qmk6emIMI/KNQwfMu/El+W/M6RXDL1Jsean51T1fh67nnhq4ef6\ndGOqQc8Cw/gWYYbhWAGdBx1WY9U11jewzxe5iBJ1MtWXMnIHhXn6/OPvYIE8KVHQ\nrsE4PhKB2BCZKtZiPW8FLMk092qSP+6qi2+fUktcvkvfM0aS81m8n1rPQnWvJ+lt\nLg51Kv0FS1QAutRAGYYPAtLTp/KuepYGU18u+5XpxEebrZSgGiHtuYcbvO/A7jVn\nc9rqtj/3myELtzMp2S2+6IysYhMhNp+Z6uzgmbNEaM50n2Cy218RHfPbWtrCovP7\nwE0YvVdDAgMBAAECgf9xhw04K2Cwm02E5p4fvSUMwARZNz+dZ60tGapgmfGZTQ46\nG7thc6nic6gsk6hqJfNPveY+zdjBOxx90tdDxBwn6ym1NTLYW0yI/uW4WnX+y+j8\nUXtLkWqiXPayG6/reFtz31Qde7nzBuOx9OXXsHeKTWLfRk44/rveoGKWZCsDqlRh\nnr8yQ1bfMUT0dGCnGlz046oIfQZvEwiQSSdSqdFh5WWiYJuD8ib88HN78sXqGIL+\nZ4pFEyXowq2K/WqZdWq+qr8PnE9ysIVDc2KeXc8Yx80bO87EvI6mbGWDzXvj7a+X\njVJTo7cbI5dQRlqQo0B2fiQjgQ6XghCwGZAKrN0CgYEA+T55fNLkV7LznP/ynd8y\nQbFpHgivQ8xJ72jY0nY1e4CwDkNPNZh2DWk+nGYEiVRnK3j0SRSydyzR4+CMCY5f\nNEUjJPKYCBl/kQhOxyRerXx6uLnxhi4aI2IP+jKJYW8K/K5MAMXYDzQgYS+bX6SA\n1h4D8T4jlsQhGZclAut+DY8CgYEA0vaQXBBBj+n12R8S0+2u+S4IyghVk7kTaCCz\n0t3R+NdxJ9VZFyjmG5gIKs6cnSl3Dh8pp21M4xBVvLyi+USdDAvw295SXgy/NTEQ\nAKchbXWJhmAuw5gpMXcdPKa3OfC+8nzUcxu7O5dUvA4T++sXBZoCTXUmoP5jt6n2\nM05JaQ0CgYEAlhvIMyMYHrFKAu4rAmWf8OyWMF5un9hzVtrAatCCmWUBozVqiQ7P\nWnheGvdeGA9bK1VnWnQ6n4fAyQs9i6vRLrvM1L2+TnJ8364vM8R1uOpVRtfF3Ff7\nqf+vO7IgByxHY7LdV0HQRCfSsHVpkAqVBV+CZFJWQMDSZoUe50lI24UCgYEAxtPZ\ndNthX0jLC8psjU77VSAc6oT2WtbYwo/ny3qCtfwfSsKaR+ilDya3s9is5La63ZVj\nRcgO6gZwOAS1uScAuOTcKe0cRkXPREusYGEkcSyQ5BPsny3ezR8NcCdUkwgifxpF\nhQOC8IQNOXwvO4PzW7UuLGCYeq2nv+cxAmPrblUCgYAU9pjkWaVFaMFWKWK791ou\nOgz0z5rAEBFHuu+/d9uYJPeLAXs+REw2069CU1FMy+wEwPXe8+MW0UGyph81fYhF\nzs+GFFWW0p6JkZh8BrogmGMBZ375kk+sIpPFPvPKmxMn7mDyLbGN/4ggGjsVHd5n\nBR5amQFIzVH26aMb7H1UYw==\n-----END PRIVATE KEY-----\n',
  },
};

// Helper function to check if Google Cloud Storage is configured
export const isStorageConfigured = () => {
  return STORAGE_CONFIG.CLOUD_FUNCTION_URL !== 'YOUR_CLOUD_FUNCTION_URL' && 
         STORAGE_CONFIG.CREDENTIALS.client_email !== 'YOUR_SERVICE_ACCOUNT_EMAIL@project.iam.gserviceaccount.com' &&
         STORAGE_CONFIG.CREDENTIALS.private_key !== '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n';
};

// File upload configuration
export const UPLOAD_CONFIG = {
  // Maximum file size in bytes (10MB)
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  
  // Allowed file types
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  
  // File naming convention
  FILE_NAME_PREFIX: 'sahal-ticket-',
  
  // Storage URL pattern
  STORAGE_URL_PATTERN: 'https://storage.googleapis.com/{bucket}/{filename}',
};

// 📋 NEXT STEPS:
// 1. The Google Cloud Storage backend is already configured and deployed
// 2. The cloud function URL points to our sahalBackend
// 3. All files are stored in the 'sahal-tickets' bucket
// 4. Files are automatically made public and accessible via URL

// 🏗️ STORAGE STRUCTURE:
// Google Cloud Storage Bucket: "sahal-tickets"
// Files: { filename, contentType, size, uploadedAt, url }

// ✅ TESTING:
// Once configured, run the app and try uploading a ticket file.
// Files will be stored in Google Cloud Storage and accessible via public URLs! 