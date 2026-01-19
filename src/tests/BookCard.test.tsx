import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BookCard from '../components/BookCard';
import { Book } from '../types/Book';

describe('BookCard', () => {
  const mockBook: Book = {
    id: '1',
    volumeInfo: {
      title: 'Test Book',
      authors: ['Test Author'],
      publishedDate: '2024-01-01',
      averageRating: 4.5,
      imageLinks: {
        thumbnail: 'https://example.com/image.jpg',
      },
    },
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book information correctly', () => {
    const { getByText } = render(
      <BookCard book={mockBook} onPress={mockOnPress} />
    );

    expect(getByText('Test Book')).toBeTruthy();
    expect(getByText('Test Author')).toBeTruthy();
    expect(getByText('2024')).toBeTruthy();
    expect(getByText('4.5')).toBeTruthy();
  });

  it('handles missing book information gracefully', () => {
    const incompleteBook: Book = {
      id: '2',
      volumeInfo: {},
    };

    const { getByText } = render(
      <BookCard book={incompleteBook} onPress={mockOnPress} />
    );

    expect(getByText('Unknown Title')).toBeTruthy();
    expect(getByText('Unknown Author')).toBeTruthy();
  });

  it('calls onPress when card is pressed', () => {
    const { getByText } = render(
      <BookCard book={mockBook} onPress={mockOnPress} />
    );

    fireEvent.press(getByText('Test Book'));
    expect(mockOnPress).toHaveBeenCalledWith(mockBook);
  });

  it('displays rating when available', () => {
    const { getByText } = render(
      <BookCard book={mockBook} onPress={mockOnPress} />
    );

    expect(getByText('4.5')).toBeTruthy();
  });

  it('does not display rating when unavailable', () => {
    const bookWithoutRating: Book = {
      ...mockBook,
      volumeInfo: {
        ...mockBook.volumeInfo,
        averageRating: undefined,
      },
    };

    const { queryByText } = render(
      <BookCard book={bookWithoutRating} onPress={mockOnPress} />
    );

    expect(queryByText(/⭐/)).toBeNull();
  });

  it('handles multiple authors', () => {
    const bookWithMultipleAuthors: Book = {
      ...mockBook,
      volumeInfo: {
        ...mockBook.volumeInfo,
        authors: ['Author One', 'Author Two', 'Author Three'],
      },
    };

    const { getByText } = render(
      <BookCard book={bookWithMultipleAuthors} onPress={mockOnPress} />
    );

    expect(getByText('Author One, Author Two, Author Three')).toBeTruthy();
  });

  it('renders placeholder image when thumbnail is missing', () => {
    const bookWithoutImage: Book = {
      ...mockBook,
      volumeInfo: {
        ...mockBook.volumeInfo,
        imageLinks: undefined,
      },
    };

    const { getByText } = render(
      <BookCard book={bookWithoutImage} onPress={mockOnPress} />
    );

    expect(getByText('📚')).toBeTruthy();
  });
});