import React, { useState } from 'react';
import CameraScanner from './components/CameraScanner';
import CollectionList from './components/CollectionList';


const App = () => {
  const [collection, setCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageCaptured = async (imageDataUrl) => {
  setLoading(true);
  setError('');

  try {
    // Konverter base64-data til Blob
    const blob = await (await fetch(imageDataUrl)).blob();

    // Lag formdata for bilde-opplasting
    const formData = new FormData();
    formData.append("file", blob, "card.png");

    // Send til Scryfall image recognition
    const response = await fetch("https://api.scryfall.com/cards/recognize", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Scryfall-bildegjenkjenning feilet");
    const result = await response.json();

    // Bruk det første kortet de foreslår
    const card = result.data[0];
    setCollection(prev => [...prev, card]);
  } catch (err) {
    console.error(err);
    setError('Kunne ikke gjenkjenne kortet med bilde');
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