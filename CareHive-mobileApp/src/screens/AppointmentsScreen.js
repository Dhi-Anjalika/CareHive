import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppointmentsScreen = ({ navigation }) => {
  const appointments = [
    { id: '1', doctor: 'Dr. Silva', specialty: 'Cardiologist', date: '2024-07-10', time: '10:30 AM', hospital: 'National Hospital, Colombo' },
    { id: '2', doctor: 'Dr. Perera', specialty: 'Dentist', date: '2024-07-15', time: '2:00 PM', hospital: 'Dental Hospital, Colombo' },
    { id: '3', doctor: 'Dr. Fernando', specialty: 'Pediatrician', date: '2024-07-22', time: '9:00 AM', hospital: 'Lady Ridgeway Hospital' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Icon name="event" size={24} color="#2298d8" />
      </View>
      <View style={styles.info}>
        <Text style={styles.doctor}>{item.doctor}</Text>
        <Text style={styles.specialty}>{item.specialty}</Text>
        <Text style={styles.hospital}>{item.hospital}</Text>
        <View style={styles.dateTime}>
          <Icon name="calendar-today" size={16} color="#555" />
          <Text style={styles.date}>{item.date}</Text>
          <Icon name="access-time" size={16} color="#555" style={{ marginLeft: 10 }} />
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={28} color="#2298d8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Appointments</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddAppointmentScreen')}>
          <Icon name="add" size={28} color="#2298d8" />
        </TouchableOpacity>
      </View>

      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="event-note" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No upcoming appointments</Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2298d8',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'flex-start',
  },
  info: {
    flex: 1,
  },
  doctor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  specialty: {
    fontSize: 14,
    color: '#2298d8',
    marginVertical: 4,
  },
  hospital: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#555',
    marginLeft: 6,
  },
  time: {
    fontSize: 13,
    color: '#555',
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 15,
  },
});

export default AppointmentsScreen;