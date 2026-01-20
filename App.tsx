import { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleContinue = () => {
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={handleContinue} />;
  }

  return <HomeScreen />;
}