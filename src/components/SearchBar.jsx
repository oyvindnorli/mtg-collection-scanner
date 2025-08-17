import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const SearchBar = ({ onCardAdded }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const fetchCards = async () => {
      if (!debouncedQuery) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const encoded = encodeURIComponent(`!"${debouncedQuery}" include:extras`);
        const url = `https://api.scryfall.com/cards/search?q=${encoded}&unique=prints`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.object === 'list') {
          setResults(data.data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Feil ved henting fra Scryfall:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [debouncedQuery]);

  const addCardToCollection = async (card) => {
    const { error } = await supabase.from('cards').insert([{
      name: card.name,
      set: card.set,
      set_name: card.set_name,
      collector_number: card.collector_number,
      rarity: card.rarity,
      mana_cost: card.mana_cost,
      type_line: card.type_line,
      oracle_text: card.oracle_text,
      colors: card.colors,
      image_url: card.image_uris?.normal,
      released_at: card.released_at,
    }]);

    if (!error) {
      onCardAdded();
    } else {
      alert("Feil ved lagring: " + error.message);
    }
  };

  return (
    <div className="mb-8 px-4">
      <input
        type="text"
        placeholder="Søk etter kort..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {loading && <p className="mt-2 text-sm text-gray-500">Søker...</p>}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {results.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 p-3 flex flex-col items-center text-center max-w-xs"
          >
            <img
              src={card.image_uris?.normal}
              alt={card.name}
              className="rounded-md w-32 h-auto mb-2"
            />
            <h3 className="font-semibold text-xs">{card.name}</h3>
            <p className="text-xs text-gray-600 mb-2">{card.set_name} ({card.set.toUpperCase()})</p>
            <button
              onClick={() => addCardToCollection(card)}
              className="mt-auto bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Legg til i samling
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;