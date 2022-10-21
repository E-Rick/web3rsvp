import React from 'react'
import EventCard from '@/components/EventCard'
import NextLinks from './core/NextLink'

interface EventCardGridProps {
	events: any[]
	confirmAttendees?: boolean
}

const EventCardGrid = (props: EventCardGridProps) => {
	const { events, confirmAttendees = false } = props

	return (
		<ul
			role="list"
			className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
		>
			{events.map(event => (
				<li key={event.id}>
					<EventCard
						id={event.id}
						name={event.name}
						eventTimestamp={event.eventTimestamp}
						imageURL={event.imageURL}
					/>
					{confirmAttendees && (
						<NextLinks href={`/my-events/past/${event.id}`}>
							<a className="text-sm truncate text-amber-800 hover:underline">Confirm attendees</a>
						</NextLinks>
					)}
				</li>
			))}
		</ul>
	)
}

export default EventCardGrid
