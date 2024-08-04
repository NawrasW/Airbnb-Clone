// src/components/Navbar.tsx
"use client";
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import SignInModal from '../pages/SignInModal';
import SignUpModal from '../pages/SignUpModal';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="sticky top-0 bg-white border-b-2 h-20 border-gray-110 z-50">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" legacyBehavior>
              <a>
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/1200px-Airbnb_Logo_B%C3%A9lo.svg.png"
                  alt="Airbnb Logo"
                  width={150}
                  height={20}
                />
              </a>
            </Link>
          </div>
          <div className=" border-[1px] w-full md:w-auto py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-semibold px-6">Anywhere</div>
              <div className="hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center">Any Week</div>
              <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                <div className="hidden sm:block">Add Guests</div>
                <div className="p-2 bg-rose-500 rounded-full text-white">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className='flex gap-5'>
          <div className="hidden md:block text-sm font-normal py-3  rounded-full hover:bg-neutral-100 transition cursor-pointer ml-10">
            {session ? (
              <div onClick={() => router.push('/host')}>Airbnb your home</div>
            ) : (
              <div className="text-red-500">Sign in to host your room.</div>
            )}
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center focus:outline-none"
            >
              <img
                src="https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                {session ? (
                  <>
                    <Link href="/profile" legacyBehavior>
                      <a className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</a>
                    </Link>
                    <Link href="/mylistings" legacyBehavior>
                      <a className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Listings</a>
                    </Link>
                    <Link href="/favorites" legacyBehavior>
                      <a className="block px-4 py-2 text-gray-800 hover:bg-gray-100">My Favorites</a>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSignUpModalOpen(true)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign Up
                    </button>
                    <button
                      onClick={() => setSignInModalOpen(true)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
              
            )}
            </div>
          </div>
        </div>
      </nav>
      <SignInModal isOpen={signInModalOpen} onClose={() => setSignInModalOpen(false)} />
      <SignUpModal isOpen={signUpModalOpen} onClose={() => setSignUpModalOpen(false)} />
    </>
  );
};

export default Navbar;
