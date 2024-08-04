"use client"
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Layout from '../app/layout';
import '../app/styles/globals.css'


function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <SessionProvider session={pageProps.session}>
     
      <Component {...pageProps} />
      
    </SessionProvider>
  );
}

export default MyApp;
