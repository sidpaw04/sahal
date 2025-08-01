import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ExpenseData, PersonData } from '../services/FirebaseService';
import { ExpenseItemStyles } from '../styles/ExpenseItemStyles';
import { getCategoryIcon } from '../utils/categoryIcons';

interface ExpenseItemProps {
  item: ExpenseData;
  people: PersonData[];
  onDelete: (expenseId: string) => void;
}

export default function ExpenseItem({ item, people, onDelete }: ExpenseItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetails = item.notes || item.location || item.splitRatio !== '1:1:1';
  const categoryIcon = getCategoryIcon(item.category);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <View style={ExpenseItemStyles.expenseCard}>
      <View style={ExpenseItemStyles.expenseRow}>
        <View style={ExpenseItemStyles.expenseMain}>
          <View style={ExpenseItemStyles.titleRow}>
            <Ionicons 
              name={categoryIcon.name} 
              size={20} 
              color={categoryIcon.color} 
              style={ExpenseItemStyles.categoryIcon}
            />
          <Text style={ExpenseItemStyles.expenseTitle}>{item.title}</Text>
          </View>
        </View>
        
        <View style={ExpenseItemStyles.expenseAmount}>
          <Text style={ExpenseItemStyles.expenseAmountText}>
            {item.currency} {item.amount.toFixed(2)}
          </Text>
        </View>
        
        <View style={ExpenseItemStyles.expenseActions}>
          <TouchableOpacity
            style={ExpenseItemStyles.deleteButton}
            onPress={() => onDelete(item.id)}
          >
            <Text style={ExpenseItemStyles.deleteButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Details section - shown when expanded */}
      {isExpanded && (
        <View style={ExpenseItemStyles.expenseDetails}>
          <View style={ExpenseItemStyles.detailRow}>
            <Text style={ExpenseItemStyles.detailLabel}>Paid by:</Text>
            <Text style={ExpenseItemStyles.detailValue}>
              {people.find(p => p.id === item.paidBy)?.name || item.paidBy}
            </Text>
          </View>
          
          <View style={ExpenseItemStyles.detailRow}>
            <Text style={ExpenseItemStyles.detailLabel}>Split between:</Text>
            <Text style={ExpenseItemStyles.detailValue}>
              {item.splitBetween.map(id => 
                people.find(p => p.id === id)?.name || id
              ).join(', ')}
              {item.splitRatio && item.splitRatio !== '1:1:1' && ` (${item.splitRatio})`}
            </Text>
          </View>
          
          {item.notes && (
            <View style={ExpenseItemStyles.detailRow}>
              <Text style={ExpenseItemStyles.detailLabel}>Notes:</Text>
              <Text style={ExpenseItemStyles.detailValue}>{item.notes}</Text>
            </View>
          )}
          
          {item.location && (
            <View style={ExpenseItemStyles.detailRow}>
              <Text style={ExpenseItemStyles.detailLabel}>Location:</Text>
              <Text style={ExpenseItemStyles.detailValue}>{item.location}</Text>
            </View>
          )}
        </View>
      )}
      
      {/* Show "more" link if there are details to show */}
      {hasDetails && (
        <TouchableOpacity 
          style={ExpenseItemStyles.moreButton}
          onPress={toggleExpanded}
        >
          <Text style={ExpenseItemStyles.moreButtonText}>
            {isExpanded ? 'Show less' : 'Show details'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 