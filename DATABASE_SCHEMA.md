# Cardiyo Database Schema

## Collections Currently Seeded

### 1. `/branding` (App-wide settings)
- **app** - Colors, gradients, theme
- **categories/items/{categoryId}** - 6 categories with emojis and gradients
  - dining, shopping, entertainment, travel, wellness, fuel

### 2. `/banks` (Bank information)
**UAE Banks:**
- emirates-nbd (Emirates NBD)
- adcb (ADCB)
- mashreq (Mashreq Bank)
- fab (First Abu Dhabi Bank)
- rakbank (RAKBANK)

**Saudi Banks:**
- alrajhi (Al Rajhi Bank)
- sab (Saudi Awwal Bank)
- alinma (Alinma Bank)
- riyad (Riyad Bank)

**Fields:** id, name, logo, country (AE/SA)

### 3. `/cards` (Credit card products)
- 9 cards across 3 UAE banks
- Each with: name, type, bankId, benefits[], annualFee, rewardRate, network

### 4. `/branding/cards/items/{cardId}` (Card visual designs)
- Unique gradients for each card
- Chip colors, text colors, network logos
- Pattern types (geometric, waves, dots, etc.)

### 5. `/offers` (Merchant offers)
- 6+ sample offers
- Fields: title, description, discount, category, type (nearby/online), merchantName, cardId, location, latitude, longitude

### 6. `/users/{userId}` (User profiles)
**User document:**
- firstName, lastName, email, phoneNumber
- country (AE/SA)
- displayName, createdAt, updatedAt

**Subcollection: `/users/{userId}/cards`**
- User's added cards
- Fields: bankId, cardId, lastFourDigits, addedAt

## Data NOT in Database (Client-Side Only)

### Areas (130+ locations)
**Location:** `services/areas.ts`
**Why client-side:** Static geographic data, faster lookups, no updates needed

**Coverage:**
- Dubai: 50+ areas (Downtown, Marina, JBR, JLT, DSO, International City, Liwan, etc.)
- Abu Dhabi: 10+ areas (Corniche, Saadiyat, Yas Island, Al Reem, etc.)
- Sharjah: 3 areas
- Ajman: 2 areas
- RAK: 2 areas
- KSA: Riyadh (3), Jeddah (2)

## Seed Command
```bash
npm run seed
```

**Order of execution:**
1. seedBranding() - App settings, categories, banks
2. seedCards() - Credit card products
3. updateCardBranding() - Card visual designs
4. seedOffers() - Sample offers

## Firestore Rules Required
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read-only data
    match /branding/{document=**} {
      allow read: if true;
      allow write: if false;
    }
    
    match /banks/{bankId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /cards/{cardId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /offers/{offerId} {
      allow read: if true;
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

## What's Working

✅ App branding with dynamic colors
✅ 6 categories with emojis and gradients
✅ 9 banks (5 UAE + 4 Saudi) with country filtering
✅ 9 credit cards with full details
✅ Card visual designs (gradients, chips, logos)
✅ Sample offers with location data
✅ User authentication (phone OTP)
✅ User profile storage with country selection
✅ User card management
✅ Area-based location detection (130+ areas)
✅ Country-specific bank filtering

## Future Enhancements

Consider adding to database:
- [ ] Area-specific offers (filter by area)
- [ ] Merchant locations with area tags
- [ ] User preferences (language, notifications)
- [ ] Rewards tracking
- [ ] Offer redemption history
- [ ] Push notification tokens
