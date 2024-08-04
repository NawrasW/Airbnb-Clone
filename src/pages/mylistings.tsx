import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Listing } from '@prisma/client';
import ListingCard from '../components/ListingCard';

interface MyListingsProps {
  listings: Listing[];
}

const MyListingsPage: React.FC<MyListingsProps> = ({ listings: initialListings }) => {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/listings');
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      setListings(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError('Failed to fetch listings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDeleteListing = async (id: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Failed to delete listing');
    }
  };

  const handleUpdateListing = async (id: number, updatedListing: Partial<Listing>) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedListing),
      });

      if (!response.ok) {
        throw new Error(`Failed to update listing: ${response.statusText}`);
      }

      setListings((prevListings) =>
        prevListings.map((listing) => (listing.id === id ? { ...listing, ...updatedListing } : listing))
      );
    } catch (error) {
      console.error('Error updating listing:', error);
      setError('Failed to update listing');
    }
  };

  if (loading) {
    return <p className="text-center text-gray-600">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">My Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onDelete={handleDeleteListing}
            onUpdate={handleUpdateListing}
          />
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<MyListingsProps> = async (context) => {
  const { getSession } = await import('next-auth/react');
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const session = await getSession(context);

    if (!session?.user?.id) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return {
      props: {
        listings,
      },
    };
  } catch (error) {
    console.error('Error fetching listings:', error);
    return {
      props: {
        listings: [],
        error: 'Failed to fetch listings',
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default MyListingsPage;
