import { ConnectButton } from "@particle-network/connect-react-ui";

import '@particle-network/connect-react-ui/dist/index.css';

export const addressTrim = (s: string) => s.slice(0, 4) + '...' + s.slice(s.length - 4, s.length)

export const ConnectWallet = () => {
  return <ConnectButton.Custom>
    {({ account, chain, openAccountModal, openConnectModal, openChainModal, accountLoading }) => {
      return (
        <div>
          <button
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-lg rounded-md"
            onClick={account ? openAccountModal : openConnectModal}>
            {account ? `Player: ${addressTrim(account)}` : 'Start Game'}
          </button>
        </div>
      );
    }}
  </ConnectButton.Custom>
}