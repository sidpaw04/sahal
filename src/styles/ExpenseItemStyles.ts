import { StyleSheet } from 'react-native';

export const ExpenseItemStyles = StyleSheet.create({
  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    marginHorizontal: 2,
    width: '100%',
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  expenseMain: {
    flex: 1,
    marginRight: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1,
  },
  categoryIcon: {
    marginRight: 6,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  expenseAmount: {
    backgroundColor: '#f0f9eb',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginRight: 40,
  },
  expenseAmountText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  expenseActions: {
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  expenseDetails: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 12,
    color: '#1e293b',
    flexShrink: 1,
  },
  moreButton: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 6,
    backgroundColor: '#e0e7ff',
    borderRadius: 6,
  },
  moreButtonText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 'bold',
  },
}); 