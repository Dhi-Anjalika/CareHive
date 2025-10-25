import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

export default function MedicineCard({ name, time, status: initialStatus, for: forWhom }) {
  const [status, setStatus] = useState(initialStatus);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Due':
        return { color: '#e53935', label: 'Due' };
      case 'Next':
        return { color: '#fb8c00', label: 'Next' };
      case 'Taken':
        return { color: '#2e7d32', label: 'Taken' };
      case 'Skipped':
        return { color: '#757575', label: 'Skipped' };
      default:
        return { color: '#757575', label: status };
    }
  };

  const { color: statusColor, label: statusLabel } = getStatusConfig(status);

  const handleSkip = () => {
    setStatus('Skipped');
  };

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>💊</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.medName} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.forText}>For: {forWhom}</Text>
        <Text style={styles.time}>⏰ {time}</Text>
      </View>

      <View style={styles.rightSection}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: `${statusColor}15` },
          ]}
        >
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusLabel}
          </Text>
        </View>

        {status !== 'Taken' && status !== 'Skipped' && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.takeButton]}
              onPress={() => setStatus('Taken')}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>✓ Taken</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.skipButton]}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>✕ Skip</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 14,
  },
  iconContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 24,
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 22,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  medName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  forText: {
    fontSize: 13,
    color: '#2298d8',
    fontWeight: '600',
    marginBottom: 3,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  takeButton: {
    backgroundColor: '#2e7d32',
  },
  skipButton: {
    backgroundColor: '#e0e0e0',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
});