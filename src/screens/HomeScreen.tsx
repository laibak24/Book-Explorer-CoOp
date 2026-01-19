import { View, FlatList, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import FeaturedSection from "../components/FeaturedSection";
import CategoryChips from "../components/CategoryChips";
import BookDetailScreen from "./BookDetailScreen";
import { searchBooks, getTrendingBooks } from "../api/books";
import { Book } from "../types/book";

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

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
      setError("Type at least 3 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const results = await searchBooks(text);
      setBooks(results ?? []);
      if (!results || results.length === 0) {
        setError("No books found");
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

  const handleBookPress = (book: Book) => {
    setSelectedBook(book);
  };

  const handleBackFromDetail = () => {
    setSelectedBook(null);
  };

  // If a book is selected, show detail screen
  if (selectedBook) {
    return <BookDetailScreen book={selectedBook} onBack={handleBackFromDetail} />;
  }

  const showWelcomeScreen = query.length === 0 && books.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Minimal Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>Books</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>☰</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar value={query} onChange={handleSearch} />
      </View>

      {showWelcomeScreen ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <FeaturedSection books={trendingBooks} onBookPress={handleBookPress} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <CategoryChips onSelectCategory={handleCategorySelect} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Explore</Text>
            <TouchableOpacity 
              style={styles.exploreCard}
              onPress={() => handleSearch("bestseller")}
            >
              <View>
                <Text style={styles.exploreTitle}>Bestsellers</Text>
                <Text style={styles.exploreSubtitle}>Popular books right now</Text>
              </View>
              <Text style={styles.exploreArrow}>→</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.exploreCard}
              onPress={() => handleSearch("new releases")}
            >
              <View>
                <Text style={styles.exploreTitle}>New Releases</Text>
                <Text style={styles.exploreSubtitle}>Latest publications</Text>
              </View>
              <Text style={styles.exploreArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.resultsContainer}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToHome}
            activeOpacity={0.7}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          )}

          {!loading && books.length > 0 && (
            <>
              <Text style={styles.resultsCount}>
                {books.length} {books.length === 1 ? 'result' : 'results'}
              </Text>
              <FlatList
                data={books}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={({ item }) => (
                  <BookCard book={item} onPress={handleBookPress} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            </>
          )}

          {!loading && !error && books.length === 0 && query.length >= 3 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📚</Text>
              <Text style={styles.emptyText}>No results found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
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
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  logo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.8,
  },
  headerRight: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
    color: "#000",
  },
  searchWrapper: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: "#ffffff",
  },
  content: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  exploreCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: "#fafafa",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  exploreTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  exploreSubtitle: {
    fontSize: 13,
    color: "#666",
    fontWeight: "400",
  },
  exploreArrow: {
    fontSize: 24,
    color: "#000",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
  },
  backButton: {
    paddingVertical: 12,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    letterSpacing: -0.2,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 40,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: "#fff5f5",
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#fee",
  },
  errorText: {
    color: "#c53030",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
});