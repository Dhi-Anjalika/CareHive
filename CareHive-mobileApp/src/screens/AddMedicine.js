import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenHeight = Dimensions.get('window').height;

const familyMembers = ['Myself', 'Amma', 'Thaththa', 'Akka'];

export default function AddMedicine({ navigation }) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [times, setTimes] = useState(['']);
  const [selectedMember, setSelectedMember] = useState('Myself'); // Default

  const handleAddTime = () => {
    setTimes([...times, '']);
  };

  const handleTimeChange = (text, index) => {
    const newTimes = [...times];
    newTimes[index] = text;
    setTimes(newTimes);
  };

  const handleAddMedicine = () => {
    if (!name || !quantity || !selectedMember || times.some((t) => t === '')) {
      alert('Please fill all fields and times');
      return;
    }

    console.log('Medicine added:', { name, quantity, times, for: selectedMember });
    alert('Medicine added successfully!');
    setName('');
    setQuantity('');
    setTimes(['']);
    setSelectedMember('Myself');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Medicine</Text>

      <View style={styles.bannerContainer}>
        <Image
          source={require('../assets/img/medi.jpg')}
          style={styles.banner}
          resizeMode="cover"
        />
      </View>

      {/* Family Member Selector */}
      <Text style={styles.label}>For</Text>
      <View style={styles.memberSelector}>
        {familyMembers.map((member) => (
          <TouchableOpacity
            key={member}
            style={[styles.memberChip, selectedMember === member && styles.memberChipActive]}
            onPress={() => setSelectedMember(member)}
          >
            <Text style={[styles.memberText, selectedMember === member && styles.memberTextActive]}>
              {member}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Medicine Name */}
      <View style={styles.inputContainer}>
        <Icon name="medication" size={24} color="#2298d8" style={styles.icon} />
        <TextInput
          placeholder="Medicine Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Quantity */}
      <View style={styles.inputContainer}>
        <Icon name="calendar-today" size={24} color="#2298d8" style={styles.icon} />
        <TextInput
          placeholder="Quantity (Number of Days)"
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />
      </View>

      {/* Times */}
      <Text style={styles.timesTitle}>Schedule Times</Text>
      {times.map((t, index) => (
        <View style={styles.inputContainer} key={index}>
          <Icon name="access-time" size={24} color="#2298d8" style={styles.icon} />
          <TextInput
            placeholder="Time (e.g., 08:00 AM)"
            style={styles.input}
            value={t}
            onChangeText={(text) => handleTimeChange(text, index)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.addTimeButton} onPress={handleAddTime}>
        <Text style={styles.addTimeText}>+ Add Time</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleAddMedicine}>
        <Text style={styles.buttonText}>Add Medicine</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: screenHeight * 0.03,
    fontWeight: '700',
    color: '#2298d8',
    marginBottom: 20,
    textAlign: 'center',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  timesTitle: {
    fontSize: screenHeight * 0.022,
    fontWeight: '600',
    marginBottom: 10,
  },
  addTimeButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addTimeText: { color: '#2298d8', fontWeight: '600', fontSize: 16 },
  button: {
    backgroundColor: '#2298d8',
    paddingVertical: screenHeight * 0.018,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bannerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: screenHeight * 0.25,
    borderRadius: 12,
  },
});