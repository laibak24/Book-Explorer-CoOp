import { Review } from "../types/reviews";

const NYTIMES_API_KEY = "NYROpjoxRBGZeAGG9khSvz7Z0pnGpHjFACShCUMNsF6ncsNU"; // Your API key
const NYTIMES_BASE_URL = "https://api.nytimes.com/svc/books/v3";

/**
 * Fetch NYTimes reviews for a given book title (and optional author).
 * Returns up to 5 reviews. Handles missing or non-JSON responses gracefully.
 */
export async function getNYTimesReviews(
  title: string,
  author?: string
): Promise<Review[]> {
  try {
    if (!title) return [];

    const cleanTitle = encodeURIComponent(title.trim());
    let url = `${NYTIMES_BASE_URL}/reviews.json?title=${cleanTitle}&api-key=${NYTIMES_API_KEY}`;

    if (author) {
      const cleanAuthor = encodeURIComponent(author.trim());
      url += `&author=${cleanAuthor}`;
    }

    const response = await fetch(url);

    // Read the response as text first
    const text = await response.text();

    // Try parsing JSON, otherwise log the raw response
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("NYTimes API returned non-JSON:", text);
      return [];
    }

    console.log("NYTimes API data:", data); // Debug

    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results.slice(0, 5).map((r: any) => ({
        book_title: r.book_title || title,
        book_author: r.book_author || author || "Unknown",
        summary: r.summary || r.url || "No summary available",
        url: r.url || "",
        isbn13: r.isbn13 || [],
        bestsellers_date: r.bestsellers_date || null,
        publication_dt: r.publication_dt || null,
        byline: r.byline || null,
        uuid: r.uuid || null,
        uri: r.uri || null,
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching NYTimes reviews:", error);
    return [];
  }
}

/**
 * Optional: fetch bestseller list reviews
 */
export async function getBestsellerReviews(): Promise<Review[]> {
  try {
    const url = `${NYTIMES_BASE_URL}/lists/current/hardcover-fiction.json?api-key=${NYTIMES_API_KEY}`;
    const response = await fetch(url);

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("NYTimes Bestseller API returned non-JSON:", text);
      return [];
    }

    if (data.status === "OK" && data.results?.books) {
      return data.results.books.map((book: any) => ({
        url: book.amazon_product_url || "",
        book_title: book.title,
        book_author: book.author,
        summary: book.description || "No description available",
        bestsellers_date: data.results.bestsellers_date,
        isbn13: [book.primary_isbn13],
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching bestseller reviews:", error);
    return [];
  }
}
