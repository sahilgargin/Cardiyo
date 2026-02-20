import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, Camera } from 'expo-camera';

export default function ScanCardScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  async function requestPermission() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  function handleBarCodeScanned({ type, data }: { type: string; data: string }) {
    setScanned(true);
    
    // Try to parse card data from QR code
    try {
      const cardData = JSON.parse(data);
      
      if (cardData.cardNumber || cardData.lastFourDigits) {
        Alert.alert(
          'Card Detected!',
          `Card ending in ${cardData.lastFourDigits || cardData.cardNumber.slice(-4)}`,
          [
            { text: 'Cancel', onPress: () => setScanned(false) },
            { 
              text: 'Add Card', 
              onPress: () => {
                // Navigate to add card with pre-filled data
                router.push('/add-card/select-bank');
              }
            }
          ]
        );
      } else {
        Alert.alert('Invalid QR Code', 'This QR code does not contain card information', [
          { text: 'OK', onPress: () => setScanned(false) }
        ]);
      }
    } catch (error) {
      // Not JSON, try plain text
      if (data.length === 4 && /^\d+$/.test(data)) {
        // Looks like last 4 digits
        Alert.alert(
          'Card Detected!',
          `Last 4 digits: ${data}`,
          [
            { text: 'Cancel', onPress: () => setScanned(false) },
            { 
              text: 'Add Card', 
              onPress: () => router.push('/add-card/select-bank')
            }
          ]
        );
      } else {
        Alert.alert('No Card Data', 'QR code scanned but no card information found', [
          { text: 'OK', onPress: () => setScanned(false) }
        ]);
      }
    }
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />
        <Text style={styles.message}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#060612', '#1a1a2e', '#060612']} style={StyleSheet.absoluteFill} />
        <View style={styles.content}>
          <Ionicons name="camera-off" size={80} color="#9CA3AF" />
          <Text style={styles.message}>No access to camera</Text>
          <Text style={styles.submessage}>
            Please enable camera permission in your device settings
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Scanning Frame */}
      <View style={styles.scanArea}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        
        <Text style={styles.instruction}>
          Scan QR code on your card or statement
        </Text>
        
        {scanned && (
          <TouchableOpacity 
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Manual Entry Option */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.manualButton}
          onPress={() => router.push('/add-card/select-bank')}
        >
          <Text style={styles.manualButtonText}>Enter Card Details Manually</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  message: { fontSize: 18, color: '#FFFFFF', marginTop: 20, fontWeight: '600' },
  submessage: { fontSize: 14, color: '#9CA3AF', marginTop: 8, textAlign: 'center' },
  header: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 60, paddingHorizontal: 24, zIndex: 10 },
  closeButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  scanArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { width: 250, height: 250, position: 'relative' },
  corner: { position: 'absolute', width: 40, height: 40, borderColor: '#9BFF32', borderWidth: 4 },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  instruction: { fontSize: 16, color: '#FFFFFF', marginTop: 40, textAlign: 'center', fontWeight: '600' },
  scanAgainButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: 'rgba(155, 255, 50, 0.2)', borderRadius: 20 },
  scanAgainText: { fontSize: 14, color: '#9BFF32', fontWeight: '600' },
  footer: { position: 'absolute', bottom: 40, left: 24, right: 24 },
  manualButton: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 12, alignItems: 'center' },
  manualButtonText: { fontSize: 16, color: '#FFFFFF', fontWeight: '600' },
  backButton: { marginTop: 24, paddingVertical: 12, paddingHorizontal: 32, backgroundColor: '#9BFF32', borderRadius: 12 },
  backButtonText: { fontSize: 16, color: '#060612', fontWeight: 'bold' },
});
