import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { Review } from "../types/Review";

interface Props {
  reviews: Review[];
}

export default function RatingReviews({ reviews }: Props) {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No reviews available from NY Times</Text>
      </View>
    );
  }

  const openReviewLink = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      {reviews.map((review, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.reviewCard}
          onPress={() => openReviewLink(review.url)}
          activeOpacity={0.7}
        >
          <View style={styles.reviewHeader}>
            <View style={styles.sourceContainer}>
              <Text style={styles.sourceBadge}>NY TIMES</Text>
              {review.bestsellers_date && (
                <Text style={styles.bestsellerDate}>
                  Bestseller: {new Date(review.bestsellers_date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </Text>
              )}
            </View>
          </View>

          {review.book_title && (
            <Text style={styles.bookTitle} numberOfLines={2}>
              {review.book_title}
            </Text>
          )}

          {review.book_author && (
            <Text style={styles.author}>by {review.book_author}</Text>
          )}

          {review.summary && (
            <Text style={styles.summary} numberOfLines={4}>
              {review.summary}
            </Text>
          )}

          {review.byline && (
            <Text style={styles.byline}>— {review.byline}</Text>
          )}

          <View style={styles.footer}>
            <Text style={styles.readMore}>Read full review →</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    fontWeight: "500",
  },
  reviewCard: {
    backgroundColor: "#fafafa",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  sourceContainer: {
    gap: 8,
  },
  sourceBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 1,
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  bestsellerDate: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  author: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 12,
  },
  summary: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  byline: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
  },
  readMore: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    letterSpacing: -0.1,
  },
});