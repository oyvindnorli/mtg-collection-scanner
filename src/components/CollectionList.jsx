import React from 'react';

const CollectionList = ({ cards }) => (
  <div>
    <h3>Din MTG-samling</h3>
    <ul>
      {cards.map(card => (
        <li key={card.id}>
          <img src={card.image_url} alt={card.name} />
          <p>{card.name} ({card.set.toUpperCase()})</p>
        </li>
      ))}
    </ul>
  </div>
);

export default CollectionList;
