// Development-only OTP service

function normalizePhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/\s/g, '').replace(/^\+?/, '+');
}

export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; otp?: string; error?: string }> {
  try {
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 DEVELOPMENT OTP');
    console.log('Phone:', normalizedPhone);
    console.log('Code: ', otp);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { success: true, otp };
  } catch (error: any) {
    return { 
      success: false, 
      error: 'Failed to generate OTP' 
    };
  }
}
