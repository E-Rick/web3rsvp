import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit'
import useHasMounted from '@/hooks/useHasMounted'
import Navmenu from './NavMenu'
import { useAccount } from 'wagmi'
import { ExclamationCircleIcon } from '@heroicons/react/outline'

type Visibility = 'always' | 'connected' | 'not_connected'

type ConnectWalletProps = { show?: Visibility; connectText?: string }

export const ConnectWallet = ({ connectText = 'Connect wallet', show = 'always', ...props }: ConnectWalletProps) => {
	const { isConnected } = useAccount()
	const mounted = useHasMounted()
	if ((show === 'connected' && !isConnected) || (show === 'not_connected' && isConnected)) return null
	if (!mounted) return null
	return (
		<RKConnectButton.Custom>
			{({ account, chain, openChainModal, openConnectModal, mounted }) => {
				return (
					<>
						{(() => {
							if (!mounted) {
								return null
							}
							if (!mounted || !account || !chain) {
								return (
									<button onClick={openConnectModal} {...props}>
										{connectText}
									</button>
								)
							}
							if (chain.unsupported) {
								return (
									<button
										className="inline-flex items-center gap-2 px-2.5 py-2 rounded-md text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/10 cursor-pointer"
										onClick={openChainModal}
										{...props}
									>
										<ExclamationCircleIcon width={24} />
										<span>Wrong network</span>
									</button>
								)
							}

							return <Navmenu />
						})()}
					</>
				)
			}}
		</RKConnectButton.Custom>
	)
}

export default ConnectWallet
