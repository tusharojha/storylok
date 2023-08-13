import Header from '@/components/Header'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css';
import { baseGoerli, modeTestnet, optimismGoerli, zoraTestnet } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'
import merge from 'lodash.merge';
import { RainbowKitProvider, Theme, getDefaultWallets, lightTheme, midnightTheme } from '@rainbow-me/rainbowkit'

function MyApp({ Component, pageProps }: AppProps) {
  const { chains, publicClient } = configureChains(
    [optimismGoerli, zoraTestnet, baseGoerli, modeTestnet],
    [publicProvider()],
  )
  const { connectors } = getDefaultWallets({
    appName: 'Storylok',
    projectId: 'storylok',
    chains
  });

  const config = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  })

  return <>
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains}>
        <Header />
        <Component {...pageProps} />
        <div id="modal" />
      </RainbowKitProvider>
    </WagmiConfig>
  </>
}

export default MyApp
