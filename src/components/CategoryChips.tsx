import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";

interface Props {
  onSelectCategory: (category: string) => void;
}

const categories = [
  { name: "Fiction", query: "fiction" },
  { name: "Science", query: "science" },
  { name: "Biography", query: "biography" },
  { name: "Mystery", query: "mystery" },
  { name: "Romance", query: "romance" },
  { name: "Fantasy", query: "fantasy" },
  { name: "History", query: "history" },
  { name: "Self-Help", query: "self help" },
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
    gap: 8,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 20,
  },
  chipSelected: {
    backgroundColor: "#000",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    letterSpacing: -0.2,
  },
  textSelected: {
    color: "#fff",
  },
});