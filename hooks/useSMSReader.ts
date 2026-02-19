import { useState } from 'react';
import { Platform } from 'react-native';
import { requestSMSPermissions, startSMSListener, readHistoricalSMS } from '../services/smsListener';

export function useSMSReader() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  async function requestPermissions() {
    if (Platform.OS !== 'android') {
      return false;
    }

    const granted = await requestSMSPermissions();
    setHasPermission(granted);
    return granted;
  }

  async function processSMS() {
    if (Platform.OS !== 'android') return;
    
    setIsProcessing(true);
    await startSMSListener();
    const count = await readHistoricalSMS(30);
    setIsProcessing(false);
    
    return count;
  }

  return {
    hasPermission,
    isProcessing,
    requestPermissions,
    processSMS,
  };
}
