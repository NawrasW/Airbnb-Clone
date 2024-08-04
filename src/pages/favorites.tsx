import { useEffect, useState } from 'react';
import Card from '../components/Card';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  listerName: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<Listing[]>([]);

  useEffect(() => {
    const storedFavorites: Listing[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">My Favorites</h1>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((listing) => (
          <li key={listing.id}>
            <Card listing={listing} showHeart={false} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
