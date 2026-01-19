import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Book } from "../types/Book";

interface Props {
  books: Book[];
}

export default function FeaturedSection({ books }: Props) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Trending This Week</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All →</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.slice(0, 5).map((book, index) => {
          const info = book.volumeInfo;
          const thumbnail = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail;
          
          return (
            <TouchableOpacity key={book.id || index} style={styles.card}>
              <View style={styles.cardContent}>
                {thumbnail ? (
                  <Image 
                    source={{ uri: thumbnail.replace('http://', 'https://') }}
                    style={styles.cover}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderCover}>
                    <Text style={styles.placeholderText}>📖</Text>
                  </View>
                )}
                <View style={styles.info}>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {info?.title || "Unknown Title"}
                  </Text>
                  <Text style={styles.author} numberOfLines={1}>
                    {info?.authors?.[0] || "Unknown Author"}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.star}>⭐</Text>
                    <Text style={styles.rating}>
                      {info?.averageRating || "N/A"}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3748",
  },
  viewAll: {
    fontSize: 14,
    color: "#667eea",
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  card: {
    width: 160,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  cover: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  placeholderCover: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
  },
  info: {
    marginTop: 10,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: "#718096",
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    fontSize: 14,
    marginRight: 4,
  },
  rating: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2d3748",
  },
});