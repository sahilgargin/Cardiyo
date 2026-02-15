// Development-only OTP service
// In production, replace with real Twilio implementation

const otpStore: { [phoneNumber: string]: string } = {};

export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP
    otpStore[phoneNumber] = otp;

    // Log OTP to console for development
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📱 DEVELOPMENT OTP');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Phone:', phoneNumber);
    console.log('Code: ', otp);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    return { success: true };
  } catch (error: any) {
    console.error('OTP generation error:', error);
    return { 
      success: false, 
      error: 'Failed to generate OTP' 
    };
  }
}

export async function verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const storedOTP = otpStore[phoneNumber];
    
    console.log('Verifying OTP:', { phoneNumber, code, storedOTP });
    
    if (!storedOTP) {
      return { success: false, error: 'No OTP found. Please request a new code.' };
    }

    if (storedOTP === code) {
      // Clear OTP after successful verification
      delete otpStore[phoneNumber];
      console.log('✅ OTP verified successfully');
      return { success: true };
    } else {
      console.log('❌ Invalid OTP');
      return { success: false, error: 'Invalid verification code' };
    }
  } catch (error: any) {
    console.error('OTP verify error:', error);
    return { 
      success: false, 
      error: 'Failed to verify OTP' 
    };
  }
}
