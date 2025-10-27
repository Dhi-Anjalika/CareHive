import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useUser } from '../contexts/UserContext';
import { collection, query, where, getDocs, addDoc, getDoc, doc } from 'firebase/firestore';
import { db, storage } from '../DB/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ReportScreen() {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useUser();

  // pick image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setFile({ uri: asset.uri, name: asset.fileName || 'image.jpg', type: 'image' });
    }
  };

  // pick document (PDF)
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setFile({ uri: asset.uri, name: asset.name, type: 'document' });
    }
  };

  // upload and save report
  const handleSubmit = async () => {
    if (!description.trim() || !file) {
      Alert.alert('Error', 'Please provide description and attach a file.');
      return;
    }
    if (!selectedMember) {
      Alert.alert('Error', 'Please select a member.');
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(file.uri);
      const blob = await response.blob();

      const fileRef = ref(storage, `reports/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      const reportRef = await addDoc(collection(db, 'reports'), {
        description,
        fileUrl: downloadURL,
        fileName: file.name,
        memberId: selectedMember,
        userId: user?.id || 'b9ZC7I1EK0FEKBAdU0tz',
        createdAt: new Date(),
      });

      const newReport = {
        id: reportRef.id,
        description,
        fileUrl: downloadURL,
        fileName: file.name,
        memberId: selectedMember,
        type: file.type,
      };

      setReports([newReport, ...reports]);
      setDescription('');
      setFile(null);
      Alert.alert('Success', 'Report uploaded successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to upload report.');
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  // load profiles
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.id) {
        setProfiles([]);
        setLoading(false);
        return;
      }

      try {
        const userDocId = user.id || 'b9ZC7I1EK0FEKBAdU0tz';

        const selfProfile = {
          id: 'self',
          name: user.name || 'You',
          relation: 'Self',
        };

        const q = query(collection(db, 'relations'), where('userId', '==', userDocId));
        const querySnapshot = await getDocs(q);
        const familyList = [];
        querySnapshot.forEach((doc) => {
          familyList.push({ id: doc.id, ...doc.data() });
        });

        const allProfiles = [selfProfile, ...familyList];
        setProfiles(allProfiles);

        if (allProfiles.length > 0) setSelectedMember(allProfiles[0].id);
      } catch (error) {
        Alert.alert('Error', 'Failed to load profiles.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const renderItem = ({ item }) => (
    <View style={styles.reportItem}>
      {item.type === 'image' ? (
        <Image source={{ uri: item.fileUrl }} style={styles.reportImage} />
      ) : (
        <MaterialIcons name="picture-as-pdf" size={50} color="#d9534f" />
      )}
      <View style={{ flex: 1 }}>
        <Text style={styles.reportDescription}>{item.description}</Text>
        <Text style={{ color: '#555', fontSize: 12 }}>{item.fileName}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2298d8" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Submit a Report</Text>

      <Text style={styles.label}>For</Text>
      <View style={styles.memberSelector}>
        {profiles.map((profile) => (
          <TouchableOpacity
            key={profile.id}
            style={[styles.memberChip, selectedMember === profile.id && styles.memberChipActive]}
            onPress={() => setSelectedMember(profile.id)}
          >
            <Text style={[styles.memberText, selectedMember === profile.id && styles.memberTextActive]}>
              {profile.relation}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <MaterialIcons name="send" size={22} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </>
        )}
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
  container: { flexGrow: 1, backgroundColor: '#F6F9FF', padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2298d8', marginBottom: 15, textAlign: 'center' },
  textInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 10, backgroundColor: '#fff', padding: 10, fontSize: 16, marginBottom: 15, minHeight: 80, textAlignVertical: 'top' },
  fileButtons: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  fileButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2298d8', padding: 10, borderRadius: 8 },
  fileButtonText: { color: '#fff', marginLeft: 5, fontWeight: '600' },
  submitButton: { flexDirection: 'row', backgroundColor: '#2298d8', borderRadius: 8, paddingVertical: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 8 },
  listTitle: { fontSize: 20, fontWeight: 'bold', color: '#2298d8', marginBottom: 10 },
  reportItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10 },
  reportImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  reportDescription: { flex: 1, fontSize: 16 },
  memberSelector: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  memberChip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#e0e0e0', marginRight: 10, marginBottom: 10 },
  memberChipActive: { backgroundColor: '#2298d8' },
  memberText: { fontSize: 14, fontWeight: '600', color: '#555' },
  memberTextActive: { color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
});
