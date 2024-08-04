"use client"

import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <Navbar />
    
      <h1>Listings</h1>
      <ul>
        {listings.map(listing => (
          <li key={listing.id}>
            <h2>{listing.title}</h2>
            <p>{listing.description}</p>
            <p>${listing.price}</p>
          </li>
        ))}
      </ul>
      <Footer/>
    </div>
    
  );
}
