import React, { useState, useEffect, useCallback } from 'react'; // ✅ added useCallback
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { db } from '../DB/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useUser } from '../contexts/UserContext';
import { StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; // ✅ added

export default function MedicineSummary() {
  const { user } = useUser();
  const [medicines, setMedicines] = useState([]);
  const [activePerson, setActivePerson] = useState(null);
  const [relations, setRelations] = useState([]);

  const fetchMedicines = async () => {
    if (!user?.id) return;
    try {
      const q = query(collection(db, 'medicines'), where('userId', '==', user.id));
      const snapshot = await getDocs(q);
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(meds);

      const uniqueRelations = [...new Set(meds.map(m => m.relation))];
      setRelations(uniqueRelations);
      if (!activePerson && uniqueRelations.length > 0) setActivePerson(uniqueRelations[0]);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Replace useEffect with useFocusEffect
  useFocusEffect(
    useCallback(() => {
      fetchMedicines();
    }, [user])
  );

  const filteredMeds = medicines.filter(med => med.relation === activePerson);
  const totalTaken = filteredMeds.reduce((sum, m) => sum + (m.taken || 0), 0);
  const totalSkipped = filteredMeds.reduce((sum, m) => sum + (m.skipped || 0), 0);
  const totalMeds = filteredMeds.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Medicine Summary</Text>

        {/* Relation Buttons */}
        <View style={styles.tabContainer}>
          {relations.map(person => (
            <TouchableOpacity
              key={person}
              style={[styles.tab, activePerson === person && styles.activeTab]}
              onPress={() => setActivePerson(person)}
            >
              <Text style={[styles.tabText, activePerson === person && styles.activeTabText]}>
                {person}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Medicines</Text>
            <Text style={styles.summaryValue}>{totalMeds}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taken</Text>
            <Text style={[styles.summaryValue, { color: '#28a745' }]}>{totalTaken}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Skipped</Text>
            <Text style={[styles.summaryValue, { color: '#e53935' }]}>{totalSkipped}</Text>
          </View>
        </View>

        {/* Medicine List */}
        {filteredMeds.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No medicines recorded</Text>
          </View>
        ) : (
          filteredMeds.map(med => {
            const totalDoses = (med.quantity || 0) * (med.times?.length || 0);
            const remaining = totalDoses - (med.taken || 0);
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
                      <Text style={styles.takenValue}>{med.taken || 0}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statItem}>
                      <Text style={styles.skippedLabel}>❌ Skipped</Text>
                      <Text style={styles.skippedValue}>{med.skipped || 0}</Text>
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