import {
  useDisconnect,
  useAccount,
  useBalance,
  useNetwork,
  useProvider,
  useSigner,
} from 'wagmi';


export function useAuth() {
  const provider = useProvider()
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { data: signer } = useSigner()

  const { address, isConnecting, isConnected } = useAccount()

  const { data: balance } = useBalance({ addressOrName: address })

  return {
    provider,
    signer,
    address,
    balance,
    loading: isConnecting,
    isConnected,
    disconnect,
    chain,
  }
}