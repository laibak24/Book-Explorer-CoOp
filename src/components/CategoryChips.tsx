import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  onSelectCategory: (category: string) => void;
}

// Updated with proper subject queries for Google Books API
const categories = [
  { 
    name: "Fiction", 
    query: "subject:fiction",
    icon: "book-outline" as const
  },
  { 
    name: "Science", 
    query: "subject:science",
    icon: "flask-outline" as const
  },
  { 
    name: "Biography", 
    query: "subject:biography",
    icon: "person-outline" as const
  },
  { 
    name: "Mystery", 
    query: "subject:mystery",
    icon: "eye-outline" as const
  },
  { 
    name: "Romance", 
    query: "subject:romance",
    icon: "heart-outline" as const
  },
  { 
    name: "Fantasy", 
    query: "subject:fantasy",
    icon: "planet-outline" as const
  },
  { 
    name: "History", 
    query: "subject:history",
    icon: "time-outline" as const
  },
  { 
    name: "Self-Help", 
    query: "subject:self-help",
    icon: "bulb-outline" as const
  },
  { 
    name: "Cooking", 
    query: "subject:cooking",
    icon: "restaurant-outline" as const
  },
  { 
    name: "Travel", 
    query: "subject:travel",
    icon: "airplane-outline" as const
  },
];

export default function CategoryChips({ onSelectCategory }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePress = (category: typeof categories[0]) => {
    setSelectedCategory(category.name);
    onSelectCategory(category.query); // Pass the proper subject query
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.name;
        return (
          <TouchableOpacity
            key={category.name}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => handlePress(category)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={isSelected ? "#fff" : "#000"} 
              style={styles.icon}
            />
            <Text style={[styles.text, isSelected && styles.textSelected]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingRight: 24, // Extra padding for scroll
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  chipSelected: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    letterSpacing: -0.2,
  },
  textSelected: {
    color: "#fff",
  },
});