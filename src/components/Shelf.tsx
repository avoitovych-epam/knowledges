import React from 'react';
import type { NextPage } from 'next';

interface ShelfProps {
  groups: string[];
  handleTopicSelect: (group: string) => void;
}

const Shelf: NextPage<ShelfProps> = ({ groups, handleTopicSelect }) => {
  const books = groups.map((group) => {
    return {
      id: group.toLowerCase(),
      title: group,
    };
  });

  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 h-auto">
      <div className="flex flex-wrap gap-4 justify-center max-w-5xl">
        {books.map((book) => (
          <div
            key={book.id}
            id={`book-${book.title}`}
            className={`book flex justify-center items-center w-36 h-48 text-white font-bold text-lg rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl text-center`}
            onClick={() => handleTopicSelect(book.title)}
          >
            {book.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shelf;
