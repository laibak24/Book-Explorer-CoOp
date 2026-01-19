const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const searchBooks = async (query: string) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${query}`);
    if (!response.ok) throw new Error("Failed to fetch books");
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    throw error;
  }
};
