import { Ionicons } from '@expo/vector-icons';

export interface CategoryIcon {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const getCategoryIcon = (category: string): CategoryIcon => {
  const normalizedCategory = category.toLowerCase().trim();
  
  // Map categories to icons
  const categoryMap: Record<string, CategoryIcon> = {
    // Food & Dining
    'food': { name: 'restaurant', color: '#f59e0b' },
    'dining': { name: 'restaurant', color: '#f59e0b' },
    'restaurant': { name: 'restaurant', color: '#f59e0b' },
    'cafe': { name: 'cafe', color: '#f59e0b' },
    'coffee': { name: 'cafe', color: '#f59e0b' },
    'groceries': { name: 'basket', color: '#10b981' },
    'takeout': { name: 'fast-food', color: '#f59e0b' },
    
    // Transportation
    'transport': { name: 'car', color: '#3b82f6' },
    'transportation': { name: 'car', color: '#3b82f6' },
    'uber': { name: 'car', color: '#3b82f6' },
    'lyft': { name: 'car', color: '#3b82f6' },
    'taxi': { name: 'car', color: '#3b82f6' },
    'fuel': { name: 'car', color: '#3b82f6' },
    'parking': { name: 'car', color: '#3b82f6' },
    'flight': { name: 'airplane', color: '#8b5cf6' },
    'airplane': { name: 'airplane', color: '#8b5cf6' },
    'train': { name: 'train', color: '#8b5cf6' },
    'bus': { name: 'bus', color: '#8b5cf6' },
    'subway': { name: 'subway', color: '#8b5cf6' },
    
    // Accommodation
    'accommodation': { name: 'bed', color: '#6366f1' },
    'hotel': { name: 'bed', color: '#6366f1' },
    'hostel': { name: 'bed', color: '#6366f1' },
    'airbnb': { name: 'home', color: '#6366f1' },
    'lodging': { name: 'bed', color: '#6366f1' },
    
    // Entertainment
    'entertainment': { name: 'game-controller', color: '#ec4899' },
    'movies': { name: 'film', color: '#ec4899' },
    'theater': { name: 'film', color: '#ec4899' },
    'concert': { name: 'musical-notes', color: '#ec4899' },
    'museum': { name: 'library', color: '#8b5cf6' },
    'attraction': { name: 'camera', color: '#ec4899' },
    'activity': { name: 'bicycle', color: '#10b981' },
    'sports': { name: 'football', color: '#10b981' },
    
    // Shopping
    'shopping': { name: 'bag', color: '#f59e0b' },
    'clothes': { name: 'shirt', color: '#f59e0b' },
    'clothing': { name: 'shirt', color: '#f59e0b' },
    'souvenirs': { name: 'gift', color: '#f59e0b' },
    'gifts': { name: 'gift', color: '#f59e0b' },
    
    // Health & Wellness
    'health': { name: 'medical', color: '#ef4444' },
    'medical': { name: 'medical', color: '#ef4444' },
    'pharmacy': { name: 'medical', color: '#ef4444' },
    'fitness': { name: 'fitness', color: '#10b981' },
    'gym': { name: 'fitness', color: '#10b981' },
    
    // Business
    'business': { name: 'briefcase', color: '#6366f1' },
    'work': { name: 'briefcase', color: '#6366f1' },
    'office': { name: 'briefcase', color: '#6366f1' },
    
    // Communication
    'phone': { name: 'call', color: '#3b82f6' },
    'internet': { name: 'wifi', color: '#3b82f6' },
    'wifi': { name: 'wifi', color: '#3b82f6' },
    
    // Utilities
    'utilities': { name: 'flash', color: '#f59e0b' },
    'electricity': { name: 'flash', color: '#f59e0b' },
    'water': { name: 'water', color: '#3b82f6' },
    'gas': { name: 'flame', color: '#f59e0b' },
    
    // Education
    'education': { name: 'school', color: '#8b5cf6' },
    'school': { name: 'school', color: '#8b5cf6' },
    'course': { name: 'library', color: '#8b5cf6' },
    'training': { name: 'library', color: '#8b5cf6' },
    
    // Insurance
    'insurance': { name: 'shield-checkmark', color: '#10b981' },
    
    // Banking
    'banking': { name: 'card', color: '#6366f6' },
    'atm': { name: 'card', color: '#6366f6' },
    'fees': { name: 'card', color: '#6366f6' },
    
    // Other
    'other': { name: 'ellipsis-horizontal', color: '#6b7280' },
    'misc': { name: 'ellipsis-horizontal', color: '#6b7280' },
    'miscellaneous': { name: 'ellipsis-horizontal', color: '#6b7280' },
  };
  
  // Try to find exact match first
  if (categoryMap[normalizedCategory]) {
    return categoryMap[normalizedCategory];
  }
  
  // Try to find partial matches
  for (const [key, icon] of Object.entries(categoryMap)) {
    if (normalizedCategory.includes(key) || key.includes(normalizedCategory)) {
      return icon;
    }
  }
  
  // Default icon for unknown categories
  return { name: 'ellipsis-horizontal', color: '#6b7280' };
};

// Predefined categories for the expense form
export const predefinedCategories = [
  { name: 'Food & Dining', icon: 'restaurant', color: '#f59e0b' },
  { name: 'Transportation', icon: 'car', color: '#3b82f6' },
  { name: 'Accommodation', icon: 'bed', color: '#6366f1' },
  { name: 'Entertainment', icon: 'game-controller', color: '#ec4899' },
  { name: 'Shopping', icon: 'bag', color: '#f59e0b' },
  { name: 'Health & Wellness', icon: 'medical', color: '#ef4444' },
  { name: 'Business', icon: 'briefcase', color: '#6366f1' },
  { name: 'Communication', icon: 'call', color: '#3b82f6' },
  { name: 'Utilities', icon: 'flash', color: '#f59e0b' },
  { name: 'Education', icon: 'school', color: '#8b5cf6' },
  { name: 'Insurance', icon: 'shield-checkmark', color: '#10b981' },
  { name: 'Banking', icon: 'card', color: '#6366f6' },
  { name: 'Other', icon: 'ellipsis-horizontal', color: '#6b7280' },
]; 