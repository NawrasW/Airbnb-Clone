"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '../components/Card';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import SkeletonLoader from '../components/SkeletonLoader';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  listerName: string;
}

const Home = () => {
  const { status } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/listing')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <SkeletonLoader/>; // Show loading indicator while fetching data
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <li key={listing.id}>
              <Card listing={listing} />
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
