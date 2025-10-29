import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../contexts/UserContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../DB/firebaseConfig';

export default function ProfileScreen({ navigation }) {
  const { user } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState('self');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
        const querySnapshot = await getDocs(q);
        const familyList = [];
        querySnapshot.forEach((doc) => {
          familyList.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setProfiles([selfProfile, ...familyList]);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2298d8" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);

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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#2298d8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.memberSelector}>
        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[
              styles.memberChip,
              selectedProfileId === profile.id && styles.memberChipActive,
            ]}
            onPress={() => setSelectedProfileId(profile.id)}
          >
            <Text
              style={[
                styles.memberText,
                selectedProfileId === profile.id && styles.memberTextActive,
              ]}
            >
              {profile.relation}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedProfile && (
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Icon name="person" size={60} color="#2298d8" />
          </View>

          <Text style={styles.name}>{selectedProfile.name || 'N/A'}</Text>

          {selectedProfile.medicalId?.bloodGroup && (
            <View style={styles.infoRow}>
              <Icon name="bloodtype" size={20} color="#d32f2f" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Blood Group</Text>
                <Text style={styles.infoValue}>{selectedProfile.medicalId.bloodGroup}</Text>
              </View>
            </View>
          )}

          {selectedProfile.medicalId?.height && (
            <View style={styles.infoRow}>
              <Icon name="straighten" size={20} color="#2298d8" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Height</Text>
                <Text style={styles.infoValue}>{selectedProfile.medicalId.height}</Text>
              </View>
            </View>
          )}

          {selectedProfile.medicalId?.weight && (
            <View style={styles.infoRow}>
              <Icon name="scale" size={20} color="#2298d8" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Weight</Text>
                <Text style={styles.infoValue}>{selectedProfile.medicalId.weight}</Text>
              </View>
            </View>
          )}

          {selectedProfile.nic && (
            <View style={styles.infoRow}>
              <Icon name="badge" size={20} color="#2298d8" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>NIC</Text>
                <Text style={styles.infoValue}>{selectedProfile.nic}</Text>
              </View>
            </View>
          )}

          {selectedProfile.phone && (
            <View style={styles.infoRow}>
              <Icon name="phone" size={20} color="#2298d8" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{selectedProfile.phone}</Text>
              </View>
            </View>
          )}

          {selectedProfile.address && (
            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color="#2298d8" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{selectedProfile.address}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* <TouchableOpacity
        style={styles.editButton}
        onPress={() => {
          if (selectedProfileId === 'self') {
            navigation.navigate('EditProfile', { isSelf: true });
          } else {
            navigation.navigate('EditProfile', { memberId: selectedProfileId });
          }
        }}
      >
        <Text style={styles.editButtonText}>Edit Medical Info</Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AddFamilyMembers')}
      >
        <Text style={styles.editButtonText}>Add Family Member</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('ViewPrescriptionsScreen')}
      >
        <Text style={styles.editButtonText}>Priscriptions</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9FF',
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2298d8',
  },
  memberSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    flexWrap: 'wrap',
    marginTop: 20
  },
  memberChip: {
    paddingHorizontal: 16,
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
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    marginBottom: 15,
  },
  infoTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#888',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#2298d8',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});