import React from 'react';
import { render } from '@testing-library/react-native';
import FeaturedSection from '../components/FeaturedSection';
import { Book } from '../types/Book';

describe('FeaturedSection', () => {
  const mockBooks: Book[] = [
    {
      id: '1',
      volumeInfo: {
        title: 'Book One',
        authors: ['Author One'],
        imageLinks: {
          thumbnail: 'https://example.com/1.jpg',
        },
      },
    },
    {
      id: '2',
      volumeInfo: {
        title: 'Book Two',
        authors: ['Author Two'],
        imageLinks: {
          thumbnail: 'https://example.com/2.jpg',
        },
      },
    },
  ];

  it('renders featured books correctly', () => {
    const { getByText } = render(<FeaturedSection books={mockBooks} />);

    expect(getByText('Featured')).toBeTruthy();
    expect(getByText('Book One')).toBeTruthy();
    expect(getByText('Author One')).toBeTruthy();
    expect(getByText('Book Two')).toBeTruthy();
    expect(getByText('Author Two')).toBeTruthy();
  });

  it('returns null when books array is empty', () => {
    const { queryByText } = render(<FeaturedSection books={[]} />);

    expect(queryByText('Featured')).toBeNull();
  });

  it('returns null when books is undefined', () => {
    const { queryByText } = render(<FeaturedSection books={undefined as any} />);

    expect(queryByText('Featured')).toBeNull();
  });

  it('displays only first 6 books', () => {
    const manyBooks: Book[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      volumeInfo: {
        title: `Book ${i}`,
        authors: [`Author ${i}`],
      },
    }));

    const { getByText, queryByText } = render(
      <FeaturedSection books={manyBooks} />
    );

    // First 6 should be present
    expect(getByText('Book 0')).toBeTruthy();
    expect(getByText('Book 5')).toBeTruthy();

    // 7th and beyond should not be present
    expect(queryByText('Book 6')).toBeNull();
    expect(queryByText('Book 9')).toBeNull();
  });

  it('handles books with missing information', () => {
    const incompleteBooks: Book[] = [
      {
        id: '1',
        volumeInfo: {},
      },
    ];

    const { getByText } = render(<FeaturedSection books={incompleteBooks} />);

    expect(getByText('Unknown Title')).toBeTruthy();
    expect(getByText('Unknown')).toBeTruthy();
  });
});