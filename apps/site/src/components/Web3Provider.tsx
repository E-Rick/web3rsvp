import { APP_NAME } from '@/utils/consts'
import { getDefaultWallets, RainbowKitProvider, lightTheme, darkTheme } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID

const { chains, provider } = configureChains(
	[chain.polygon, chain.polygonMumbai],
	[infuraProvider({ apiKey: infuraId }), publicProvider()]
)

const { connectors } = getDefaultWallets({
	appName: APP_NAME,
	chains,
})

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
})

const Web3Provider = ({ children }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={{
					lightMode: lightTheme(),
					darkMode: darkTheme(),
				}}
			>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default Web3Provider
