import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform, // ✅ Added Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AddBtn from '../component/addbtn';
import MedicineCard from '../component/MedicineCard';
import { useUser } from '../contexts/UserContext';
import { db } from '../DB/firebaseConfig';
import { collection, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import * as Notifications from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  const { user } = useUser();
  const [medicines, setMedicines] = useState([]);
  const intervalRef = useRef(null);

  // Request notification permission
  useEffect(() => {
    const registerForNotifications = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') return;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };
    registerForNotifications();
  }, []);

  // Fetch medicines from Firebase
  const fetchMedicines = async () => {
    if (!user?.id) return;
    try {
      const q = query(collection(db, 'medicines'), where('userId', '==', user.id));
      const snapshot = await getDocs(q);
      const meds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedicines(meds);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  // Refresh on focus
  useFocusEffect(
    useCallback(() => {
      fetchMedicines();
    }, [user])
  );

  // 🔁 Auto-refresh every 60 seconds while screen is focused
  useEffect(() => {
    // Start interval when component mounts
    intervalRef.current = setInterval(() => {
      fetchMedicines();
    }, 60 * 1000); // 60,000 ms = 1 minute

    // Clear interval when unmounting
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user]);

  // Convert time string to Date object
  const getNextDoseTime = (timeStr) => {
    if (!timeStr) return null;
    const now = new Date();
    const match = timeStr.match(/(\d{1,2}):(\d{2})(AM|PM)/i);
    if (!match) return null;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const meridiem = match[3].toUpperCase();

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;

    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  };

  // Schedule reminder 5 minutes before dose
  const scheduleReminder = async (medName, doseTime) => {
    const now = new Date();
    const triggerTime = new Date(doseTime.getTime() - 5 * 60 * 1000);
    if (triggerTime <= now) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medicine Reminder',
        body: `Time to take ${medName}`,
      },
      trigger: { date: triggerTime },
    });
  };

  // 💡 Improved logic: show ALL medicines with future doses in "Next"
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);

  const processMedicines = medicines.map(med => {
    const todayDoses = (med.times || []).map(timeStr => {
      const doseTime = getNextDoseTime(timeStr);
      return { timeStr, doseTime };
    }).filter(item => item.doseTime);

    let takenToday = 0;
    if (med.lastTakenAt) {
      const lastTakenDate = new Date(med.lastTakenAt);
      if (lastTakenDate >= startOfDay && lastTakenDate <= endOfDay) {
        takenToday = med.taken || 0;
      }
    }

    let hasDue = false;
    let nextTime = null;

    // Check from first un-taken dose onward
    for (let i = takenToday; i < todayDoses.length; i++) {
      const { doseTime, timeStr } = todayDoses[i];
      if (doseTime <= now) {
        hasDue = true;
        nextTime = timeStr;
        break;
      } else if (!nextTime) {
        nextTime = timeStr;
        // Don't break — keep checking for due doses later
      }
    }

    const hasFuture = todayDoses.some((d, idx) => idx >= takenToday && d.doseTime > now);

    let status = 'Taken';
    if (hasDue) {
      status = 'Due';
    } else if (hasFuture) {
      status = 'Next';
      // Schedule reminder for the first future dose
      const firstFuture = todayDoses.find((d, idx) => idx >= takenToday && d.doseTime > now);
      if (firstFuture) {
        scheduleReminder(med.name, firstFuture.doseTime);
      }
    }

    return {
      ...med,
      status,
      currentTime: nextTime,
      takenToday,
    };
  });

  const dueNowMedicines = processMedicines.filter(m => m.status === 'Due');
  const nextMedicines = processMedicines.filter(m => m.status === 'Next');

  // Handle Taken
  const handleTaken = async (id) => {
    try {
      const medRef = doc(db, 'medicines', id);
      const med = medicines.find(m => m.id === id);
      const takenCount = (med.taken || 0) + 1;
      const now = new Date();

      await updateDoc(medRef, { taken: takenCount, lastTakenAt: now.toISOString() });
      fetchMedicines(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Skip
  const handleSkip = async (id) => {
    try {
      const medRef = doc(db, 'medicines', id);
      const med = medicines.find(m => m.id === id);
      const skippedCount = (med.skipped || 0) + 1;
      const now = new Date();

      await updateDoc(medRef, { skipped: skippedCount, lastTakenAt: now.toISOString() });
      fetchMedicines(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.left}>
          <Text style={styles.appTitle}>CareHive</Text>
          <Text style={styles.subtitle}>Family Medical Tracker</Text>
          <Text style={styles.welcome}>Welcome Back 👋</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')} activeOpacity={0.7}>
            <View style={styles.profileIcon}>
              <MaterialIcons name="person" size={30} color="#2298d8" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.btnSection}>
          <AddBtn label="Add Medicine" onPress={() => navigation.navigate('AddMedicine')} />
          <AddBtn label="Appointment" onPress={() => navigation.navigate('AppointmentsScreen')} />
        </View>

        <View style={styles.mediView}>
          <Text style={styles.mediTitle}>Medicines</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
            {processMedicines.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#555' }}>No medicines found</Text>
            ) : (
              <>
                {dueNowMedicines.length > 0 && (
                  <>
                    <Text style={styles.sectionLabel}>Due Now</Text>
                    {dueNowMedicines.map(med => (
                      <MedicineCard
                        key={med.id}
                        name={med.name}
                        time={med.currentTime}
                        status={med.status}
                        for={med.relation}
                        onTaken={() => handleTaken(med.id)}
                        onSkip={() => handleSkip(med.id)}
                      />
                    ))}
                  </>
                )}
                {nextMedicines.length > 0 && (
                  <>
                    <Text style={styles.sectionLabel}>Next</Text>
                    {nextMedicines.map(med => (
                      <MedicineCard
                        key={med.id}
                        name={med.name}
                        time={med.currentTime}
                        status={med.status}
                        for={med.relation}
                        onTaken={() => handleTaken(med.id)}
                        onSkip={() => handleSkip(med.id)}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F9FF' },
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
  bottomContainer: { flex: 1, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20, color: '#333' },
  btnSection: { flexDirection: 'row', justifyContent: 'space-between' },
  mediView: { marginTop: 20, height: '85%', borderRadius: 10, padding: 5 },
  mediTitle: { color: '#0b0b0bff', fontSize: 19, fontWeight: '500' },
  sectionLabel: { color: '#000000ff', fontSize: 14, fontWeight: '600', marginTop: 10, marginLeft: 10 },
});