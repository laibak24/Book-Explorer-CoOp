import { View, Text, StyleSheet, TouchableOpacity, Animated, StatusBar } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onContinue: () => void;
}

export default function WelcomeScreen({ onContinue }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate logo
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Animate text
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="book" size={80} color="#fff" />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>Book Explorer</Text>
          <Text style={styles.subtitle}>Discover Your Next Great Read</Text>
        </Animated.View>
      </View>

      {/* Features */}
      <Animated.View
        style={[
          styles.featuresContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.featureRow}>
          <Ionicons name="search" size={24} color="#fff" />
          <Text style={styles.featureText}>Search millions of books</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="star" size={24} color="#fff" />
          <Text style={styles.featureText}>Read reviews & ratings</Text>
        </View>
        <View style={styles.featureRow}>
          <Ionicons name="trending-up" size={24} color="#fff" />
          <Text style={styles.featureText}>Discover trending titles</Text>
        </View>
      </Animated.View>

      {/* CTA Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={onContinue}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>
      </Animated.View>

      {/* Footer */}
      <Animated.View
        style={[
          styles.footer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  logoSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  featuresContainer: {
    paddingHorizontal: 40,
    gap: 20,
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.3,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: "500",
  },
});