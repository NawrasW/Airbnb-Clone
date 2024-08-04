import { useState, useEffect } from 'react';
import Image from 'next/image';

import { useSession } from 'next-auth/react';

import { Listing } from '@prisma/client';
import SignInModal from '../pages/SignInModal';
import { useRouter } from 'next/navigation';

interface CardProps {
  listing: {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    listerName: string;
  };
  showHeart?: boolean;
}

const Card: React.FC<CardProps> = ({ listing, showHeart = true }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false); 
  const [signInModalOpen, setSignInModalOpen] = useState(false);// State to control SignInModal visibility
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const storedFavorites: Listing[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFav = storedFavorites.some((fav) => fav.id === listing.id);
    setIsFavorite(isFav);
  }, [listing.id]);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    const storedFavorites: Listing[] = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const updatedFavorites = storedFavorites.filter((fav) => fav.id !== listing.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...storedFavorites, listing];
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }

    if (!session) {
      // Display SignInModal if user is not authenticated
      setShowSignInModal(true);
    }
  };

  const handleCardClick = () => {
    router.push(`/listings/${listing.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 mb-6 cursor-pointer relative"
      onClick={handleCardClick}
    >
      <div className="aspect-square w-full relative overflow-hidden rounded-xl">
        <Image
          src={listing.imageUrl}
          alt={listing.title}
          layout="fill"
          objectFit="cover"
          className="object-cover h-full w-full transition ease-in-out hover:scale-110"
        />
        {showHeart && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              toggleFavorite();
            }}
            className={`absolute top-2 right-2 text-rose-500 ${
              isFavorite ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        )}
      </div>
      <div>
        <p className="font-semibold text-black">
          {listing.listerName}, <span className="font-semibold text-black">{listing.title}</span>
        </p>
        <p className="text-gray-800">{listing.description}</p>
        <p className="font-semibold text-black">${listing.price}</p>
      </div>

      {/* Render SignInModal if showSignInModal is true */}
      {showSignInModal &&  <SignInModal isOpen={signInModalOpen} onClose={() => setSignInModalOpen(false)} />}
    </div>
  );
};

export default Card;
