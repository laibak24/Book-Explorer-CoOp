import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Book } from "../types/Book";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const info = book.volumeInfo;
  const thumbnail = info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail;
  const rating = info?.averageRating;
  const ratingCount = info?.ratingsCount;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.content}>
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail.replace('http://', 'https://') }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="book" size={40} color="#a0aec0" />
          </View>
        )}
        
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {info?.title || "Unknown Title"}
          </Text>
          
          <Text style={styles.author} numberOfLines={1}>
            {info?.authors?.join(", ") || "Unknown Author"}
          </Text>
          
          <View style={styles.metaContainer}>
            <Text style={styles.year}>
              {info?.publishedDate?.split("-")[0] || "N/A"}
            </Text>
            {info?.pageCount && (
              <>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.pages}>{info.pageCount} pages</Text>
              </>
            )}
          </View>

          <View style={styles.ratingContainer}>
            {rating ? (
              <>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.rating}>{rating.toFixed(1)}</Text>
                {ratingCount && (
                  <Text style={styles.ratingCount}>({ratingCount.toLocaleString()})</Text>
                )}
              </>
            ) : (
              <>
                <Ionicons name="star-outline" size={16} color="#cbd5e0" />
                <Text style={styles.noRating}>No ratings yet</Text>
              </>
            )}
          </View>

          {info?.categories && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {info.categories[0]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    flexDirection: "row",
    padding: 15,
  },
  image: {
    width: 90,
    height: 130,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    width: 90,
    height: 130,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 6,
    lineHeight: 22,
  },
  author: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 8,
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  year: {
    fontSize: 13,
    color: "#a0aec0",
  },
  separator: {
    marginHorizontal: 6,
    color: "#cbd5e0",
  },
  pages: {
    fontSize: 13,
    color: "#a0aec0",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2d3748",
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 13,
    color: "#a0aec0",
    marginLeft: 4,
  },
  noRating: {
    fontSize: 13,
    color: "#cbd5e0",
    marginLeft: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#edf2f7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: "#4a5568",
    fontWeight: "600",
  },
});