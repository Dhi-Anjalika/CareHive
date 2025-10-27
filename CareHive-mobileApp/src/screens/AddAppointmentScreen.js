import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput as RNTextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from '../contexts/UserContext';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../DB/firebaseConfig';

const AddAppointmentScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    patient: 'Self',
    doctor: '',
    reason: '',
    date: '',
    time: '',
    notes: '',
  });

  const { user } = useUser();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState(null);

  // Fetch user profiles
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      try {
        const userDocId = user.id || 'b9ZC7I1EK0FEKBAdU0tz';
        setDocumentId(userDocId);

        // Self profile
        const selfProfile = {
          id: 'self',
          name: user.name || 'You',
          relation: 'Self',
          nic: user.nic || '',
          phone: user.phone || '',
          address: user.address || '',
          medicalId: user.medicalId || {},
        };

        // Family members from Firestore
        const q = query(collection(db, 'relations'), where('userId', '==', userDocId));
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

  // Save appointment to Firestore
  const handleSave = async () => {
    const { patient, doctor, date, time, reason, notes } = formData;

    if (!patient || !doctor.trim() || !date || !time) {
      Alert.alert('Missing Info', 'Please fill doctor, date, and time.');
      return;
    }

    try {
      const appointment = {
        userId: documentId,      // FK
        relation: patient,       // Selected profile relation
        doctor: doctor.trim(),
        reason: reason.trim(),
        date,
        time,
        notes: notes.trim(),
        status: 'Scheduled',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'appointments'), appointment);

      Alert.alert('Success', 'Appointment saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', 'Failed to save appointment.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#2298d8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Appointment</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* For Whom */}
        <View style={styles.section}>
          <Text style={styles.label}>For *</Text>
          <View style={styles.chipContainer}>
            {profiles.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                style={[
                  styles.chip,
                  formData.patient === profile.relation && styles.chipActive,
                ]}
                onPress={() => setFormData({ ...formData, patient: profile.relation })}
              >
                <Text
                  style={[
                    styles.chipText,
                    formData.patient === profile.relation && styles.chipTextActive,
                  ]}
                >
                  {profile.relation}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Doctor Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Doctor's Name *</Text>
          <RNTextInput
            style={styles.input}
            placeholder="e.g., Dr. Perera"
            value={formData.doctor}
            onChangeText={(text) => setFormData({ ...formData, doctor: text })}
          />
        </View>

        {/* Reason / Purpose */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Purpose (Optional)</Text>
          <RNTextInput
            style={styles.input}
            placeholder="e.g., Fever, Diabetes check, Vaccination"
            value={formData.reason}
            onChangeText={(text) => setFormData({ ...formData, reason: text })}
          />
        </View>

        {/* Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <RNTextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
          />
        </View>

        {/* Time */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time *</Text>
          <RNTextInput
            style={styles.input}
            placeholder="e.g., 10:30 AM"
            value={formData.time}
            onChangeText={(text) => setFormData({ ...formData, time: text })}
          />
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <RNTextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Hospital name, instructions, etc."
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F9FF' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2298d8' },
  saveButton: { fontSize: 16, fontWeight: '600', color: '#2298d8' },
  form: { padding: 20 },
  label: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 8 },
  inputGroup: { marginBottom: 20 },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  section: { marginBottom: 20 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  chipActive: { backgroundColor: '#2298d8', borderColor: '#2298d8' },
  chipText: { fontSize: 14, color: '#555' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
});

export default AddAppointmentScreen;
