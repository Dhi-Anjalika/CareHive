import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  TextInput as RNTextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddAppointmentScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    patient: 'Myself',
    doctor: '',
    reason: '', 
    date: '',
    time: '',
    notes: '',
  });


  const familyMembers = ['Myself', 'Amma', 'Thaththa', 'Akka'];

  const handleSave = () => {
    const { patient, doctor, date, time } = formData;
    if (!patient || !doctor.trim() || !date || !time) {
      Alert.alert('Missing Info', 'Please fill doctor, date, and time.');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      patient,
      doctor: doctor.trim(),
      reason: formData.reason.trim(),
      date,
      time,
      notes: formData.notes.trim(),
      status: 'Scheduled',
    };

   
    console.log('Saved Appointment:', newAppointment);
    
    Alert.alert(
      'Saved!',
      'Appointment recorded successfully.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
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
            {familyMembers.map((member) => (
              <TouchableOpacity
                key={member}
                style={[styles.chip, formData.patient === member && styles.chipActive]}
                onPress={() => setFormData({ ...formData, patient: member })}
              >
                <Text style={[styles.chipText, formData.patient === member && styles.chipTextActive]}>
                  {member}
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

        {/* Date (Manual Entry) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date *</Text>
          <RNTextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (e.g., 2024-07-20)"
            value={formData.date}
            onChangeText={(text) => {
              // Optional: auto-format or validate
              setFormData({ ...formData, date: text });
            }}
            keyboardType="default"
          />
        </View>

        {/* Time (Manual Entry) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time *</Text>
          <RNTextInput
            style={styles.input}
            placeholder="e.g., 10:30 AM or 14:30"
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
  container: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2298d8',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2298d8',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  section: {
    marginBottom: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
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
  chipActive: {
    backgroundColor: '#2298d8',
    borderColor: '#2298d8',
  },
  chipText: {
    fontSize: 14,
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddAppointmentScreen;