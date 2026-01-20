# Book Explorer App

A modern React Native mobile application for exploring books, ratings, and reviews. Built with TypeScript, Expo, and integrates with Google Books API and NY Times Books API.

## Features

✨ **Book Search**: Search for books by title, author, or ISBN  
📚 **Featured Books**: Browse trending and popular books  
🏷️ **Categories**: Explore books by genre  
⭐ **Ratings & Reviews**: View Google Books ratings and NY Times reviews  
📖 **Detailed View**: Click on any book to see comprehensive details  
🎨 **Modern UI**: Clean, minimalist design with smooth interactions  

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Google Books API** for book information
- **NY Times Books API** for reviews
- **Jest & React Native Testing Library** for unit tests

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## Installation

1. **Clone the repository**
```bash
git clone https://github.com/laibak24/Book-Explorer-CoOp.git
cd book-explorer-app
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up API Keys**

Get your API keys:
- Google Books API: https://developers.google.com/books/docs/v1/using
- NY Times Books API: https://developer.nytimes.com/

Create a `.env` file in the root directory:
```env
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
NYTIMES_API_KEY=your_nytimes_api_key
```

Update the API key in `api/nytimes.ts`:
```typescript
const NYTIMES_API_KEY = "YOUR_NYTIMES_API_KEY";
```

## Running the App

### Development Mode

```bash
# Start Expo development server
npm start
# or
expo start
```

### Run on Android
```bash
npm run android
# or
expo start --android
```

### Run on iOS (macOS only)
```bash
npm run ios
# or
expo start --ios
```

## Testing

Run unit tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Building APK

### Development Build
```bash
expo build:android
```

### Production Build
```bash
eas build --platform android
```

Follow the Expo/EAS Build documentation for detailed instructions:
https://docs.expo.dev/build/setup/

## Project Structure

```
book-explorer-app/
├── components/
│   ├── BookCard.tsx          # Book list item component
│   ├── CategoryChips.tsx     # Genre category chips
│   ├── FeaturedSection.tsx   # Featured books section
│   ├── RatingReviews.tsx     # NY Times reviews component
│   └── SearchBar.tsx         # Search input component
├── screens/
│   ├── HomeScreen.tsx        # Main home screen
│   └── BookDetailScreen.tsx  # Book detail screen
├── api/
│   ├── books.ts             # Google Books API integration
│   └── nytimes.ts           # NY Times API integration
├── types/
│   ├── Book.ts              # Book type definitions
│   └── Review.ts            # Review type definitions
├── __tests__/
│   ├── BookCard.test.tsx
│   ├── SearchBar.test.tsx
│   └── FeaturedSection.test.tsx
├── App.tsx
├── jest.config.js
├── jest.setup.js
└── package.json
```

## Key Components

### HomeScreen
Main screen with search functionality, featured books, categories, and search results.

### BookDetailScreen
Detailed view showing book information, ratings, reviews, and a preview link.

### BookCard
Reusable card component displaying book information in lists.

### RatingReviews
Component that fetches and displays NY Times book reviews.

## API Integration

### Google Books API
- Fetches book information including title, author, cover, ratings
- Supports search by title, author, ISBN
- Rate limit: 1000 requests per day (free tier)

### NY Times Books API
- Fetches professional book reviews
- Provides bestseller information
- Rate limit: 500 requests per day (free tier)

## Error Handling

The app implements comprehensive error handling:
- Network errors with user-friendly messages
- Missing data gracefully handled with fallbacks
- Loading states for async operations
- Empty states for no results

## Testing Coverage

Unit tests cover:
- Component rendering
- User interactions
- Error states
- Edge cases (missing data, empty arrays)
- API integration (mocked)

## Performance Optimizations

- Image caching with React Native's Image component
- FlatList for efficient list rendering
- Debounced search to reduce API calls
- Lazy loading of reviews

## Known Limitations

- Free tier API rate limits apply
- NY Times reviews may not be available for all books
- Preview links require external browser

## Future Enhancements

- [ ] Add favorites/bookmarks functionality
- [ ] Implement user authentication
- [ ] Add reading list feature
- [ ] Support offline mode
- [ ] Add book recommendations
- [ ] Implement barcode scanner for ISBN lookup

## Troubleshooting

### Common Issues

**API Key Errors**: Ensure your API keys are correctly set in the configuration files.

**Build Errors**: Clear cache and reinstall:
```bash
expo start -c
rm -rf node_modules
npm install
```

**Android Build Issues**: Ensure Android Studio and SDK are properly configured.
