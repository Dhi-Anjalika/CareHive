import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const medicineData = [
  { id: 1, name: 'Paracetamol', for: 'Amma', quantity: 5, times: 3, taken: 2, skipped: 1 },
  { id: 2, name: 'Metformin', for: 'Thaththa', quantity: 7, times: 2, taken: 2, skipped: 0 },
  { id: 3, name: 'Vitamin C', for: 'Myself', quantity: 10, times: 1, taken: 1, skipped: 0 },
  { id: 4, name: 'Atorvastatin', for: 'Thaththa', quantity: 30, times: 1, taken: 15, skipped: 0 },
];

const familyMembers = ['Amma', 'Thaththa', 'Myself'];

export default function MedicineSummary() {
  const [activeTab, setActiveTab] = useState('Amma');

  const filteredMeds = medicineData.filter(med => med.for === activeTab);

  const totalTaken = filteredMeds.reduce((sum, m) => sum + m.taken, 0);
  const totalSkipped = filteredMeds.reduce((sum, m) => sum + m.skipped, 0);
  const totalMeds = filteredMeds.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Medicine Summary</Text>

        {/* Family Tabs */}
        <View style={styles.tabContainer}>
          {familyMembers.map(member => (
            <TouchableOpacity
              key={member}
              style={[styles.tab, activeTab === member && styles.activeTab]}
              onPress={() => setActiveTab(member)}
            >
              <Text style={[styles.tabText, activeTab === member && styles.activeTabText]}>
                {member}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary for Selected Member */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Medicines</Text>
            <Text style={styles.summaryValue}>{totalMeds}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taken</Text>
            <Text style={[styles.summaryValue, { color: '#28a745' }]}>
              {totalTaken}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Skipped</Text>
            <Text style={[styles.summaryValue, { color: '#e53935' }]}>
              {totalSkipped}
            </Text>
          </View>
        </View>

        {/* Medicine List */}
        {filteredMeds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medicines recorded</Text>
          </View>
        ) : (
          filteredMeds.map((med) => {
            const totalDoses = med.quantity * med.times;
            const remaining = totalDoses - med.taken;
            const remainingPercent = totalDoses > 0 ? (remaining / totalDoses) * 100 : 0;
            const isLow = remaining <= 3;

            return (
              <View style={styles.card} key={med.id}>
                <View style={styles.iconContainer}>
                  <Icon name="medication" size={28} color="#2298d8" />
                </View>
                <View style={styles.info}>
                  <Text style={styles.medName}>{med.name}</Text>
                  <Text style={styles.detail}>Total: {totalDoses} doses</Text>

                  <View style={styles.takenSkippedRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.takenLabel}>✅ Taken</Text>
                      <Text style={styles.takenValue}>{med.taken}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                      <Text style={styles.skippedLabel}>❌ Skipped</Text>
                      <Text style={styles.skippedValue}>{med.skipped}</Text>
                    </View>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${remainingPercent}%`,
                          backgroundColor: isLow ? '#e53935' : '#4caf50',
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.remainingText, isLow && styles.lowText]}>
                    {remaining} dose{remaining !== 1 ? 's' : ''} remaining
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f0f4ff' },
  container: { padding: 20, backgroundColor: '#f0f4ff', flexGrow: 1 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a73e8',
    marginBottom: 16,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#2298d8',
  },
  tabText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    marginRight: 16,
    marginTop: 4,
  },
  info: {
    flex: 1,
  },
  medName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  takenSkippedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  takenLabel: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: '600',
  },
  takenValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#28a745',
  },
  skippedLabel: {
    fontSize: 12,
    color: '#e53935',
    fontWeight: '600',
  },
  skippedValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#e53935',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  remainingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  lowText: {
    color: '#e53935',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});