import { TextInput, StyleSheet } from "react-native";

export default function SearchBar({ value, onChange }: any) {
  return (
    <TextInput
      placeholder="Search books or authors..."
      value={value}
      onChangeText={onChange}
      style={styles.input}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    marginBottom: 10,
  },
});
