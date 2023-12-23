import { useAuth } from "@arcana/auth-react";

export const addressTrim = (s: string) => s.slice(0, 4) + '...' + s.slice(s.length - 4, s.length)

export const ConnectWallet = () => {

  const { loading, isLoggedIn, connect, user, logout } = useAuth()

  return <>
    <div>
      <button
        className="px-4 py-2 bg-accent hover:bg-accent-hover text-white text-lg rounded-md"
        onClick={user ? logout : connect}>
        {user ? `${addressTrim(user.address)}` : 'Start Game'}
      </button>
    </div>
  </>
}