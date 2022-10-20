import Head from 'next/head'
import { TicketIcon, UsersIcon, LinkIcon } from '@heroicons/react/outline'

import Image from 'next/image'

import { gql } from '@apollo/client'

import { useState } from 'react'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import client from '@/apollo-client'
import Alert from '@/components/core/Alert'
import { connectContract } from '@/utils/connectContract'
import formatTimestamp from '@/utils/formatTimestamp'
import ConnectWallet from '@/components/ConnectWallet'
import { Zorb } from '@/components/core/Zorb'
import { truncateEthAddress } from '../../utils/helpers'

function Event({ event }) {
	console.log('EVENT:', event)

	const { address } = useAccount()
	const [success, setSuccess] = useState(null)
	const [message, setMessage] = useState(null)
	const [loading, setLoading] = useState(null)
	const [currentTimestamp, setEventTimestamp] = useState(new Date().getTime())

	function checkIfAlreadyRSVPed() {
		if (address) {
			for (let i = 0; i < event.rsvps.length; i++) {
				const thisAccount = address.toLowerCase()
				if (event.rsvps[i].attendee.id.toLowerCase() == thisAccount) {
					return true
				}
			}
		}
		return false
	}

	const newRSVP = async () => {
		try {
			const rsvpContract = connectContract()
			if (rsvpContract) {
				const txn = await rsvpContract.createNewRSVP(event.id, {
					value: event.deposit,
					gasLimit: 300000,
				})
				setLoading(true)
				console.log('Minting...', txn.hash)

				await txn.wait()
				console.log('Minted -- ', txn.hash)
				setSuccess(true)
				setLoading(false)
				setMessage('Your RSVP has been created successfully.')
			} else {
				console.log('Error getting contract.')
			}
		} catch (error) {
			setSuccess(false)
			setMessage('Error!')
			setLoading(false)
			console.log(error)
		}
	}

	return (
		<div className="w-full px-4 sm:px-6 lg:px-8">
			<Head>
				<title> {event.name} | Cryptopia</title>
				<meta name="description" content={event.name} />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<section className="py-12">
				{/* Alerts */}
				{loading && (
					<Alert alertType={'loading'} alertBody={'Please wait'} triggerAlert={true} color={'white'} />
				)}

				{success && <Alert alertType={'success'} alertBody={message} triggerAlert={true} color={'palegreen'} />}

				{success === false && (
					<Alert alertType={'failed'} alertBody={message} triggerAlert={true} color={'palevioletred'} />
				)}
				{/* Event Information */}
				<h6 className="mb-2 text-gray-500">{formatTimestamp(event.eventTimestamp)}</h6>
				<h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl lg:mb-12">
					{event.name}
				</h1>
				<div className="flex flex-wrap-reverse w-full lg:flex-nowrap">
					<div className="flex flex-col flex-1 flex-grow w-full gap-4 pr-0 lg:pr-24 xl:pr-32">
						<div className="relative w-full overflow-hidden rounded-lg shadow-lg ">
							<div className="w-full overflow-hidden bg-gray-100 rounded-lg aspect-w-16 aspect-h-16 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-amber-500">
								{event.imageURL && <Image src={event.imageURL} alt="event image" layout="fill" />}
							</div>
						</div>
						<p>{event.description}</p>
					</div>
					<div className="flex flex-col max-w-xs gap-4 mb-6 lg:mb-0">
						{event.eventTimestamp > currentTimestamp ? (
							address ? (
								checkIfAlreadyRSVPed() ? (
									<>
										<span className="w-full px-6 py-3 text-base font-medium text-center text-teal-800 bg-teal-100 rounded-full">
											You have RSVPed! 🙌
										</span>
										<div className="flex item-center">
											<LinkIcon className="w-6 mr-2 text-blue-800" />
											<a
												className="text-blue-800 truncate dark:text-blue-200 hover:underline"
												href={'https://' + event.link}
												target="_blank"
											>
												{event.link}
											</a>
										</div>
									</>
								) : (
									<button
										type="button"
										className="items-center w-full px-6 py-3 text-base font-medium text-blue-700 bg-blue-100 border border-transparent rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
										onClick={newRSVP}
									>
										RSVP for {ethers.utils.formatEther(event.deposit)} MATIC
									</button>
								)
							) : (
								<ConnectWallet />
							)
						) : (
							<span className="w-full px-6 py-3 text-base font-medium text-center border-2 border-gray-200 rounded-full">
								Event has ended
							</span>
						)}
						<div className="flex item-center">
							<UsersIcon className="w-6 mr-2" />
							<span className="truncate">
								{event.totalRSVPs}/{event.maxCapacity} attending
							</span>
						</div>
						<div className="flex item-center">
							<TicketIcon className="w-6 mr-2" />
							<span className="truncate">1 RSVP per wallet</span>
						</div>
						<div className="flex items-center gap-2">
							{/* <EmojiHappyIcon className="w-10 mr-2" /> */}
							<Zorb address={event.eventOwner} size={32} />
							<span className="truncate">
								Hosted by{' '}
								<a
									className="text-blue-800 truncate hover:underline"
									href={`${process.env.NEXT_PUBLIC_TESTNET_EXPLORER_URL}address/${event.eventOwner}`}
									target="_blank"
									rel="noreferrer"
								>
									<span>{truncateEthAddress(event.eventOwner)}</span>
								</a>
							</span>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}

export default Event

export async function getServerSideProps(context) {
	const { id } = context.params

	const { data } = await client.query({
		query: gql`
			query Event($id: String!) {
				event(id: $id) {
					id
					eventID
					name
					description
					link
					eventOwner
					eventTimestamp
					maxCapacity
					deposit
					totalRSVPs
					totalConfirmedAttendees
					imageURL
					rsvps {
						id
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
