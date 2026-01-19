const BASE_URL = "https://www.googleapis.com/books/v1/volumes";

export const searchBooks = async (query: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${encodeURIComponent(query)}&maxResults=20&orderBy=relevance`
    );
    if (!response.ok) throw new Error("Failed to fetch books");
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

export const getTrendingBooks = async () => {
  try {
    // Fetch popular/trending books using relevant search terms
    const queries = ["bestseller", "popular fiction", "award winning"];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    
    const response = await fetch(
      `${BASE_URL}?q=${randomQuery}&maxResults=10&orderBy=relevance`
    );
    if (!response.ok) throw new Error("Failed to fetch trending books");
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Trending books error:", error);
    return [];
  }
};

export const getBooksByCategory = async (category: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=subject:${encodeURIComponent(category)}&maxResults=20&orderBy=relevance`
    );
    if (!response.ok) throw new Error("Failed to fetch books by category");
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Category search error:", error);
    throw error;
  }
};

export const getBookDetails = async (bookId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/${bookId}`);
    if (!response.ok) throw new Error("Failed to fetch book details");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Book details error:", error);
    throw error;
  }
};