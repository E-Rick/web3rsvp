import NextLink from '../core/NextLink'
import ConnectWallet from '../core/ConnectWallet'

function Navbar() {
	return (
		<header className="relative flex items-center justify-between w-full h-16 px-4 border-b md:px-6 lg:h-20 dark:border-white/10 border-black/10">
			{/* Navbar brand */}
			<NextLink href="/">
				<span className="text-lg uppercase text-bold">Cryptopia</span>
			</NextLink>
			<div className="flex items-center space-between">
				{/* Navbar Links */}
				<div className="flex items-center ml-10 space-x-4">
					{/* Connect wallet menu */}
					<ConnectWallet />
				</div>
			</div>
		</header>
	)
}

export default Navbar
