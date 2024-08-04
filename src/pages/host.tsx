import { useState, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import NSFWFilter from 'nsfw-filter';
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

const Host = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(48);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
     // Use the correctly defined libraries array
    // other options
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check if the image is appropriate
      const isSafe = await NSFWFilter.isSafe(file);
      if (!isSafe) {
        setError('Image is not appropriate');
        return;
      }

      setImageFile(file);
    }
  };

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      setLatitude(event.latLng.lat());
      setLongitude(event.latLng.lng());
    }
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !price || !imageFile || latitude === null || longitude === null) {
      setError('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price.toString());
    formData.append('imageFile', imageFile);
    formData.append('userId', session?.user?.id as string);
    formData.append('listerName', session?.user?.name as string);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    try {
      const response = await fetch('/api/auth/host', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create listing');
      }
    } catch (error) {
      setError('Error creating listing');
      console.error('Failed to create listing:', error);
    }
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <button
          onClick={() => signIn()}
          className="bg-red-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          Sign in to host a room
        </button>
      </div>
    );
  }

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps...</div>;
  }

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Host a Room</h1>
        <input
          type="text"
          placeholder="Title"
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-red-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {!title && error && (
          <p className="text-red-500 text-sm mb-4">Title is required</p>
        )}
        <textarea
          placeholder="Description"
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-red-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {!description && error && (
          <p className="text-red-500 text-sm mb-4">Description is required</p>
        )}
        <div className="flex items-center mb-4 w-full">
          <span className="mr-2 text-gray-800">JD {price}</span>
          <input
            type="range"
            min={48}
            max={1459}
            value={price}
            className="slider w-full"
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        {!price && error && (
          <p className="text-red-500 text-sm mb-4">Price is required</p>
        )}
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-red-500"
        />
        {!imageFile && error && (
          <p className="text-red-500 text-sm mb-4">Image is required</p>
        )}
        <div className="w-full mb-4">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={8}
            center={center}
            onClick={handleMapClick}
          >
            {latitude && longitude && (
              <Marker position={{ lat: latitude, lng: longitude }} />
            )}
          </GoogleMap>
        </div>
        <button
          onClick={handleSubmit}
          className="bg-red-500 text-white py-2 px-4 rounded-full shadow-md hover:bg-red-600 transition-colors duration-300"
        >
          Upload
        </button>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Host;
