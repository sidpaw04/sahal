import React from 'react';
import { View, Text } from 'react-native';
import { ExpenseData, PersonData, GroupData } from '../services/FirebaseService';
import { SettlementCalculator } from '../utils/settlementCalculator';
import { SettlementsSectionStyles } from '../styles/SettlementsSectionStyles';

interface SettlementsSectionProps {
  expenses: ExpenseData[];
  people: PersonData[];
  group: GroupData | null;
}

export default function SettlementsSection({ expenses, people, group }: SettlementsSectionProps) {
  if (expenses.length === 0) {
    return null;
  }

  const settlements = SettlementCalculator.getSettlements(expenses, people);

  return (
    <View style={SettlementsSectionStyles.balancesSection}>
      <Text style={SettlementsSectionStyles.sectionTitle}>Settlements</Text>
      
      {settlements.length === 0 ? (
        <View style={SettlementsSectionStyles.noSettlements}>
          <Text style={SettlementsSectionStyles.noSettlementsText}>All settled up! 🎉</Text>
        </View>
      ) : (
        <View style={SettlementsSectionStyles.settlementsList}>
          {settlements.map((settlement, index) => {
            const fromPerson = people.find(p => p.id === settlement.from);
            const toPerson = people.find(p => p.id === settlement.to);
            
            return (
              <View key={index} style={SettlementsSectionStyles.settlementItem}>
                <View style={SettlementsSectionStyles.settlementInfo}>
                  <Text style={SettlementsSectionStyles.settlementText}>
                    <Text style={SettlementsSectionStyles.settlementFrom}>{fromPerson?.name}</Text>
                    {' owes '}
                    <Text style={SettlementsSectionStyles.settlementTo}>{toPerson?.name}</Text>
                  </Text>
                  <Text style={SettlementsSectionStyles.settlementAmount}>
                    {group?.currency || 'EUR'} {settlement.amount.toFixed(2)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
} 