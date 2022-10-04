import Dashboard from '../../components/Dashboard'
import { ReactElement, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useAccount } from 'wagmi'
import EventCard from '../../components/EventCard'
import ConnectWallet from '@/components/ConnectWallet'
import { NextPageWithLayout } from '../_app'
import { MY_PAST_RSVPS } from '@/gql/queries/my-past-rsvps'

const MyPastRSVPs: NextPageWithLayout = () => {
	const { address, isConnected } = useAccount()

	const id = address?.toLowerCase() ?? ''
	const [currentTimestamp] = useState(new Date().getTime())
	const { loading, error, data } = useQuery(MY_PAST_RSVPS, {
		variables: { id },
	})

	if (loading) return <p>Loading...</p>
	if (error) return <p>`Error! ${error.message}`</p>
	if (data) console.log(data)

	return (
		<>
			{isConnected ? (
				<div>
					{data && !data.account && <p>No past RSVPs found</p>}
					{data && data.account && (
						<ul
							role="list"
							className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
						>
							{data.account.rsvps.map(function (rsvp) {
								if (rsvp.event.eventTimestamp < currentTimestamp) {
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
				<div className="flex flex-col items-center py-8">
					<p className="mb-4">Please connect your wallet to view your rsvps</p>
					<ConnectWallet show="not_connected" />
				</div>
			)}
		</>
	)
}

MyPastRSVPs.getLayout = function getLayout(page: ReactElement) {
	return (
		<Dashboard page="rsvps" isUpcoming={false}>
			{page}
		</Dashboard>
	)
}

export default MyPastRSVPs
