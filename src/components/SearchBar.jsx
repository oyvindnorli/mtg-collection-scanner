import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const SearchBar = ({ onCardAdded }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchCards = async () => {
    if (!query) return;
    setLoading(true);
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    setResults(data.data || []);
    setLoading(false);
  };

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
    <div>
      <input
        type="text"
        placeholder="Søk etter kort..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchCards} disabled={loading}>
        {loading ? 'Søker...' : 'Søk'}
      </button>

      <ul>
        {results.map((card) => (
          <li key={card.id} style={{ margin: '1rem 0' }}>
            <img src={card.image_uris?.small} alt={card.name} />
            <p>{card.name} ({card.set.toUpperCase()})</p>
            <button onClick={() => addCardToCollection(card)}>Legg til i samling</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;