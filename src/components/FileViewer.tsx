import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { WebView } from 'react-native-webview';

interface FileViewerProps {
  visible: boolean;
  onClose: () => void;
  fileUrl: string;
  fileName: string;
}

export default function FileViewer({ visible, onClose, fileUrl, fileName }: FileViewerProps) {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'info' | 'viewer'>('info');
  const [webViewLoading, setWebViewLoading] = useState(false);

  const handleOpenFile = async () => {
    if (!fileUrl) {
      Alert.alert('Error', 'No file URL available');
      return;
    }

    setLoading(true);
    try {
      // Try to open the file in the browser
      const result = await WebBrowser.openBrowserAsync(fileUrl);
      
      if (result.type === 'cancel') {
        console.log('User cancelled file viewing');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'Could not open file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileUrl) {
      Alert.alert('Error', 'No file URL available');
      return;
    }

    try {
      // Open the URL in the default browser for download
      await Linking.openURL(fileUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'Could not download file. Please try again.');
    }
  };

  const handleViewInApp = () => {
    if (!fileUrl) {
      Alert.alert('Error', 'No file URL available');
      return;
    }
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    // For certain file types, we might want to use different viewing strategies
    if (extension === 'pdf') {
      // PDFs work well with WebView
      setViewMode('viewer');
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      // Images can be viewed directly
      setViewMode('viewer');
    } else {
      // For other file types, try WebView but fallback to browser
      setViewMode('viewer');
    }
  };

  const handleBackToInfo = () => {
    setViewMode('info');
  };

  const handleClose = () => {
    setViewMode('info'); // Reset to info mode when closing
    onClose();
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'document-text';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'doc':
      case 'docx':
        return 'document';
      case 'txt':
        return 'document-text';
      default:
        return 'document';
    }
  };

  const getFileColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return '#ef4444';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '#10b981';
      case 'doc':
      case 'docx':
        return '#3b82f6';
      case 'txt':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          {viewMode === 'viewer' ? (
            <TouchableOpacity onPress={handleBackToInfo} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {viewMode === 'viewer' ? 'File Viewer' : 'File Options'}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {viewMode === 'info' ? (
          <View style={styles.content}>
            <View style={styles.fileInfo}>
              <View style={styles.fileIconContainer}>
                <Ionicons 
                  name={getFileIcon(fileName)} 
                  size={48} 
                  color={getFileColor(fileName)} 
                />
              </View>
              <Text style={styles.fileName}>{fileName}</Text>
              <Text style={styles.fileUrl}>{fileUrl}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.viewInAppButton]}
                onPress={handleViewInApp}
              >
                <Ionicons name="phone-portrait" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>View in App</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleOpenFile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="eye" size={20} color="#fff" />
                )}
                <Text style={styles.actionButtonText}>
                  {loading ? 'Opening...' : 'View in Browser'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.downloadButton]}
                onPress={handleDownload}
              >
                <Ionicons name="download" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Download</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>File Information</Text>
              <Text style={styles.infoText}>
                This file is stored in Google Cloud Storage. You can view it directly in the app, 
                open it in your browser, or download it to your device.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.viewerContainer}>
            {webViewLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading file...</Text>
              </View>
            )}
            <WebView
              source={{ uri: fileUrl }}
              style={styles.webView}
              onLoadStart={() => setWebViewLoading(true)}
              onLoadEnd={() => setWebViewLoading(false)}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                
                const extension = fileName.split('.').pop()?.toLowerCase();
                let errorMessage = 'Could not load file in app. Try viewing in browser instead.';
                
                if (extension === 'pdf') {
                  errorMessage = 'PDF viewer not available in app. Opening in browser...';
                } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension || '')) {
                  errorMessage = 'Office documents cannot be viewed in app. Opening in browser...';
                }
                
                Alert.alert('Viewing Error', errorMessage, [
                  { text: 'OK', onPress: () => setViewMode('info') },
                  { text: 'Open in Browser', onPress: () => {
                    setViewMode('info');
                    setTimeout(() => handleOpenFile(), 100);
                  }}
                ]);
              }}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  fileInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  fileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  fileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  fileUrl: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  actions: {
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  downloadButton: {
    backgroundColor: '#10b981',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  info: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  backButton: {
    padding: 8,
  },
  viewInAppButton: {
    backgroundColor: '#8b5cf6',
  },
  viewerContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '500',
  },
}); 