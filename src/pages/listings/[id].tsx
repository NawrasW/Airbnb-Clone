import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';
import { ParsedUrlQuery } from 'querystring';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const libraries = ['places', 'geometry'] as const; // Define libraries correctly

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
const center = {
  lat: -3.745,
  lng: -38.523,
};

interface ListingProps {
  id: number;
  title: string;
  listerName: string;
  description: string;
  price: number;
  imageUrl: string;
  userId: string;
  reviews: {
    id: number;
    rating: number;
    comment: string;
    listerName: string; // Added listerName to reviews
  }[];
  latitude: number | null;
  longitude: number | null;
}

const ListingPage: React.FC<{ listing: ListingProps }> = ({ listing }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    
    // other options
  });

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the user is the lister
    if (!listing || session?.user.id === listing.userId) {
      setError('You cannot review your own listing or listing not found.');
      return;
    }

    const response = await fetch(`/api/listings/${listing.id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating, comment }),
    });

    if (response.ok) {
      router.reload();
    } else {
      setError('Failed to submit review. Please try again later.');
    }
  };

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-8">
          <div className="lg:w-1/2 mb-4 lg:mb-0">
            <h1 className="text-4xl font-bold text-rose-500">{listing.title}</h1>
            <p className="text-gray-600 mt-2">{listing.description}</p>
            <p className="text-gray-600 mt-2">By {listing.listerName}</p>



<div className='mt-4 '>

            {listing.latitude && listing.longitude && isLoaded && (
            <div className="w-full mb-4 rounded-lg overflow-hidden">
              <GoogleMap 
                mapContainerStyle={mapContainerStyle}
                zoom={14} // Adjust the zoom level as needed
                center={{ lat: listing.latitude, lng: listing.longitude }}  // Use listing coordinates
              >
                <Marker position={{ lat: listing.latitude, lng: listing.longitude }} />
              </GoogleMap>
            </div>
          )}
          </div>
          </div>

        

      

         
          <div className="relative w-full lg:w-1/3 h-64 lg:h-96">
            <img src={listing.imageUrl} alt={listing.title} className="rounded-md w-full h-full object-cover" />
          </div>
        </div>

    
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        

          <h2 className="text-2xl font-bold mb-4 text-rose-500">Reviews</h2>
          {session ? (
            <form onSubmit={handleReviewSubmit} className="mb-8">
              <div className="mb-4">
                <label htmlFor="rating" className="block text-gray-700">Rating</label>
                <input
                  type="range"
                  id="rating"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  className="w-full"
                />
                <span className="text-gray-700 mt-1">{rating}</span>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700">Comment</label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  rows={4}
                />
              </div>
              {error && <p className="text-rose-500 mb-4">{error}</p>}
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded border border-slate-300 bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-2 font-semibold hover:opacity-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 focus-visible:ring-offset-2 active:opacity-100"
                style={{
                  boxShadow: 'inset 0 2px 4px 0 rgb(2 6 23 / 0.3), inset 0 -2px 4px 0 rgb(203 213 225)',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                Submit Review
              </button>
            </form>
          ) : (
            <p className="text-rose-500">Sign in to leave a review.</p>
          )}
          <div className="space-y-4">
            {listing.reviews.map((review) => (
              <div key={review.id} className="p-4 border border-gray-200 rounded-md">
                <p className="font-semibold">Rating: {review.rating}</p>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-gray-700">By {review.listerName}</p> {/* Display listerName for each review */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as ParsedUrlQuery;
  const prisma = new PrismaClient();

  try {
    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(id as string, 10) },
      include: { reviews: true },
    });

    if (!listing) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        listing: {
          ...listing,
          latitude: listing.latitude || null,
          longitude: listing.longitude || null,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching listing:', error);
    return {
      notFound: true,
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default ListingPage;
