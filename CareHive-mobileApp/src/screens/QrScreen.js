import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    try {
      const user = JSON.parse(data); // Parse JSON from QR code
      setScannedData(user);
    } catch (e) {
      alert("Invalid QR code");
    }
  };

  if (hasPermission === null) return <Text>Requesting camera permission...</Text>;
  if (hasPermission === false) return <Text>No access to camera</Text>;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {!scannedData && (
        <BarCodeScanner
          onBarCodeScanned={handleBarCodeScanned}
          style={{ width: 300, height: 300 }}
        />
      )}

      {scannedData && (
        <View>
          <Text>Username: {scannedData.username}</Text>
          <Text>Email: {scannedData.email}</Text>
          <Button title="Scan Again" onPress={() => setScannedData(null)} />
        </View>
      )}
    </View>
  );
}
