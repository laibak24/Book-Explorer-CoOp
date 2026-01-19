import { View, Text, Image, StyleSheet } from "react-native";
import { Book } from "../types/Book"; // make sure the filename is lowercase 'book.ts'

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const info = book.volumeInfo;

  return (
    <View style={styles.card}>
      {info.imageLinks?.thumbnail && (
        <Image
          source={{ uri: info.imageLinks.thumbnail }}
          style={styles.image}
        />
      )}
      <Text style={styles.title}>{info.title}</Text>
      <Text>{info.authors?.join(", ")}</Text>
      <Text>{info.publishedDate}</Text>
      <Text>⭐ {info.averageRating ?? "N/A"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  image: { height: 120, width: 80 },
  title: { fontWeight: "bold", marginTop: 5 },
});
