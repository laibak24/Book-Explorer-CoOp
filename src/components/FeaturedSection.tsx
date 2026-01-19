import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Book } from "../types/Book";

interface Props {
  books: Book[];
  onBookPress?: (book: Book) => void;
}

export default function FeaturedSection({ books, onBookPress }: Props) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Featured</Text>
        <Text style={styles.subtitle}>Trending books this week</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.slice(0, 6).map((book, index) => {
          const info = book.volumeInfo;
          const thumbnail = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail;
          
          return (
            <TouchableOpacity 
              key={book.id || index} 
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => onBookPress?.(book)}
            >
              <View style={styles.coverContainer}>
                {thumbnail ? (
                  <Image 
                    source={{ uri: thumbnail.replace('http://', 'https://') }}
                    style={styles.cover}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderCover}>
                    <Text style={styles.placeholderEmoji}>📚</Text>
                  </View>
                )}
                {info?.averageRating && (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>⭐ {info.averageRating.toFixed(1)}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.bookTitle} numberOfLines={2}>
                {info?.title || "Unknown Title"}
              </Text>
              <Text style={styles.author} numberOfLines={1}>
                {info?.authors?.[0] || "Unknown"}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 16,
  },
  card: {
    width: 130,
  },
  coverContainer: {
    position: "relative",
    marginBottom: 12,
  },
  cover: {
    width: 130,
    height: 195,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  placeholderCover: {
    width: 130,
    height: 195,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 40,
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.3,
  },
  author: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
});