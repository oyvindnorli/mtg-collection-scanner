import React, { useEffect, useState } from 'react';
import { supabase } from './utils/supabaseClient';
import SearchBar from './components/SearchBar';
import CollectionList from './components/CollectionList';

const App = () => {
  const [collection, setCollection] = useState([]);

  const fetchCollection = async () => {
    const { data, error } = await supabase.from('cards').select('*').order('added_at', { ascending: false });
    if (!error) setCollection(data);
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>MTG-samling</h1>
      <SearchBar onCardAdded={fetchCollection} />
      <CollectionList cards={collection} />
    </div>
  );
};

export default App;