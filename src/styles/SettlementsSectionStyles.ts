import { StyleSheet } from 'react-native';

export const SettlementsSectionStyles = StyleSheet.create({
  balancesSection: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  noSettlements: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noSettlementsText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  settlementsList: {
    // No specific styles needed
  },
  settlementItem: {
    backgroundColor: '#f0f9eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    width: '100%',
  },
  settlementInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settlementText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  settlementFrom: {
    color: '#ef4444',
  },
  settlementTo: {
    color: '#22c55e',
  },
  settlementAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
    marginTop: 4,
  },
}); 