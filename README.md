# Cardiyo - Smart Credit Card Rewards App

A React Native mobile application built with Expo that helps users maximize their credit card rewards through personalized offers and location-based deals.

## Features

- 🎨 **Dynamic Branding** - All UI elements, colors, and card designs loaded from Firebase
- 💳 **Digital Wallet** - Manage multiple credit cards with beautiful 3D card designs
- 🎁 **Personalized Offers** - Location-based and card-specific deals
- 📍 **Location Services** - Real-time nearby offers based on GPS
- 🔐 **Phone Authentication** - Secure login with OTP verification
- 🎯 **Category-Based Discovery** - Browse offers by dining, shopping, travel, etc.

## Tech Stack

- **Frontend**: React Native (Expo SDK 52)
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: React Native StyleSheet, Linear Gradients
- **Navigation**: Expo Router (file-based routing)
- **Location**: Expo Location
- **Authentication**: Firebase Auth + Twilio (SMS OTP)

## Prerequisites

- Node.js v20.x or higher
- npm or yarn
- Expo Go app on your mobile device
- Firebase project
- Twilio account (optional for production SMS)

## Installation

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd my-vibe-app
```

2. **Install dependencies**
```bash
   npm install --legacy-peer-deps
```

3. **Set up environment variables**
```bash
   cp .env.example .env
```
   Then fill in your Firebase and Twilio credentials in `.env`

4. **Seed the database**
```bash
   npm run seed
```

5. **Start the development server**
```bash
   npm start
```

6. **Run on your device**
   - Scan the QR code with Expo Go (Android)
   - Scan with Camera app (iOS)

## Project Structure
```
my-vibe-app/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home screen
│   │   ├── offers.tsx       # Offers screen
│   │   ├── wallet.tsx       # Wallet screen
│   │   └── profile.tsx      # Profile screen
│   ├── auth/                # Authentication screens
│   │   ├── welcome.tsx      # Phone login
│   │   └── verify-phone.tsx # OTP verification
│   ├── add-card/            # Add card flow
│   │   ├── select-bank.tsx  # Bank selection
│   │   └── select-card.tsx  # Card selection
│   └── _layout.tsx          # Root layout
├── services/                # Business logic
│   ├── branding.ts          # Branding service
│   ├── cards.ts             # Cards service
│   ├── offers.ts            # Offers service
│   ├── location.ts          # Location service
│   ├── auth.ts              # Auth service
│   └── twilio.ts            # Twilio OTP service
├── scripts/                 # Database seeding
│   ├── seedBranding.js      # Seed app branding
│   ├── seedCards.js         # Seed credit cards
│   ├── seedOffers.js        # Seed offers
│   └── runSeed.js           # Main seeding script
├── firebaseConfig.ts        # Firebase configuration
└── package.json             # Dependencies
```

## Database Schema

### Firestore Collections

#### `/branding`
- `app` - App-level branding (colors, gradients, tagline)
- `categories/items/{categoryId}` - Category branding (icons, colors)
- `cards/items/{cardId}` - Card visual designs (gradients, chip colors)
- `banks/{bankId}` - Bank information

#### `/cards`
- Card details (name, type, benefits, fees)

#### `/offers`
- Offer details (discount, merchant, location, category)

#### `/users/{userId}`
- User profile data
- `/cards/{cardId}` - User's added cards

## Available Scripts

- `npm start` - Start Expo development server
- `npm run seed` - Seed Firebase with initial data
- `npm run android` - Open on Android emulator
- `npm run ios` - Open on iOS simulator
- `npm run web` - Open in web browser

## Development Notes

### OTP Authentication (Development Mode)

The app currently uses a development OTP system. Check your terminal/console for the OTP code when testing authentication. The code will be printed like this:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 DEVELOPMENT OTP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phone: +971501234567
Code:  123456
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

For production, update `services/twilio.ts` with real Twilio Verify Service credentials.

### Firebase Rules

Make sure your Firestore rules are set correctly:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Branding - read-only
    match /branding/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    // Public data - read-only
    match /{collection}/{document} {
      allow read: if collection in ['banks', 'cards', 'offers'];
      allow write: if false;
    }
    
    // User data - authenticated only
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /cards/{cardId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Features Roadmap

- [x] Phone authentication with OTP
- [x] Dynamic branding system
- [x] Digital wallet with card management
- [x] Location-based offers
- [x] Category browsing
- [ ] Push notifications
- [ ] Card recommendations
- [ ] Spending analytics
- [ ] Offer redemption tracking
- [ ] Referral system

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@cardiyo.app or open an issue in the repository.
