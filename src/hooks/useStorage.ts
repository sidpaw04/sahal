import { useState, useCallback } from 'react';
import StorageService, { TicketData, UploadResult } from '../services/StorageService';
import { isStorageConfigured } from '../config/storageConfig';

interface UseStorageReturn {
  // Tickets
  tickets: TicketData[];
  loadingTickets: boolean;
  errorTickets: string | null;
  refreshTickets: () => Promise<void>;
  addTicket: (ticket: TicketData) => Promise<TicketData>;
  deleteTicket: (ticketTitle: string) => Promise<void>;
  
  // File upload
  uploadTicketFile: (fileContent: string, fileName: string, contentType: string) => Promise<UploadResult>;
  validateFile: (fileName: string, fileSize: number, contentType: string) => { valid: boolean; error?: string };
  generateFileName: (originalName: string) => string;
  
  // Connection status
  isConfigured: boolean;
  testConnection: () => Promise<boolean>;
  getStorageInfo: () => {
    bucketName: string;
    cloudFunctionUrl: string;
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}

export const useStorage = (): UseStorageReturn => {
  // Tickets state
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [errorTickets, setErrorTickets] = useState<string | null>(null);

  // Check if configured
  const isConfigured = isStorageConfigured();

  // Test connection
  const testConnection = useCallback(async (): Promise<boolean> => {
    if (!isConfigured) {
      return false;
    }
    
    try {
      return await StorageService.testConnection();
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }, [isConfigured]);

  // Tickets functions
  const refreshTickets = useCallback(async () => {
    if (!isConfigured) {
      setErrorTickets('Storage not configured');
      return;
    }

    setLoadingTickets(true);
    setErrorTickets(null);
    
    try {
      const ticketsData = await StorageService.getAllTickets();
      setTickets(ticketsData);
    } catch (error) {
      setErrorTickets(error instanceof Error ? error.message : 'Failed to load tickets');
    } finally {
      setLoadingTickets(false);
    }
  }, [isConfigured]);

  const addTicket = useCallback(async (ticket: TicketData): Promise<TicketData> => {
    if (!isConfigured) {
      throw new Error('Storage not configured');
    }

    try {
      const newTicket = await StorageService.addTicket(ticket);
      await refreshTickets(); // Refresh the list
      return newTicket;
    } catch (error) {
      throw error;
    }
  }, [refreshTickets, isConfigured]);

  const deleteTicket = useCallback(async (ticketTitle: string): Promise<void> => {
    if (!isConfigured) {
      throw new Error('Storage not configured');
    }

    try {
      await StorageService.deleteTicket(ticketTitle);
      await refreshTickets(); // Refresh the list
    } catch (error) {
      throw error;
    }
  }, [refreshTickets, isConfigured]);

  // File upload functions
  const uploadTicketFile = useCallback(async (
    fileContent: string, 
    fileName: string, 
    contentType: string
  ): Promise<UploadResult> => {
    if (!isConfigured) {
      return {
        success: false,
        error: 'Storage not configured',
      };
    }

    try {
      return await StorageService.uploadTicketFile(fileContent, fileName, contentType);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }, [isConfigured]);

  const validateFile = useCallback((
    fileName: string, 
    fileSize: number, 
    contentType: string
  ): { valid: boolean; error?: string } => {
    return StorageService.validateFile(fileName, fileSize, contentType);
  }, []);

  const generateFileName = useCallback((originalName: string): string => {
    return StorageService.generateFileName(originalName);
  }, []);

  // Get storage configuration info
  const getStorageInfo = useCallback(() => {
    return StorageService.getStorageInfo();
  }, []);

  return {
    // Tickets
    tickets,
    loadingTickets,
    errorTickets,
    refreshTickets,
    addTicket,
    deleteTicket,
    
    // File upload
    uploadTicketFile,
    validateFile,
    generateFileName,
    
    // Connection status
    isConfigured,
    testConnection,
    getStorageInfo,
  };
}; 