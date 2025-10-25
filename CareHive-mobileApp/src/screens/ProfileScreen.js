import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const familyData = {
  '1': {
    id: '1',
    name: 'Nimal Perera',
    age: 32,
    gender: 'Male',
    bloodGroup: 'O+',
    height: '172 cm',
    weight: '68 kg',
    nic: '199212345678',
    phone: '077 123 4567',
    address: 'No. 24, Galle Road, Colombo 03',
  },
  '2': {
    id: '2',
    name: 'Amma',
    age: 62,
    gender: 'Female',
    bloodGroup: 'A+',
    height: '158 cm',
    weight: '60 kg',
    nic: '196212345678',
    phone: '071 234 5678',
    address: 'No. 24, Galle Road, Colombo 03',
  },
  '3': {
    id: '3',
    name: 'Thaththa',
    age: 65,
    gender: 'Male',
    bloodGroup: 'B+',
    height: '165 cm',
    weight: '72 kg',
    nic: '195912345678',
    phone: '070 345 6789',
    address: 'No. 24, Galle Road, Colombo 03',
  },
};

export default function ProfileScreen({ navigation }) {
  const [selectedMember, setSelectedMember] = useState('1');

  const userData = familyData[selectedMember];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#2298d8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Family Member Selector */}
      <View style={styles.memberSelector}>
        {Object.values(familyData).map((member) => (
          <TouchableOpacity
            key={member.id}
            style={[
              styles.memberChip,
              selectedMember === member.id && styles.memberChipActive,
            ]}
            onPress={() => setSelectedMember(member.id)}
          >
            <Text
              style={[
                styles.memberText,
                selectedMember === member.id && styles.memberTextActive,
              ]}
            >
              {member.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Icon name="person" size={60} color="#2298d8" />
        </View>

        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.subtitle}>{userData.age} years • {userData.gender}</Text>

        <View style={styles.infoRow}>
          <Icon name="bloodtype" size={20} color="#d32f2f" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Blood Group</Text>
            <Text style={styles.infoValue}>{userData.bloodGroup}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="straighten" size={20} color="#2298d8" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{userData.height}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="scale" size={20} color="#2298d8" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Weight</Text>
            <Text style={styles.infoValue}>{userData.weight}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="badge" size={20} color="#2298d8" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>NIC</Text>
            <Text style={styles.infoValue}>{userData.nic}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color="#2298d8" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userData.phone}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Icon name="location-on" size={20} color="#2298d8" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userData.address}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile', { memberId: selectedMember })}
      >
        <Text style={styles.editButtonText}>Edit Medical Info</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
  subtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
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
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});