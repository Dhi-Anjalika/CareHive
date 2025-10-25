import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to</Text>
        <Text style={styles.headerTextHighlight}>CareHive</Text>
        <Text style={styles.subText}>Track Your Health Daily</Text>
      </View>

      {/* Background Image */}
      <ImageBackground
        source={require('../assets/img/doca.png')}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.form}>
            <Text style={styles.loginTitle}>LOGIN</Text>

            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <MaterialIcons name="person" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#aaa"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                placeholderTextColor="#aaa"
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() =>
                navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })
              }
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>


            <View style={styles.footer}>
  <Text style={styles.footerText}>Don't have an account? </Text>
  <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
    <Text style={styles.signup}>Sign Up</Text>
  </TouchableOpacity>
</View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 30,
  },

  headerText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#222',
  },

  headerTextHighlight: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2298d8',
  },

  subText: {
    marginTop: 6,
    fontSize: 16,
    color: '#555',
  },

  image: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },

  form: {
    width: width * 0.85,
    backgroundColor: '#ffffffee',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },

  loginTitle: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },

  loginButton: {
    backgroundColor: '#2298d8',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },

  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  footerText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#666',
  },

  signup: {
    color: '#2298d8',
    fontWeight: 'bold',
  },
  footer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 20,
},
footerText: {
  fontSize: 14,
  color: '#666',
},
signup: {
  fontSize: 14,
  color: '#2298d8',
  fontWeight: '600',
  textDecorationLine: 'underline', 
},
});
