import Header from '@/components/Header'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ParticleAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Importing particle network libraries.
import { AuthProvider } from '@arcana/auth'
import { ProvideAuth } from '@arcana/auth-react'

import mixpanel from 'mixpanel-browser'
import { useEffect, useMemo } from 'react';

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Mainnet;

  useEffect(() => {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL ?? '', { track_pageview: true, persistence: 'localStorage' });
  }, [])

  const auth = new AuthProvider(
    process.env.NEXT_PUBLIC_APP_CLIENT_ID ?? '', // App client ID
    {
      position: 'left',         // default: right
      theme: 'dark',           // default: dark
      alwaysVisible: false,     // default: true, wallet always visible
      setWindowProvider: true,  // default: false, window.ethereum not set
      connectOptions: {
        compact: true           // default: false, regular plug-and-play login UI
      },
      chainConfig: {
        chainId: '2',                    // defaults to Ethereum
        rpcUrl: 'https://api.testnet.solana.com', // defaults to 'https://rpc.ankr.com/eth'
      },
    })


  return <>
    <ProvideAuth provider={auth}>
      <Header />
      <Component {...pageProps} />
      <div id="modal" />
    </ProvideAuth >
  </>
}

export default MyApp
