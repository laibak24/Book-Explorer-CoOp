import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";

interface Props {
  onSelectCategory: (category: string) => void;
}

const categories = [
  { name: "Fiction", emoji: "📚", query: "fiction" },
  { name: "Science", emoji: "🔬", query: "science" },
  { name: "Biography", emoji: "👤", query: "biography" },
  { name: "Mystery", emoji: "🔍", query: "mystery" },
  { name: "Romance", emoji: "💕", query: "romance" },
  { name: "Fantasy", emoji: "🐉", query: "fantasy" },
  { name: "History", emoji: "📜", query: "history" },
  { name: "Self-Help", emoji: "💪", query: "self help" },
];

export default function CategoryChips({ onSelectCategory }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handlePress = (category: typeof categories[0]) => {
    setSelectedCategory(category.name);
    onSelectCategory(category.query);
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
            <Text style={styles.emoji}>{category.emoji}</Text>
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
    paddingVertical: 5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chipSelected: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  emoji: {
    fontSize: 18,
    marginRight: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3748",
  },
  textSelected: {
    color: "#fff",
  },
});