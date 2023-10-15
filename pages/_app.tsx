import Header from '@/components/Header'
import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ParticleAdapter, PhantomWalletAdapter, SolflareWalletAdapter, TrustWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';

// Importing particle network libraries.
import { ModalProvider } from '@particle-network/connect-react-ui'
import config from '@/components/config'

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

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new ParticleAdapter(),
      new PhantomWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );


  return <>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <ModalProvider
            options={config}
            theme={'light'}
            language={'en'}   //optional：localize, default en
            particleAuthSort={[    //optional：display particle auth items and order
              'phone',
              'google',
              'apple',
              'twitter'
            ]}
          >

            <Header />
            <Component {...pageProps} />
            <div id="modal" />
          </ModalProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </>
}

export default MyApp
