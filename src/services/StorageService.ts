import axios from 'axios';
import { STORAGE_CONFIG, UPLOAD_CONFIG } from '../config/storageConfig';

export interface TicketData {
  type: string;
  title: string;
  url?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class StorageService {
  // Helper method to make API calls through our backend proxy
  private async makeRequest(action: string, data: any) {
    try {
      const requestBody = {
        action,
        data: {
          ...data,
          credentials: STORAGE_CONFIG.CREDENTIALS,
        },
      };

      console.log('StorageService: Making request to Cloud Function:', {
        action,
        hasCredentials: !!STORAGE_CONFIG.CREDENTIALS,
        hasData: !!data
      });

      const response = await axios.post(STORAGE_CONFIG.CLOUD_FUNCTION_URL, requestBody);

      console.log('StorageService: Cloud Function response status:', response.status);
      console.log('StorageService: Cloud Function response data:', response.data);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Request failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('StorageService: Request failed:', error instanceof Error ? error.message : 'Unknown error');
      if (axios.isAxiosError(error)) {
        console.error('StorageService: Response status:', error.response?.status);
        console.error('StorageService: Response data:', error.response?.data);
      }
      throw error;
    }
  }

  // Add a new ticket to Firebase
  static async addTicket(ticket: TicketData): Promise<TicketData> {
    try {
      const response = await new StorageService().makeRequest('addTicket', {
        type: ticket.type,
        title: ticket.title,
        url: ticket.url,
      });
      
      return {
        type: ticket.type,
        title: ticket.title,
        url: response.url || ticket.url,
      };
    } catch (error) {
      console.error('Error adding ticket:', error);
      throw error;
    }
  }

  // Get all tickets from Firebase
  static async getAllTickets(): Promise<TicketData[]> {
    try {
      const response = await new StorageService().makeRequest('getAllTickets', {});
      return response.tickets || [];
    } catch (error) {
      console.error('Error getting tickets:', error);
      return [];
    }
  }

  // Delete a ticket from Firebase
  static async deleteTicket(ticketTitle: string): Promise<void> {
    try {
      await new StorageService().makeRequest('deleteTicket', {
        title: ticketTitle,
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      throw error;
    }
  }

  // Upload a ticket file to Google Cloud Storage
  static async uploadTicketFile(fileContent: string, fileName: string, contentType: string): Promise<UploadResult> {
    try {
      console.log('StorageService: Uploading file to Google Cloud Storage:', {
        fileName,
        contentType,
        contentLength: fileContent.length
      });

      const response = await new StorageService().makeRequest('uploadTicketFile', {
        fileContent,
        fileName,
        contentType,
        bucketName: STORAGE_CONFIG.BUCKET_NAME,
      });

      console.log('StorageService: Upload result:', response);

      if (response.success && response.fileUrl) {
        return {
          success: true,
          url: response.fileUrl,
        };
      } else {
        return {
          success: false,
          error: response.error || 'Upload failed',
        };
      }
    } catch (error) {
      console.error('Error uploading ticket file:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  // Validate file before upload
  static validateFile(fileName: string, fileSize: number, contentType: string): { valid: boolean; error?: string } {
    // Check file size
    if (fileSize > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size (${(fileSize / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${UPLOAD_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`,
      };
    }

    // Check file type
    if (!UPLOAD_CONFIG.ALLOWED_FILE_TYPES.includes(contentType)) {
      return {
        valid: false,
        error: `File type '${contentType}' is not allowed. Allowed types: ${UPLOAD_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`,
      };
    }

    // Check file name
    if (!fileName || fileName.trim().length === 0) {
      return {
        valid: false,
        error: 'File name is required',
      };
    }

    return { valid: true };
  }

  // Generate a unique file name
  static generateFileName(originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop() || '';
    const baseName = originalName.replace(`.${extension}`, '').replace(/[^a-zA-Z0-9]/g, '_');
    return `${UPLOAD_CONFIG.FILE_NAME_PREFIX}${baseName}_${timestamp}.${extension}`;
  }

  // Test connection to storage
  static async testConnection(): Promise<boolean> {
    try {
      await new StorageService().makeRequest('getAllTickets', {});
      return true;
    } catch (error) {
      console.error('Storage connection test failed:', error);
      return false;
    }
  }

  // Get storage configuration info
  static getStorageInfo() {
    return {
      bucketName: STORAGE_CONFIG.BUCKET_NAME,
      cloudFunctionUrl: STORAGE_CONFIG.CLOUD_FUNCTION_URL,
      maxFileSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
      allowedFileTypes: UPLOAD_CONFIG.ALLOWED_FILE_TYPES,
    };
  }
}

export default StorageService; 