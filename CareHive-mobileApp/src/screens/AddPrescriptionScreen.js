import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../DB/firebaseConfig';
import { useUser } from '../contexts/UserContext';

const screenHeight = Dimensions.get('window').height;

export default function AddPrescriptionScreen({ route, navigation }) {
  const { user } = useUser();
  const { patientId } = route.params || { patientId: 'self' };
  const [doctorName, setDoctorName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddPrescription = async () => {
    if (!doctorName.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'prescriptions'), {
        userId: user.id,
        patientId,
        doctorName,
        description,
        date: new Date().toISOString(),
      });

      Alert.alert('Success', 'Prescription added successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding prescription:', error);
      Alert.alert('Error', 'Failed to add prescription.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#2298d8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Prescription</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Doctor Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter doctor name"
          value={doctorName}
          onChangeText={setDoctorName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Enter prescription details"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Patient</Text>
        <Text style={styles.readOnlyText}>
          {patientId === 'self' ? 'Self' : patientId}
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={handleAddPrescription}>
          <Text style={styles.addButtonText}>Add Prescription</Text>
        </TouchableOpacity>
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
  form: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginTop: 6,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  readOnlyText: {
    fontSize: 15,
    color: '#333',
    marginTop: 6,
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#2298d8',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
