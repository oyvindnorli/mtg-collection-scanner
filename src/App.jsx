import React, { useState } from 'react';
import CameraScanner from './components/CameraScanner';
import CollectionList from './components/CollectionList';
import { recognizeCardName } from './utils/ocr';
import { fetchCardByName } from './utils/scryfallAPI';

const App = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageCaptured = async (imageDataUrl) => {
    setLoading(true);
    setError('');
    try {
      const name = await recognizeCardName(imageDataUrl);
      const card = await fetchCardByName(name);
      setCollection(prev => [...prev, card]);
    } catch (err) {
      setError('Kunne ikke gjenkjenne eller hente kort');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>MTG-samling med scanning</h1>
      <CameraScanner onImageCaptured={handleImageCaptured} />
      {loading && <p>Henter kort...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <CollectionList cards={collection} />
    </div>
  );
};

export default App;