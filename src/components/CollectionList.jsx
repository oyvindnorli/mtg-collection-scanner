const CollectionList = ({ cards }) => (
  <div>
    <h3>Din samling:</h3>
    <ul>
      {cards.map((card, i) => (
        <li key={i}>
          <img src={card.image_uris?.small} alt={card.name} />
          <p>{card.name}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default CollectionList;