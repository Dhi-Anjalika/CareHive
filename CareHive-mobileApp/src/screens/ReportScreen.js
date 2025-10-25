import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

export default function ReportScreen() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);

  // Pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFile({ uri: result.assets[0].uri, type: 'image' });
    }
  };

  // Pick PDF or document
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*', // you can restrict to 'application/pdf'
    });

    if (result.type === 'success') {
      setFile({ uri: result.uri, name: result.name, type: 'document' });
    }
  };

  const handleSubmit = () => {
    if (!description.trim() || !file) {
      Alert.alert('Error', 'Please provide description and attach a file.');
      return;
    }

    const newReport = {
      id: Date.now().toString(),
      description,
      file,
    };

    setReports([newReport, ...reports]);
    setDescription('');
    setFile(null);
    Alert.alert('Success', 'Report added successfully.');
  };

  const renderItem = ({ item }) => (
    <View style={styles.reportItem}>
      {item.file.type === 'image' ? (
        <Image source={{ uri: item.file.uri }} style={styles.reportImage} />
      ) : (
        <MaterialIcons name="picture-as-pdf" size={50} color="#d9534f" />
      )}
      <Text style={styles.reportDescription}>{item.description}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Submit a Report</Text>

      <TextInput
        style={styles.textInput}
        placeholder="Describe your issue or feedback"
        placeholderTextColor="#888"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <View style={styles.fileButtons}>
        <TouchableOpacity style={styles.fileButton} onPress={pickImage}>
          <MaterialIcons name="image" size={24} color="#fff" />
          <Text style={styles.fileButtonText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fileButton} onPress={pickDocument}>
          <MaterialIcons name="attach-file" size={24} color="#fff" />
          <Text style={styles.fileButtonText}>Pick PDF</Text>
        </TouchableOpacity>
      </View>

      {file && (
        <Text style={{ marginBottom: 10 }}>
          Selected File: {file.name || file.uri.split('/').pop()}
        </Text>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <MaterialIcons name="send" size={22} color="#fff" />
        <Text style={styles.submitButtonText}>Submit Report</Text>
      </TouchableOpacity>

      <Text style={styles.listTitle}>All Reports</Text>
      {reports.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#555' }}>No reports yet.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      )}
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2298d8',
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  fileButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2298d8',
    padding: 10,
    borderRadius: 8,
  },
  fileButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#2298d8',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2298d8',
    marginBottom: 10,
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  reportImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  reportDescription: {
    flex: 1,
    fontSize: 16,
  },
});
