import joinClassNames from '../../utils/joinClassNames'
import NextLinks from '@/components/core/NextLink'
import Events from '@/assets/icons/Events'
import RSVPs from '@/assets/icons/RSVP'
import { useRouter } from 'next/router'

export default function DashboardNav({ page }) {
	const router = useRouter()
	const { pathname } = router
	let navigation = [
		{
			name: 'My Events',
			href: `/my-events/upcoming`,
			current: pathname.includes('events'),
			icon: Events,
		},
		{
			name: 'My RSVPs',
			href: `/my-rsvps/upcoming`,
			current: pathname.includes('rsvps'),
			icon: RSVPs,
		},
	]

	return (
		<nav
			className="flex flex-col items-center justify-between min-h-full space-y-2 bg-white border-r sm:w-2/12 dark:border-white/10 border-black/10"
			aria-label="Sidebar"
		>
			<div className="flex flex-col items-center w-full gap-4 my-2">
				{navigation.map(item => (
					<NextLinks
						key={item.name}
						href={item.href}
						className={joinClassNames(
							item.current
								? 'bg-gray-100 text-gray-900 dark:text-white dark:bg-amber-900'
								: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
							// `flex flex-col items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-black/10 dark:hover:bg-white/10
							'flex items-center px-3 py-2 text-sm font-medium rounded-md gap-2'
						)}
						aria-current={item.current ? 'page' : undefined}
					>
						<item.icon isSelected={item.current} />
						<span className="hidden truncate sm:inline-block">{item.name}</span>
					</NextLinks>
				))}
			</div>
		</nav>
	)
}
