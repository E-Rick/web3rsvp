import Dashboard from '../../components/Dashboard'
import { ReactElement, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useAccount } from 'wagmi'
import EventCard from '../../components/EventCard'
import ConnectWallet from '@/components/ConnectWallet'
import { NextPageWithLayout } from '../_app'
import { MY_UPCOMING_RSVPS } from '@/gql/queries/my-upcoming-rsvps'
import EmptyState from '@/components/EmptyState'

const MyUpcomingRSVPs: NextPageWithLayout = () => {
	const { address } = useAccount()

	const id = address?.toLowerCase() ?? ''
	const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime())
	const { loading, error, data } = useQuery(MY_UPCOMING_RSVPS, {
		variables: { id },
	})

	if (loading) return <p>Loading...</p>
	if (error) return <p>`Error! ${error.message}`</p>

	return (
		<>
			{address ? (
				<div>
					{data && !data.account && <p>No upcoming RSVPs found</p>}
					{data && data.account && (
						<ul
							role="list"
							className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
						>
							{data.account.rsvps.map(function (rsvp) {
								if (rsvp.event.eventTimestamp > currentTimestamp) {
									return (
										<li key={rsvp.event.id}>
											<EventCard
												id={rsvp.event.id}
												name={rsvp.event.name}
												eventTimestamp={rsvp.event.eventTimestamp}
												imageURL={rsvp.event.imageURL}
											/>
										</li>
									)
								}
							})}
						</ul>
					)}
				</div>
			) : (
				<EmptyState heading="Please connect your wallet to view your RSVPs" actions={<ConnectWallet />} />
			)}
		</>
	)
}

MyUpcomingRSVPs.getLayout = function getLayout(page: ReactElement) {
	return (
		<Dashboard page="rsvps" isUpcoming={true}>
			{page}
		</Dashboard>
	)
}
export default MyUpcomingRSVPs
