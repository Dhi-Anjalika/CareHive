import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AddBtn from '../component/addbtn';
import MedicineCard from '../component/MedicineCard';
import AppointmentsScreen from './AppointmentsScreen';
import { TouchableOpacity } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const dueNowMedicines = [
  { id: 1, name: 'Paracetamol', time: '8:00 AM', status: 'Due', for: 'Amma' },
  { id: 2, name: 'Metformin', time: '9:00 AM', status: 'Due', for: 'Myself' },
];

const nextMedicines = [
  { id: 3, name: 'Vitamin C', time: '12:30 PM', status: 'Next', for: 'Thaththa' },
  { id: 4, name: 'Amoxicillin', time: '8:00 PM', status: 'Next', for: 'Ravi' },
  { id: 5, name: 'Omega 3', time: '6:00 PM', status: 'Next', for: 'Myself' },
];
export default function DashboardScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.profileContainer}>
        <View style={styles.left}>
          <Text style={styles.appTitle}>CareHive</Text>
          <Text style={styles.subtitle}>Family Medical Tracker</Text>
          <Text style={styles.welcome}>Welcome Back 👋</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} activeOpacity={0.7}>
            <View style={styles.profileIcon}>
              <Icon name="person" size={30} color="#2298d8" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.btnSection}>
          <AddBtn 
            label="Add Medicine" 
            onPress={() => console.log("Add medicine pressed")}
          />
            <AddBtn 
              label="Appointment" 
              onPress={() => navigation.navigate('AppointmentsScreen')}
            />
        </View>

        <View style={styles.mediView}>
          <Text style={styles.mediTitle}>Medicines</Text>

          <ScrollView contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}>
           
           {dueNowMedicines.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Due Now</Text>
                {dueNowMedicines.map(med => (
                  <MedicineCard key={med.id} {...med} />
                ))}
              </>
            )}

              {nextMedicines.length > 0 && (
              <>
                <Text style={styles.sectionLabel}>Next</Text>
                {nextMedicines.map(med => (
                  <MedicineCard key={med.id} {...med} />
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9FF',
  },

  // Header Section
  profileContainer: {
    backgroundColor: '#2298d8',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  left: { flex: 2, justifyContent: 'center' },
  appTitle: { color: '#ffffff', fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#e0f0ff', marginTop: 5 },
  welcome: { fontSize: 18, color: '#ffffff', marginTop: 10 },
  right: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-start' },
  profileIcon: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  // Bottom Section
  bottomContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  btnSection: { flexDirection: 'row', justifyContent: 'space-between' },

  // Medicine Section
  mediView: {
    marginTop: 20,
    height: '85%', 
    borderRadius: 10,
    padding: 5,
  },
  mediTitle: {
    color: '#0b0b0bff',
    fontSize: 19,
    fontWeight: '500',
  },
  sectionLabel: {
    color: '#000000ff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginLeft: 10,
  },
});
