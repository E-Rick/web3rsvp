import useHasMounted from '@/hooks/useHasMounted'
import NextLink from './NextLink'
import ThemeSwitcher from './ThemeSwitcher'
import ConnectWallet from './ConnectWallet'
import NextLinks from './NextLink'

function Navbar() {
	const mounted = useHasMounted()
	return (
		mounted && (
			<header className="relative flex items-center justify-between w-full h-16 px-4 border-b md:px-6 lg:h-20 dark:border-white/10 border-black/10">
				<NextLink href="/">Cryptopia</NextLink>
				<div className="flex items-center space-between">
					<div className="flex items-center ml-10 space-x-4">
						<ThemeSwitcher />
						<ConnectWallet />
					</div>
				</div>
			</header>
		)
	)
}

export default Navbar
