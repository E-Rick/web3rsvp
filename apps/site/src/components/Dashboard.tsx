import Head from 'next/head'
import { useRouter } from 'next/router'
import joinClassNames from '../utils/joinClassNames'
import NextLinks from './core/NextLink'
import DashboardNav from './DashboardNav'

interface DashboardProps {
	page: string
	isUpcoming?: boolean
	children: React.ReactNode
}

export default function Dashboard(props: DashboardProps) {
	const { page, isUpcoming = false, children } = props
	const router = useRouter()

	const handleChange = e => {
		e.preventDefault()
		const name = e.target.value
		const href = tabs.find(tab => tab.name == name).href
		router.push(href)
	}

	let tabs = [
		{
			name: 'Upcoming',
			href: `/my-${page}/upcoming`,
			current: isUpcoming,
		},
		{
			name: 'Past',
			href: `/my-${page}/past`,
			current: !isUpcoming,
		},
	]

	return (
		<>
			<Head>
				<title>My Dashboard | Cryptopia</title>
				<meta name="description" content="Manage your events and RSVPs" />
			</Head>
			<div className="flex flex-wrap w-full py-8">
				<DashboardNav page={page} />
				<div className="sm:w-10/12 sm:pl-8">
					<h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
						{page == 'events' ? 'My Events' : 'My RSVPs'}
					</h1>
					<div className="sm:hidden">
						<label htmlFor="tabs" className="sr-only">
							Select a tab
						</label>
						<select
							id="tabs"
							name="tabs"
							className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
							defaultValue={tabs.find(tab => tab.current).name}
							onChange={handleChange}
						>
							{tabs.map(tab => (
								<option key={tab.name}>{tab.name}</option>
							))}
						</select>
					</div>
					<div className="hidden sm:block">
						<div className="border-b border-gray-200">
							<nav className="flex -mb-px space-x-8" aria-label="Tabs">
								{tabs.map(tab => (
									<NextLinks
										key={tab.name}
										href={tab.href}
										className={joinClassNames(
											tab.current
												? 'border-orange-500 text-orange-600'
												: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
											'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
										)}
										aria-current={tab.current ? 'page' : undefined}
									>
										{tab.name}
									</NextLinks>
								))}
							</nav>
						</div>
					</div>
					<section className="py-8">{children}</section>
				</div>
			</div>
		</>
	)
}
