import Head from 'next/head'

const Landing = ({ children }) => (
	<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
		<Head>
			<title>web3rsvp</title>
			<meta name="description" content="Find, join, and create virtual events with your web3 frens" />
		</Head>
		<section className="py-12">
			<div className="w-full text-left md:w-8/12">
				<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white/90 sm:text-5xl md:text-6xl">
					<span>Discover what&apos;s happening in the </span>
					<span className="text-amber-600 dark:text-amber-400">metaverse</span>
				</h1>
				<p className="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
					Find, join, and create virtual events with your web3 frens!
				</p>
			</div>
		</section>
		<section className="py-12">{children}</section>
	</div>
)

export default Landing
