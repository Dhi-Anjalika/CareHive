import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [nic, setNic] = useState('');
  const [phone, setPhone] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleRegister = () => {
    if (!name || !nic || !phone || !bloodGroup || !height || !weight) {
      Alert.alert('Missing Info', 'Please fill all fields');
      return;
    }

    if (nic.length !== 12 && nic.length !== 13) {
      Alert.alert('Invalid NIC', 'NIC must be 12 or 13 digits');
      return;
    }

    const userData = {
      id: '1',
      name,
      relation: 'Self',
      nic,
      phone,
      address: '',
      medicalId: {
        bloodGroup,
        height: `${height} cm`,
        weight: `${weight} kg`,
        age: 0,
        gender: 'Not specified',
        allergies: '',
        chronicConditions: '',
      },
    };

    console.log('Registered:', userData);
    Alert.alert('Success', 'Profile created!', [
      { text: 'Continue', onPress: () => navigation.replace('Dashboard') },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Join CareHive</Text>
        <Text style={styles.subtitle}>Create your family health profile</Text>
      </View>

      <View style={styles.form}>
        {/* Full Name */}
        <View style={styles.inputGroup}>
          <View style={styles.iconContainer}>
            <Icon name="person" size={20} color="#2298d8" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* NIC */}
        <View style={styles.inputGroup}>
          <View style={styles.iconContainer}>
            <Icon name="badge" size={20} color="#2298d8" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="NIC "
            placeholderTextColor="#999"
            value={nic}
            onChangeText={setNic}
            keyboardType="numeric"
            maxLength={13}
          />
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <View style={styles.iconContainer}>
            <Icon name="phone" size={20} color="#2298d8" />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Blood Group */}
        <View style={styles.inputGroup}>
          <View style={styles.iconContainer}>
            <Icon name="bloodtype" size={20} color="#d32f2f" />
          </View>
          <Text style={styles.bloodGroupLabel}>Select Blood Group</Text>
        </View>
        <View style={styles.bloodGroupContainer}>
          {bloodGroups.map((group) => (
            <TouchableOpacity
              key={group}
              style={[
                styles.bloodGroupButton,
                bloodGroup === group && styles.bloodGroupButtonActive,
              ]}
              onPress={() => setBloodGroup(group)}
            >
              <Text
                style={[
                  styles.bloodGroupText,
                  bloodGroup === group && styles.bloodGroupTextActive,
                ]}
              >
                {group}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Height & Weight */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <View style={styles.iconContainer}>
              <Icon name="straighten" size={20} color="#2298d8" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Height cm"
              placeholderTextColor="#999"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <View style={styles.iconContainer}>
              <Icon name="scale" size={20} color="#2298d8" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Weight kg"
              placeholderTextColor="#999"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create My Profile</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.replace('Login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F6F9FF',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2298d8',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  bloodGroupLabel: {
    color: '#666',
    fontSize: 14,
  },
  bloodGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  bloodGroupButton: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  bloodGroupButtonActive: {
    backgroundColor: '#2298d8',
    borderColor: '#2298d8',
  },
  bloodGroupText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
  },
  bloodGroupTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2298d8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#666',
  },
  loginLink: {
    color: '#2298d8',
    fontWeight: '600',
  },
});