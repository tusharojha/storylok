import Header from '@/components/Header'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

import { useMemo } from 'react';

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

function MyApp({ Component, pageProps }: AppProps) {
  const network = WalletAdapterNetwork.Testnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
      () => [
          new PhantomWalletAdapter(),
          new TrustWalletAdapter(),
          new SolflareWalletAdapter()
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [network]
  );


  return <>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Header />
          <Component {...pageProps} />
          <div id="modal" />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </>
}

export default MyApp
