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
        const url = `https://api.scryfall.com/cards/search?q=${encoded}`;
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
    <div style={{ marginBottom: '2rem' }}>
      <input
        type="text"
        placeholder="Søk etter kort..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
      />
      {loading && <span>Søker...</span>}

      <div style={{ marginTop: '1rem' }}>
        {results.map((card) => (
          <div key={card.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <img src={card.image_uris?.small} alt={card.name} style={{ marginRight: '1rem', borderRadius: '4px' }} />
            <div>
              <strong>{card.name}</strong> ({card.set.toUpperCase()} #{card.collector_number})
              <br />
              <button onClick={() => addCardToCollection(card)}>Legg til i samling</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;