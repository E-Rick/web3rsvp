import Head from 'next/head'
import { useRouter } from 'next/router'
import joinClassNames from '../../utils/joinClassNames'
import NextLinks from '../core/NextLink'
import DashboardNav from './DashboardNav'

interface DashboardLayoutProps {
	page: string
	isUpcoming?: boolean
	children: React.ReactNode
}

export default function DashboardLayout(props: DashboardLayoutProps) {
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
			<DashboardNav page={page} />
			<div className="flex flex-col flex-wrap w-full px-4 py-8 overflow-y-auto">
				<div className=" sm:w-10/12">
					<h1 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
						{page == 'events' ? 'My Events' : 'My RSVPs'}
					</h1>

					<div className="">
						<div className="border-b border-gray-200">
							<nav className="flex -mb-px space-x-8" aria-label="Tabs">
								{tabs.map(tab => (
									<NextLinks
										key={tab.name}
										href={tab.href}
										className={joinClassNames(
											tab.current
												? 'border-amber-500 text-amber-600'
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
					<section className="w-full py-8 overflow-y-auto">{children}</section>
				</div>
			</div>
		</>
	)
}
