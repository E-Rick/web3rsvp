import Dashboard from '../../components/Dashboard'
import { ReactElement, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import EventCard from '../../components/EventCard'
import type { NextPageWithLayout } from './_app'
import { useAuth } from '@/hooks/useAuth'
import Head from 'next/head'
import DashboardNav from '@/components/DashboardNav'
import { ConnectWallet } from '@/components/ConnectWallet'
import EmptyState from '@/components/EmptyState'
import EventCardGrid from '@/components/EventCardGrid'

const MY_UPCOMING_EVENTS = gql`
	query Events($eventOwner: String, $currentTimestamp: String) {
		events(where: { eventOwner: $eventOwner, eventTimestamp_gt: $currentTimestamp }) {
			id
			eventID
			name
			description
			eventTimestamp
			maxCapacity
			totalRSVPs
			imageURL
		}
	}
`
const MyUpcomingEvents: NextPageWithLayout = () => {
	const { address } = useAuth()

	const eventOwner = address ? address.toLowerCase() : ''
	const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime().toString())
	const { loading, error, data } = useQuery(MY_UPCOMING_EVENTS, {
		variables: { eventOwner, currentTimestamp },
	})

	// if (loading)
	// 	return (
	// 		<Dashboard page="events" isUpcoming={true}>
	// 			<p>Loading...</p>
	// 		</Dashboard>
	// 	)
	// if (error)
	// 	return (
	// 		<Dashboard page="events" isUpcoming={true}>
	// 			<p>`Error! ${error.message}`</p>
	// 		</Dashboard>
	// 	)

	return (
		<>
			<>
				{address ? (
					<div>
						{data && data.events.length == 0 && <EmptyState heading="No upcoming events found" />}
						{data && data.events.length > 0 && <EventCardGrid events={data.events} />}
					</div>
				) : (
					<EmptyState heading="Please connect your wallet to view your events" actions={<ConnectWallet />} />
				)}
			</>
		</>
	)
}

MyUpcomingEvents.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<Head>
				<title>My Upcoming Events | Cryptopia</title>
				<meta name="description" content="Manage your events and RSVPs" />
			</Head>
			<Dashboard page="events" isUpcoming={true}>
				{page}
			</Dashboard>
		</>
	)
}

export default MyUpcomingEvents
