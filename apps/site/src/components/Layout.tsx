import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({ children }) => (
	<div className="flex flex-col min-h-screen px-4 mx-auto max-w-7xl">
		<Navbar />
		<div className="flex grow">{children}</div>
		<Footer />
	</div>
)

export default Layout
