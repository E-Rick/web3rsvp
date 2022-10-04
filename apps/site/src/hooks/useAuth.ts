import { truncateEthAddress } from '@/utils/helpers';
import {
  useDisconnect,
  useAccount,
  useEnsName,
  useBalance,
  useNetwork,
  useEnsAvatar,
  useProvider,
  useSigner,
} from 'wagmi';


export function useAuth() {
  const provider = useProvider()

  const { data: signer } = useSigner()
  const { address, isConnecting, isConnected } = useAccount()
  let { data: ensName } = useEnsName({
    address: address,
  })
  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address,
  })
  const { disconnect } = useDisconnect()
  const { chain } = useNetwork()
  const { data: balance } = useBalance({ addressOrName: address })

  return {
    provider,
    signer,
    address: address,
    ensName: ensName || truncateEthAddress(address),
    ensAvatar: ensAvatar,
    displayName: ensName ?? truncateEthAddress(address),
    balance: balance,
    loading: isConnecting,
    isConnected: isConnected,
    disconnect,
    chain,
  }
}