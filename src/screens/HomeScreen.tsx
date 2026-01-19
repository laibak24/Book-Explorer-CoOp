import { View, FlatList, Text } from "react-native";
import { useState } from "react";
import SearchBar from "../components/SearchBar"; // ✅ default export
import BookCard from "../components/BookCard";   // ✅ default export
import { searchBooks } from "../api/books";      // ✅ named export

export default function HomeScreen() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < 3) {
      setBooks([]);
      setError("Type at least 3 characters");
      return;
    }

    try {
      const results = await searchBooks(text); // fetch from API
      setBooks(results ?? []);
      setError("");
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <SearchBar value={query} onChange={handleSearch} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookCard book={item} />}
        ListEmptyComponent={
          !error ? <Text>No results found</Text> : null
        }
      />
    </View>
  );
}
