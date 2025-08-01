import { Ionicons } from '@expo/vector-icons';

export interface TicketIcon {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const getTicketIcon = (type: string): TicketIcon => {
  const normalizedType = type.toLowerCase().trim();
  const typeMap: Record<string, TicketIcon> = {
    'flight': { name: 'airplane', color: '#3b82f6' },
    'train': { name: 'train', color: '#10b981' },
    'bus': { name: 'car', color: '#f59e0b' },
    'hotel': { name: 'bed', color: '#8b5cf6' },
    'restaurant': { name: 'restaurant', color: '#ef4444' },
    'attraction': { name: 'camera', color: '#06b6d4' },
    'museum': { name: 'library', color: '#8b5cf6' },
    'park': { name: 'leaf', color: '#10b981' },
    'shopping': { name: 'bag', color: '#f59e0b' },
    'transport': { name: 'car', color: '#6366f1' },
    'activity': { name: 'bicycle', color: '#06b6d4' },
    'event': { name: 'calendar', color: '#ef4444' },
    'ticket': { name: 'ticket', color: '#8b5cf6' },
    'booking': { name: 'bookmark', color: '#3b82f6' },
    'reservation': { name: 'time', color: '#10b981' },
    'other': { name: 'document', color: '#6b7280' },
  };

  return typeMap[normalizedType] || typeMap['other'];
};

export const predefinedTicketTypes = [
  { name: 'flight', icon: 'airplane', color: '#3b82f6' },
  { name: 'train', icon: 'train', color: '#10b981' },
  { name: 'bus', icon: 'car', color: '#f59e0b' },
  { name: 'hotel', icon: 'bed', color: '#8b5cf6' },
  { name: 'restaurant', icon: 'restaurant', color: '#ef4444' },
  { name: 'attraction', icon: 'camera', color: '#06b6d4' },
  { name: 'museum', icon: 'library', color: '#8b5cf6' },
  { name: 'park', icon: 'leaf', color: '#10b981' },
  { name: 'shopping', icon: 'bag', color: '#f59e0b' },
  { name: 'transport', icon: 'car', color: '#6366f1' },
  { name: 'activity', icon: 'bicycle', color: '#06b6d4' },
  { name: 'event', icon: 'calendar', color: '#ef4444' },
  { name: 'ticket', icon: 'ticket', color: '#8b5cf6' },
  { name: 'booking', icon: 'bookmark', color: '#3b82f6' },
  { name: 'reservation', icon: 'time', color: '#10b981' },
  { name: 'other', icon: 'document', color: '#6b7280' },
]; 