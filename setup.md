# Book Explorer App - Complete Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [API Configuration](#api-configuration)
4. [Running the Application](#running-the-application)
5. [Building APK](#building-apk)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v16.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn**: Comes with Node.js
- **Expo CLI**: Install globally
  ```bash
  npm install -g expo-cli
  ```
- **Git**: For cloning the repository

### For Android Development
- **Android Studio**: [Download](https://developer.android.com/studio)
- **Android SDK**: Install via Android Studio
- **Android Emulator** or **Physical Android Device**

### For iOS Development (macOS only)
- **Xcode**: Latest version from Mac App Store
- **CocoaPods**: Install via Homebrew
  ```bash
  brew install cocoapods
  ```

---

## Installation Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/laibak24/Book-Explorer-CoOp.git
cd Book-Explorer-CoOp
```

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Verify Installation
```bash
# Check if all packages are installed
npm list --depth=0
```

---

## API Configuration

### Get API Keys

#### Google Books API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Books API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

#### NY Times Books API
1. Go to [NY Times Developer Portal](https://developer.nytimes.com/)
2. Register for a free account
3. Create an app
4. Enable **Books API**
5. Copy your API key

### Configure API Keys

#### Option 1: Environment Variables (Recommended)
Create a `.env` file in the project root:
```env
GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
NYTIMES_API_KEY=your_nytimes_api_key_here
```

Install dotenv:
```bash
npm install dotenv
```

#### Option 2: Direct Configuration
Edit `api/nytimes.ts`:
```typescript
const NYTIMES_API_KEY = "YOUR_NYTIMES_API_KEY";
```

Edit `api/books.ts` if Google Books API key is required (currently using public access).

---

## Running the Application

### Start Development Server
```bash
# Start Expo Metro bundler
npm start

# Or
expo start
```

This will open Expo DevTools in your browser at `http://localhost:19002`

### Run on Android Emulator

#### Start Android Emulator
1. Open Android Studio
2. Go to **AVD Manager**
3. Create/Start an emulator (Recommended: Pixel 5, API 31+)

#### Launch App
```bash
# Press 'a' in terminal after running npm start
# Or
npm run android
```

### Run on Physical Android Device

1. Enable **Developer Options** on your phone:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   
2. Enable **USB Debugging**:
   - Settings → Developer Options → USB Debugging

3. Connect via USB or use Expo Go app:
   ```bash
   # For USB connection
   npm run android
   
   # For Expo Go app
   # Scan QR code from Expo DevTools
   ```

### Run on iOS (macOS only)
```bash
# Press 'i' in terminal after running npm start
# Or
npm run ios
```

---

## Building APK

### Method 1: Expo Build (Classic)
```bash
# Build APK
expo build:android -t apk

# Follow prompts:
# - Choose "Build for Android"
# - Select "APK" type
# - Wait for build to complete
# - Download from provided link
```

### Method 2: EAS Build (Recommended)

#### Setup EAS
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

#### Create `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

#### Build APK
```bash
# Preview build (APK)
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production
```

### Download and Install APK
1. Build completes → Download link provided
2. Transfer APK to Android device
3. Enable "Install from Unknown Sources"
4. Install APK

---

## Testing

### Run Unit Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
Current test files:
- `__tests__/BookCard.test.tsx`
- `__tests__/SearchBar.test.tsx`
- `__tests__/FeaturedSection.test.tsx`

### Manual Testing Checklist
- [ ] Search functionality works
- [ ] Book details display correctly
- [ ] NY Times reviews load
- [ ] Categories filter books
- [ ] Error states display properly
- [ ] Loading indicators appear
- [ ] Images load correctly
- [ ] Navigation works smoothly

---

## Troubleshooting

### Common Issues

#### 1. Module Not Found Errors
```bash
# Clear cache and reinstall
expo start -c
rm -rf node_modules
npm install
```

#### 2. Android Build Fails
```bash
# Update Gradle wrapper
cd android
./gradlew wrapper --gradle-version=7.5

# Clean build
./gradlew clean
```

#### 3. Metro Bundler Issues
```bash
# Reset Metro cache
npx react-native start --reset-cache
```

#### 4. API Key Errors
- Verify API keys are correct
- Check API quotas in dashboards
- Ensure APIs are enabled in Google Cloud Console

#### 5. Expo Go Connection Issues
- Ensure phone and computer on same WiFi
- Disable VPN
- Use tunnel mode: `expo start --tunnel`

#### 6. iOS Build Issues (macOS)
```bash
# Install pods
cd ios
pod install
cd ..

# Clean build
cd ios
xcodebuild clean
cd ..
```

### Get Help
- Expo Documentation: https://docs.expo.dev/
- Stack Overflow: Tag with `react-native` and `expo`
- GitHub Issues: Create issue in repository

---

## Project Structure Reference
```
book-explorer-app/
├── components/         # Reusable UI components
├── screens/           # Screen components
├── api/              # API integration
├── types/            # TypeScript types
├── __tests__/        # Unit tests
├── assets/           # Images, fonts
├── App.tsx           # Root component
├── package.json      # Dependencies
└── README.md         # Project documentation
```

---

## Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Configure API keys
# Create .env or edit api/nytimes.ts

# 3. Start development
npm start

# 4. Run on Android
npm run android

# 5. Run tests
npm test

# 6. Build APK
eas build --platform android --profile preview
```


