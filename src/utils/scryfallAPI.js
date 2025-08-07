export async function fetchCardByName(name) {
  const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(name)}`);
  if (!response.ok) throw new Error('Fant ikke kort');
  return response.json();
}