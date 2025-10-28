import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../contexts/UserContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../DB/firebaseConfig';

const screenHeight = Dimensions.get('window').height;

export default function ViewPrescriptionsScreen({ navigation }) {
  const { user } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [selectedMember, setSelectedMember] = useState('self');
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPrescriptions, setLoadingPrescriptions] = useState(false);

  // Fetch user + family profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!user || !user.id) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      try {
        const selfProfile = {
          id: 'self',
          name: user.name || 'You',
          relation: 'Self',
          nic: user.nic || '',
          phone: user.phone || '',
          address: user.address || '',
          medicalId: user.medicalId || {},
        };

        const q = query(collection(db, 'relations'), where('userId', '==', user.id));
        const snapshot = await getDocs(q);
        const familyList = [];
        snapshot.forEach((doc) => {
          familyList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setProfiles([selfProfile, ...familyList]);
      } catch (error) {
        console.error('Error loading profiles:', error);
        Alert.alert('Error', 'Failed to load profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user?.id]);

  // Fetch prescriptions for selected member
  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user?.id || !selectedMember) {
        setPrescriptions([]);
        return;
      }

      setLoadingPrescriptions(true);
      try {
        const q = query(
          collection(db, 'prescriptions'),
          where('userId', '==', user.id),
          where('patientId', '==', selectedMember)
        );
        const snapshot = await getDocs(q);
        const prescList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrescriptions(prescList);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        Alert.alert('Error', 'Failed to load prescriptions.');
        setPrescriptions([]);
      } finally {
        setLoadingPrescriptions(false);
      }
    };

    fetchPrescriptions();
  }, [user?.id, selectedMember]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2298d8" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (profiles.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profile data available.</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddFamilyMembers')}
        >
          <Text style={styles.addButtonText}>Add Family Member</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#2298d8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prescriptions</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Family Member Selector */}
      <Text style={styles.label}>For</Text>
      <View style={styles.memberSelector}>
        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[
              styles.memberChip,
              selectedMember === profile.id && styles.memberChipActive,
            ]}
            onPress={() => setSelectedMember(profile.id)}
          >
            <Text
              style={[
                styles.memberText,
                selectedMember === profile.id && styles.memberTextActive,
              ]}
            >
              {profile.relation}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prescriptions List */}
      <View style={styles.prescriptionsSection}>
        {loadingPrescriptions ? (
          <ActivityIndicator size="small" color="#2298d8" />
        ) : prescriptions.length === 0 ? (
          <Text style={styles.noPrescriptions}>No prescriptions for this member.</Text>
        ) : (
          prescriptions.map((p) => (
            <View key={p.id} style={styles.prescriptionCard}>
              <Text style={styles.prescDoctor}>{p.doctorName}</Text>
              <Text style={styles.prescDate}>
                {new Date(p.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
              <Text style={styles.prescDescription}>{p.description}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: screenHeight * 0.06,
    paddingHorizontal: 20,
    backgroundColor: '#F6F9FF',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2298d8',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  memberSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  memberChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    marginBottom: 10,
  },
  memberChipActive: {
    backgroundColor: '#2298d8',
  },
  memberText: {
    fontSize: 14,
    color: '#333',
  },
  memberTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  prescriptionsSection: {
    marginBottom: 20,
  },
  prescriptionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  prescDoctor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  prescDate: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  prescDescription: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
  },
  noPrescriptions: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginVertical: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6F9FF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F6F9FF',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#2298d8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
