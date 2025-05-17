import React, { useState } from 'react';

const quotes = [
  {
    text: "Shoot for the moon. Even if you miss, you'll land among the stars.",
    author: "Norman Vincent Peale"
  },
  {
    text: "The cosmos is within us. We are made of star-stuff.",
    author: "Carl Sagan"
  },
  {
    text: "To confine our attention to terrestrial matters would be to limit the human spirit.",
    author: "Stephen Hawking"
  },
  {
    text: "Somewhere, something incredible is waiting to be known.",
    author: "Carl Sagan"
  },
  {
    text: "Across the sea of space, the stars are other suns.",
    author: "Carl Sagan"
  }
];

const QuoteCard = () => {
  const [current, setCurrent] = useState(Math.floor(Math.random() * quotes.length));

  const nextQuote = () => {
    let next = Math.floor(Math.random() * quotes.length);
    while (next === current && quotes.length > 1) {
      next = Math.floor(Math.random() * quotes.length);
    }
    setCurrent(next);
  };

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 border-2 border-purple-600 rounded-lg shadow-lg p-8 flex flex-col items-center max-w-md mx-auto">
      <span className="text-4xl mb-4 text-purple-300">“</span>
      <p className="text-xl text-purple-100 text-center mb-4 font-medium">{quotes[current].text}</p>
      <p className="text-purple-400 text-right w-full mb-6">— {quotes[current].author}</p>
      <button
        onClick={nextQuote}
        className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded transition"
      >
        Show Another Quote
      </button>
    </div>
  );
};

export default QuoteCard; 