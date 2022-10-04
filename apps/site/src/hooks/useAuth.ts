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
  const { chain } = useNetwork()
  const { disconnect } = useDisconnect()
  const { data: signer } = useSigner()

  const { address, isConnecting, isConnected } = useAccount()
  let { data: ensName } = useEnsName({
    address: address,
    chainId: 1
  })

  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: address,
    chainId: 1
  })
  const { data: balance } = useBalance({ addressOrName: address })

  return {
    provider,
    signer,
    address: address,
    ensName: ensName ?? truncateEthAddress(address),
    ensAvatar: ensAvatar ?? null,
    displayName: ensName ?? truncateEthAddress(address),
    balance: balance,
    loading: isConnecting,
    isConnected: isConnected,
    disconnect,
    chain,
  }
}