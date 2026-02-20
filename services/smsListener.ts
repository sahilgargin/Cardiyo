import { Platform, PermissionsAndroid, NativeModules, NativeEventEmitter } from 'react-native';
import { parseBankSMS, saveTransaction } from './sms';

let smsListener: any = null;

export async function requestSMSPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    ]);

    return (
      granted['android.permission.READ_SMS'] === PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.RECEIVE_SMS'] === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch (error) {
    console.error('Error requesting SMS permissions:', error);
    return false;
  }
}

export async function startSMSListener(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    console.log('SMS listener only works on Android');
    return false;
  }

  const hasPermission = await requestSMSPermissions();
  if (!hasPermission) {
    console.log('SMS permissions not granted');
    return false;
  }

  try {
    // For now, we'll use a placeholder
    // In production, you'd use react-native-android-sms-listener
    console.log('SMS listener would start here');
    
    // Example implementation:
    // const SmsListener = NativeModules.SmsListener;
    // const eventEmitter = new NativeEventEmitter(SmsListener);
    // 
    // smsListener = eventEmitter.addListener('onSMSReceived', (message) => {
    //   const { body, address } = message;
    //   const transaction = parseBankSMS(body, address);
    //   
    //   if (transaction) {
    //     saveTransaction(transaction);
    //   }
    // });
    //
    // SmsListener.startListening();

    return true;
  } catch (error) {
    console.error('Error starting SMS listener:', error);
    return false;
  }
}

export function stopSMSListener() {
  if (smsListener) {
    smsListener.remove();
    smsListener = null;
  }
}

// Read historical SMS
export async function readHistoricalSMS(daysBack: number = 30): Promise<number> {
  if (Platform.OS !== 'android') return 0;

  const hasPermission = await requestSMSPermissions();
  if (!hasPermission) return 0;

  try {
    // Placeholder for actual SMS reading
    // In production, you'd use react-native-get-sms-android
    console.log(`Would read SMS from last ${daysBack} days`);
    
    // Example:
    // const filter = {
    //   box: 'inbox',
    //   minDate: Date.now() - (daysBack * 24 * 60 * 60 * 1000),
    // };
    //
    // SmsAndroid.list(
    //   JSON.stringify(filter),
    //   (fail) => console.error('Failed to list SMS', fail),
    //   (count, smsList) => {
    //     const messages = JSON.parse(smsList);
    //     let processedCount = 0;
    //     
    //     messages.forEach((sms) => {
    //       const transaction = parseBankSMS(sms.body, sms.address);
    //       if (transaction) {
    //         saveTransaction(transaction);
    //         processedCount++;
    //       }
    //     });
    //     
    //     return processedCount;
    //   }
    // );

    return 0;
  } catch (error) {
    console.error('Error reading historical SMS:', error);
    return 0;
  }
}
