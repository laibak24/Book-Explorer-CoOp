import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Book } from "../types/Book";

interface Props {
  book: Book;
  onPress: (book: Book) => void;
}

export default function BookCard({ book, onPress }: Props) {
  const info = book.volumeInfo;
  const thumbnail = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail;
  const rating = info?.averageRating;

  return (
    <TouchableOpacity 
      style={styles.card} 
      activeOpacity={0.7}
      onPress={() => onPress(book)}
    >
      <View style={styles.imageContainer}>
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail.replace('http://', 'https://') }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>📚</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {info?.title || "Unknown Title"}
        </Text>
        
        <Text style={styles.author} numberOfLines={1}>
          {info?.authors?.join(", ") || "Unknown Author"}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.year}>
            {info?.publishedDate?.split("-")[0] || "—"}
          </Text>
          
          {rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingStar}>⭐</Text>
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.arrow}>
          <Text style={styles.arrowText}>→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  placeholderImage: {
    width: 90,
    height: 130,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 32,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    lineHeight: 23,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  author: {
    fontSize: 14,
    color: "#666",
    fontWeight: "400",
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  year: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5e6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingStar: {
    fontSize: 12,
  },
  rating: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ff9500",
  },
  arrow: {
    position: "absolute",
    right: 8,
    top: "50%",
    marginTop: -12,
  },
  arrowText: {
    fontSize: 20,
    color: "#e0e0e0",
  },
});