import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, StatusBar, Linking } from "react-native";
import { useState, useEffect } from "react";
import { Book } from "../types/book";
import { getNYTimesReviews, NYTimesError } from "../api/nytimes";
import { Review } from "../types/reviews";
import RatingReviews from "../components/RatingReviews";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  book: Book;
  onBack: () => void;
}

export default function BookDetailScreen({ book, onBack }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState<NYTimesError | null>(null);
  
  const info = book.volumeInfo;
  const thumbnail = info?.imageLinks?.large || info?.imageLinks?.medium || 
                   info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail;
  const rating = info?.averageRating;
  const ratingCount = info?.ratingsCount;

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      setReviewError(null);
      
      const bookTitle = info?.title || "";
      const author = info?.authors?.[0] || "";
      
      if (!bookTitle) {
        setReviewError({
          message: "Book title not available",
          type: 'invalid_key'
        });
        setLoadingReviews(false);
        return;
      }

      const { reviews: reviewData, error } = await getNYTimesReviews(bookTitle, author);
      
      if (error) {
        setReviewError(error);
        setReviews([]);
      } else {
        setReviews(reviewData);
        setReviewError(null);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
      setReviewError({
        message: "An unexpected error occurred while loading reviews.",
        type: 'unknown'
      });
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  const openPreview = () => {
    if (info?.previewLink) {
      Linking.openURL(info.previewLink);
    }
  };

  const handleRetryReviews = () => {
    loadReviews();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Book Cover & Basic Info */}
        <View style={styles.heroSection}>
          <View style={styles.coverContainer}>
            {thumbnail ? (
              <Image
                source={{ uri: thumbnail.replace('http://', 'https://') }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderCover}>
                <Text style={styles.placeholderEmoji}>📚</Text>
              </View>
            )}
          </View>

          <Text style={styles.title}>{info?.title || "Unknown Title"}</Text>
          
          <Text style={styles.authors}>
            {info?.authors?.join(", ") || "Unknown Author"}
          </Text>

          {/* Rating Section */}
          {rating && (
            <View style={styles.ratingSection}>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingStar}>⭐</Text>
                <Text style={styles.ratingNumber}>{rating.toFixed(1)}</Text>
              </View>
              {ratingCount && (
                <Text style={styles.ratingCount}>
                  {ratingCount.toLocaleString()} ratings
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Book Details */}
        <View style={styles.detailsSection}>
          {info?.publishedDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Published</Text>
              <Text style={styles.detailValue}>
                {new Date(info.publishedDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}

          {info?.publisher && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Publisher</Text>
              <Text style={styles.detailValue}>{info.publisher}</Text>
            </View>
          )}

          {info?.pageCount && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pages</Text>
              <Text style={styles.detailValue}>{info.pageCount}</Text>
            </View>
          )}

          {info?.language && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Language</Text>
              <Text style={styles.detailValue}>{info.language.toUpperCase()}</Text>
            </View>
          )}

          {info?.categories && info.categories.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Categories</Text>
              <View style={styles.categoriesContainer}>
                {info.categories.map((cat, idx) => (
                  <View key={idx} style={styles.categoryChip}>
                    <Text style={styles.categoryText}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Description */}
        {info?.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About this book</Text>
            <Text style={styles.description}>{info.description}</Text>
          </View>
        )}

        {/* NYTimes Reviews */}
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>NY Times Reviews</Text>
          
          {loadingReviews && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Loading reviews...</Text>
            </View>
          )}

          {!loadingReviews && reviewError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorEmoji}>
                {reviewError.type === 'network' ? '📡' : 
                 reviewError.type === 'not_found' ? '🔍' : 
                 reviewError.type === 'rate_limit' ? '⏱️' : '⚠️'}
              </Text>
              <Text style={styles.errorTitle}>
                {reviewError.type === 'network' ? 'Connection Issue' :
                 reviewError.type === 'not_found' ? 'No Reviews Found' :
                 reviewError.type === 'rate_limit' ? 'Rate Limit Reached' :
                 reviewError.type === 'invalid_key' ? 'Configuration Error' :
                 'Something Went Wrong'}
              </Text>
              <Text style={styles.errorMessage}>{reviewError.message}</Text>
              {reviewError.type !== 'not_found' && (
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={handleRetryReviews}
                  activeOpacity={0.7}
                >
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {!loadingReviews && !reviewError && (
            <RatingReviews reviews={reviews} />
          )}
        </View>

        {/* Preview Button */}
        {info?.previewLink && (
          <TouchableOpacity style={styles.previewButton} onPress={openPreview}>
            <Text style={styles.previewButtonText}>Preview on Google Books</Text>
            
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 28,
    color: "#000",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    letterSpacing: -0.3,
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  coverContainer: {
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  coverImage: {
    width: 180,
    height: 270,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
  },
  placeholderCover: {
    width: 180,
    height: 270,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderEmoji: {
    fontSize: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  authors: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "500",
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5e6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  ratingStar: {
    fontSize: 18,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff9500",
  },
  ratingCount: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  detailsSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: "#fafafa",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  categoriesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "flex-end",
  },
  categoryChip: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  descriptionSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  reviewsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  errorContainer: {
    backgroundColor: "#fefefe",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fee",
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#000",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: -0.2,
  },
  previewButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: "#000",
    borderRadius: 16,
    marginBottom: 24,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: -0.2,
  },
  previewArrow: {
    fontSize: 20,
    color: "#fff",
  },
  bottomSpacer: {
    height: 40,
  },
});