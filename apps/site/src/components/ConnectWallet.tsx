import { ConnectButton as RKConnectButton } from '@rainbow-me/rainbowkit'
import useHasMounted from '@/hooks/useHasMounted'
import Navmenu from './layout/NavMenu'
import { useAccount } from 'wagmi'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import Button from './core/Button'

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
									<Button onClick={openConnectModal} {...props}>
										{connectText}
									</Button>
								)
							}
							if (chain.unsupported) {
								return (
									<Button
										variant="danger"
										onClick={openChainModal}
										icon={<ExclamationCircleIcon width={24} />}
										{...props}
									>
										Wrong network
									</Button>
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
