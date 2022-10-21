import Head from 'next/head'
import { useState, ReactElement } from 'react'
import { gql } from '@apollo/client'
import { useAuth } from '@/hooks/useAuth'
import client from '@/apollo-client'
import Alert from '@/components/core/Alert'
import { connectContract } from '@/utils/connectContract'
import formatTimestamp from '@/utils/formatTimestamp'
import useHasMounted from '../../../hooks/useHasMounted'
import NextLinks from '@/components/core/NextLink'
import Account from '@/components/core/Account'
import EmptyState from '@/components/EmptyState'
import ConnectWallet from '@/components/core/ConnectWallet'
import Dashboard from '@/components/layouts/DashboardLayout'
import type { NextPageWithLayout } from '../../_app'
import { InferGetServerSidePropsType } from 'next'

const PastEvent: NextPageWithLayout = ({ event }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
	const { address, isConnected } = useAuth()
	const mounted = useHasMounted()
	const [isAllConfirmed, setIsAllConfirmed] = useState(false)
	const [success, setSuccess] = useState(null)
	const [message, setMessage] = useState(null)
	const [loading, setLoading] = useState(null)

	const confirmAttendee = async attendee => {
		try {
			const rsvpContract = connectContract()

			if (rsvpContract) {
				const txn = await rsvpContract.confirmAttendee(event.id, attendee)
				setLoading(true)
				console.log('Minting...', txn.hash)

				await txn.wait()
				console.log('Minted -- ', txn.hash)
				setSuccess(true)
				setLoading(false)
				setMessage('Attendance has been confirmed.')
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			setSuccess(false)
			// setMessage(
			//   `Error: ${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}tx/${txn.hash}`
			// );
			setMessage('Error!')
			setLoading(false)
			console.log(error)
		}
	}

	const confirmAllAttendees = async () => {
		console.log('confirmAllAttendees')
		try {
			const rsvpContract = connectContract()

			if (rsvpContract) {
				console.log('contract exists')
				const txn = await rsvpContract.confirmAllAttendees(event.id, {
					gasLimit: 300000,
				})
				console.log('await txn')
				setLoading(true)
				console.log('Mining...', txn.hash)

				await txn.wait()
				console.log('Mined -- ', txn.hash)
				setSuccess(true)
				setLoading(false)
				setMessage('All attendees confirmed successfully.')
			} else {
				console.log("Ethereum object doesn't exist!")
			}
		} catch (error) {
			setSuccess(false)
			// setMessage(
			//   `Error: ${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}tx/${txn.hash}`
			// );
			setMessage('Error!')
			setLoading(false)
			console.log(error)
		}
	}

	function checkIfConfirmed(event, address): boolean {
		for (let i = 0; i < event.confirmedAttendees.length; i++) {
			let confirmedAddress = event.confirmedAttendees[i].attendee.id
			console.log('confirmedAddress', confirmedAddress)
			if (confirmedAddress.toLowerCase() === address.toLowerCase()) {
				return true
			}
		}
		return false
	}

	if (!mounted) {
		return null
	}

	return (
		<>
			<div className="flex flex-wrap w-full py-4">
				<div className="w-full sm:w-10/12 sm:pl-8">
					{loading && (
						<Alert alertType={'loading'} alertBody={'Please wait'} triggerAlert={true} color={'white'} />
					)}
					{success && (
						<Alert alertType={'success'} alertBody={message} triggerAlert={true} color={'palegreen'} />
					)}
					{success === false && (
						<Alert alertType={'failed'} alertBody={message} triggerAlert={true} color={'palevioletred'} />
					)}
					{isConnected ? (
						address.toLowerCase() === event.eventOwner.toLowerCase() ? (
							<section>
								<NextLinks href="/my-events/past">
									<a className="text-sm text-amber-800 hover:underline">&#8592; Back</a>
								</NextLinks>
								<h6 className="mt-4 mb-2 text-sm">{formatTimestamp(event.eventTimestamp)}</h6>
								<h1 className="mb-8 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
									{event.name}
								</h1>
								<div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
									<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
										<div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
											<table className="min-w-full divide-y divide-gray-300">
												<thead className="bg-gray-50">
													<tr>
														<th
															scope="col"
															className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
														>
															Attendee
														</th>
														<th scope="col" className="text-right py-3.5 pl-3 pr-4 sm:pr-6">
															<button
																type="button"
																className="items-center px-4 py-2 text-sm font-medium border border-transparent rounded-full text-amber-800 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
																onClick={confirmAllAttendees}
															>
																Confirm All
															</button>
														</th>
													</tr>
												</thead>
												<tbody className="bg-white divide-y divide-gray-200">
													{event.rsvps.map(rsvp => (
														<tr key={rsvp.attendee.id}>
															<td className="flex items-center py-4 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap sm:pl-6">
																<Account address={rsvp.attendee.id} copyable />
															</td>
															<td className="relative py-4 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-6">
																{checkIfConfirmed(event, rsvp.attendee.id) ? (
																	<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
																		Confirmed
																	</span>
																) : (
																	<button
																		type="button"
																		className="text-amber-800 hover:text-amber-900"
																		onClick={() =>
																			confirmAttendee(rsvp.attendee.id)
																		}
																	>
																		Confirm attendee
																	</button>
																)}
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</section>
						) : (
							<p>You do not have permission to manage this event.</p>
						)
					) : (
						<EmptyState heading="Connect your wallet to view this event" actions={<ConnectWallet />} />
					)}
				</div>
			</div>
		</>
	)
}

PastEvent.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<Head>
				<title>My Dashboard | Cryptopia</title>
				<meta name="description" content="Manage your events and RSVPs" />
			</Head>
			<Dashboard page="events" isUpcoming={false}>
				{page}
			</Dashboard>
		</>
	)
}

export default PastEvent

export async function getServerSideProps(context) {
	const { id } = context.params

	const { data } = await client.query({
		query: gql`
			query Event($id: String!) {
				event(id: $id) {
					id
					eventID
					name
					eventOwner
					eventTimestamp
					maxCapacity
					totalRSVPs
					totalConfirmedAttendees
					rsvps {
						id
						attendee {
							id
						}
					}
					confirmedAttendees {
						attendee {
							id
						}
					}
				}
			}
		`,
		variables: {
			id: id,
		},
	})

	return {
		props: {
			event: data.event,
		},
	}
}
