import Dashboard from '../../../components/Dashboard'
import { ReactElement, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAuth } from '@/hooks/useAuth'
import type { NextPageWithLayout } from '@/pages/_app'
import Head from 'next/head'
import { MY_PAST_EVENTS } from '@/gql/queries/my-past-events'
import EmptyState from '@/components/EmptyState'
import ConnectWallet from '@/components/ConnectWallet'
import EventCardGrid from '@/components/EventCardGrid'

const MyPastEvents: NextPageWithLayout = () => {
	const { address } = useAuth()

	const eventOwner = address ? address.toLowerCase() : ''
	const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime().toString())
	const { loading, error, data } = useQuery(MY_PAST_EVENTS, {
		variables: { eventOwner, currentTimestamp },
	})

	// if (loading)
	// 	return (
	// 		<Dashboard page="events" isUpcoming={false}>
	// 			<p>Loading...</p>
	// 		</Dashboard>
	// 	)
	// if (error)
	// 	return (
	// 		<Dashboard page="events" isUpcoming={false}>
	// 			<p>`Error! ${error.message}`</p>
	// 		</Dashboard>
	// 	)

	return (
		<>
			{address ? (
				<div>
					{data && data.events.length == 0 && <EmptyState heading="No past events found" />}
					{data && data.events.length > 0 && <EventCardGrid events={data.events} confirmAttendees />}
				</div>
			) : (
				<EmptyState heading="Please connect your wallet to view your events" actions={<ConnectWallet />} />
			)}
		</>
	)
}
MyPastEvents.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<Head>
				<title>My Upcoming Events | Cryptopia</title>
				<meta name="description" content="Manage your events and RSVPs" />
			</Head>
			<Dashboard page="events" isUpcoming={false}>
				{page}
			</Dashboard>
		</>
	)
}

export default MyPastEvents
