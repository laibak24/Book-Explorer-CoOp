import { View, FlatList, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from 'expo-linear-gradient';
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import FeaturedSection from "../components/FeaturedSection";
import CategoryChips from "../components/CategoryChips";
import { searchBooks, getTrendingBooks } from "../api/books";
import { Book } from "../types/Book";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load trending books on mount
  useEffect(() => {
    loadTrendingBooks();
  }, []);

  const loadTrendingBooks = async () => {
    try {
      const trending = await getTrendingBooks();
      setTrendingBooks(trending);
    } catch (err) {
      console.error("Failed to load trending books");
    }
  };

  const handleSearch = async (text: string) => {
    setQuery(text);
    
    if (text.length === 0) {
      setBooks([]);
      setError("");
      return;
    }

    if (text.length < 3) {
      setBooks([]);
      setError("Type at least 3 characters to search");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await searchBooks(text);
      setBooks(results ?? []);
      if (!results || results.length === 0) {
        setError("No books found. Try a different search.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setQuery("");
    setBooks([]);
    setError("");
    setSelectedCategory(null);
  };

  const handleCategorySelect = async (category: string) => {
    setSelectedCategory(category);
    setQuery(category);
    handleSearch(category);
  };

  // Show welcome screen if no search query
  const showWelcomeScreen = query.length === 0 && books.length === 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2', '#f093fb']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>📚 BookQuest</Text>
          <Text style={styles.subtitle}>Discover Your Next Great Read</Text>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <SearchBar value={query} onChange={handleSearch} />
      </View>

      {showWelcomeScreen ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Featured/Trending Section */}
          <FeaturedSection books={trendingBooks} />

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Browse by Category</Text>
            <CategoryChips onSelectCategory={handleCategorySelect} />
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>10M+</Text>
              <Text style={styles.statLabel}>Books</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>500K+</Text>
              <Text style={styles.statLabel}>Authors</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50M+</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Start</Text>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => handleSearch("bestseller")}
            >
              <Text style={styles.quickActionIcon}>🏆</Text>
              <View style={styles.quickActionText}>
                <Text style={styles.quickActionTitle}>Bestsellers</Text>
                <Text style={styles.quickActionSubtitle}>See what's trending now</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => handleSearch("new releases")}
            >
              <Text style={styles.quickActionIcon}>✨</Text>
              <View style={styles.quickActionText}>
                <Text style={styles.quickActionTitle}>New Releases</Text>
                <Text style={styles.quickActionSubtitle}>Fresh books just published</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToHome}
            activeOpacity={0.7}
          >
            <Text style={styles.backIcon}>←</Text>
            <Text style={styles.backText}>Back to Home</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#667eea" />
              <Text style={styles.loadingText}>Searching books...</Text>
            </View>
          )}

          {!loading && books.length > 0 && (
            <>
              <Text style={styles.resultsCount}>
                Found {books.length} {books.length === 1 ? 'book' : 'books'}
              </Text>
              <FlatList
                data={books}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => <BookCard book={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            </>
          )}

          {!loading && !error && books.length === 0 && query.length >= 3 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📚</Text>
              <Text style={styles.emptyText}>No books found</Text>
              <Text style={styles.emptySubtext}>Try searching with different keywords</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: "center",
  },
  appTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statCard: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#667eea",
  },
  statLabel: {
    fontSize: 14,
    color: "#718096",
    marginTop: 4,
  },
  quickAction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  quickActionText: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
  },
  quickActionSubtitle: {
    fontSize: 14,
    color: "#718096",
    marginTop: 2,
  },
  resultsContainer: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignSelf: "flex-start",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backIcon: {
    fontSize: 20,
    color: "#667eea",
    marginRight: 6,
  },
  backText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#667eea",
  },
  resultsCount: {
    fontSize: 16,
    color: "#718096",
    marginBottom: 15,
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: "#c53030",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#718096",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#718096",
  },
});