import Footer from './Footer'
import Navbar from './Navbar'

const Layout = ({ children }) => (
	<div className="flex flex-col min-h-screen mx-auto max-w-7xl">
		{/* Navigation Bar */}
		<Navbar />
		<div className="flex grow">{children}</div>
		{/* Footer */}
		<Footer />
	</div>
)

export default Layout
