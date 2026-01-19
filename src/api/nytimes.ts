import { Review } from "../types/reviews";

const NYTIMES_API_KEY = "NYROpjoxRBGZeAGG9khSvz7Z0pnGpHjFACShCUMNsF6ncsNU";
const NYTIMES_BASE_URL = "https://api.nytimes.com/svc/books/v3";

export interface NYTimesError {
  message: string;
  type: 'network' | 'api' | 'invalid_key' | 'rate_limit' | 'not_found' | 'unknown';
}

/**
 * Fetch NYTimes reviews for a given book title (and optional author).
 * Returns up to 5 reviews. Handles all error cases gracefully.
 */
export async function getNYTimesReviews(
  title: string,
  author?: string
): Promise<{ reviews: Review[]; error?: NYTimesError }> {
  try {
    if (!title || title.trim().length === 0) {
      return { 
        reviews: [], 
        error: { 
          message: "Book title is required", 
          type: 'invalid_key' 
        } 
      };
    }

    const cleanTitle = encodeURIComponent(title.trim());
    let url = `${NYTIMES_BASE_URL}/reviews.json?title=${cleanTitle}&api-key=${NYTIMES_API_KEY}`;

    if (author && author.trim().length > 0) {
      const cleanAuthor = encodeURIComponent(author.trim());
      url += `&author=${cleanAuthor}`;
    }

    const response = await fetch(url);

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 401) {
        return {
          reviews: [],
          error: {
            message: "API authentication failed. Please check your NY Times API key.",
            type: 'invalid_key'
          }
        };
      }
      
      if (response.status === 429) {
        return {
          reviews: [],
          error: {
            message: "Too many requests. Please try again in a moment.",
            type: 'rate_limit'
          }
        };
      }

      if (response.status === 404) {
        return {
          reviews: [],
          error: {
            message: "No reviews found for this book.",
            type: 'not_found'
          }
        };
      }

      if (response.status >= 500) {
        return {
          reviews: [],
          error: {
            message: "NY Times server error. Please try again later.",
            type: 'api'
          }
        };
      }

      return {
        reviews: [],
        error: {
          message: `Request failed with status ${response.status}`,
          type: 'api'
        }
      };
    }

    // Read the response as text first
    const text = await response.text();

    // Try parsing JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("NYTimes API returned non-JSON:", text);
      return {
        reviews: [],
        error: {
          message: "Received invalid response from NY Times API.",
          type: 'api'
        }
      };
    }

    // Check for API-level errors
    if (data.fault) {
      return {
        reviews: [],
        error: {
          message: data.fault.faultstring || "NY Times API error occurred.",
          type: 'api'
        }
      };
    }

    // Check for successful response with results
    if (data.status === "OK") {
      if (!data.results || data.results.length === 0) {
        return {
          reviews: [],
          error: {
            message: "No reviews found for this book in NY Times.",
            type: 'not_found'
          }
        };
      }

      const reviews = data.results.slice(0, 5).map((r: any) => ({
        book_title: r.book_title || title,
        book_author: r.book_author || author || "Unknown Author",
        summary: r.summary || "No summary available",
        url: r.url || "",
        isbn13: r.isbn13 || [],
        bestsellers_date: r.bestsellers_date || null,
        publication_dt: r.publication_dt || null,
        byline: r.byline || null,
        uuid: r.uuid || null,
        uri: r.uri || null,
      }));

      return { reviews };
    }

    // Unknown response format
    return {
      reviews: [],
      error: {
        message: "Unexpected response format from NY Times API.",
        type: 'api'
      }
    };

  } catch (error) {
    console.error("Error fetching NYTimes reviews:", error);
    
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        reviews: [],
        error: {
          message: "Network error. Please check your internet connection.",
          type: 'network'
        }
      };
    }

    // Generic error
    return {
      reviews: [],
      error: {
        message: "Failed to load reviews. Please try again.",
        type: 'unknown'
      }
    };
  }
}

/**
 * Fetch bestseller list reviews
 */
export async function getBestsellerReviews(): Promise<{ reviews: Review[]; error?: NYTimesError }> {
  try {
    const url = `${NYTIMES_BASE_URL}/lists/current/hardcover-fiction.json?api-key=${NYTIMES_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        return {
          reviews: [],
          error: {
            message: "API authentication failed.",
            type: 'invalid_key'
          }
        };
      }

      if (response.status === 429) {
        return {
          reviews: [],
          error: {
            message: "Too many requests. Please try again later.",
            type: 'rate_limit'
          }
        };
      }

      return {
        reviews: [],
        error: {
          message: "Failed to load bestsellers.",
          type: 'api'
        }
      };
    }

    const text = await response.text();
    
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("NYTimes Bestseller API returned non-JSON:", text);
      return {
        reviews: [],
        error: {
          message: "Invalid response from NY Times API.",
          type: 'api'
        }
      };
    }

    if (data.status === "OK" && data.results?.books) {
      const reviews = data.results.books.map((book: any) => ({
        url: book.amazon_product_url || "",
        book_title: book.title,
        book_author: book.author,
        summary: book.description || "No description available",
        bestsellers_date: data.results.bestsellers_date,
        isbn13: [book.primary_isbn13],
      }));

      return { reviews };
    }

    return {
      reviews: [],
      error: {
        message: "No bestseller data available.",
        type: 'not_found'
      }
    };

  } catch (error) {
    console.error("Error fetching bestseller reviews:", error);
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        reviews: [],
        error: {
          message: "Network error. Please check your connection.",
          type: 'network'
        }
      };
    }

    return {
      reviews: [],
      error: {
        message: "Failed to load bestsellers.",
        type: 'unknown'
      }
    };
  }
}