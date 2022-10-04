import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import getRandomImage from '../utils/getRandomImage'
import { ethers } from 'ethers'
import { connectContract } from '../utils/connectContract'
import Alert from '../components/Alert'
import { useAuth } from '@/hooks/useAuth'
import ConnectWallet from '@/components/ConnectWallet'
import { APP_NAME } from '@/utils/consts'

export default function CreateEvent() {
	const { address, isConnected } = useAuth()
	const [success, setSuccess] = useState(null)
	const [message, setMessage] = useState(null)
	const [loading, setLoading] = useState(null)
	const [eventID, setEventID] = useState(null)
	const [eventName, setEventName] = useState('')
	const [eventDate, setEventDate] = useState('')
	const [eventTime, setEventTime] = useState('')
	const [maxCapacity, setMaxCapacity] = useState('')
	const [refund, setRefund] = useState('')
	const [eventLink, setEventLink] = useState('')
	const [eventDescription, setEventDescription] = useState('')

	async function handleSubmit(e) {
		e.preventDefault()
		console.log('Form submitted')
		const body = {
			name: eventName,
			description: eventDescription,
			link: eventLink,
			image: getRandomImage(),
		}

		try {
			const response = await fetch('/api/store-event-data', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			})
			if (response.status !== 200) {
				alert('Oops! Something went wrong. Please refresh and try again.')
			} else {
				console.log('Form successfully submitted!')
				let responseJSON = await response.json()
				await createEvent(responseJSON.cid)
			}
			// check response, if success is false, dont take them to success page
		} catch (error) {
			alert(`Oops! Something went wrong. Please refresh and try again. Error ${error}`)
		}
	}

	const createEvent = async cid => {
		try {
			const rsvpContract = connectContract()

			if (rsvpContract) {
				let deposit = ethers.utils.parseEther(refund)
				let eventDateAndTime = new Date(`${eventDate} ${eventTime}`)
				let eventTimestamp = eventDateAndTime.getTime()
				let eventDataCID = cid

				const txn = await rsvpContract.createNewEvent(eventTimestamp, deposit, maxCapacity, eventDataCID, {
					gasLimit: 900000,
				})
				setLoading(true)
				console.log('Minting...', txn.hash)
				let wait = await txn.wait()
				console.log('Minted -- ', txn.hash)
				setEventID(wait.events[0].args[0])
				setSuccess(true)
				setLoading(false)
				setMessage('Your event has been created successfully.')
			} else {
				console.log('Error getting contract.')
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		// disable scroll on <input> elements of type number
		document.addEventListener('wheel', event => {
			if (document.activeElement.type === 'number') {
				document.activeElement.blur()
			}
		})
	})

	return (
		<div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
			<Head>
				<title>Create your event | {APP_NAME}</title>
				<meta name="description" content="Create your virtual event on the blockchain" />
			</Head>
			<section className="relative py-12">
				{loading && (
					<Alert alertType={'loading'} alertBody={'Please wait'} triggerAlert={true} color={'white'} />
				)}
				{success && <Alert alertType={'success'} alertBody={message} triggerAlert={true} color={'palegreen'} />}
				{success === false && (
					<Alert alertType={'failed'} alertBody={message} triggerAlert={true} color={'palevioletred'} />
				)}
				{!success && (
					<h1 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-amber-600 sm:text-4xl md:text-5xl">
						Create your virtual event
					</h1>
				)}
				{address && !success && (
					<form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200">
						<div className="space-y-6 sm:space-y-5">
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<label
									htmlFor="eventname"
									className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
								>
									Event name
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										id="event-name"
										name="event-name"
										type="text"
										className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
										required
										value={eventName}
										onChange={e => setEventName(e.target.value)}
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<label
									htmlFor="date"
									className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
								>
									Date & time
									<p className="max-w-2xl mt-1 text-sm text-gray-400">Your event date and time</p>
								</label>
								<div className="flex flex-wrap gap-2 mt-1 sm:mt-0 sm:flex-nowrap">
									<div className="w-1/2">
										<input
											id="date"
											name="date"
											type="date"
											className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:max-w-xs sm:text-sm"
											required
											value={eventDate}
											onChange={e => setEventDate(e.target.value)}
										/>
									</div>
									<div className="w-1/2">
										<input
											id="time"
											name="time"
											type="time"
											className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:max-w-xs sm:text-sm"
											required
											value={eventTime}
											onChange={e => setEventTime(e.target.value)}
										/>
									</div>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<label
									htmlFor="max-capacity"
									className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
								>
									Max capacity
									<p className="max-w-2xl mt-1 text-sm text-gray-400">
										Limit the number of spots available for your event.
									</p>
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="number"
										name="max-capacity"
										id="max-capacity"
										min="1"
										placeholder="100"
										className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:max-w-xs sm:text-sm"
										value={maxCapacity}
										onChange={e => setMaxCapacity(e.target.value)}
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<label
									htmlFor="refundable-deposit"
									className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
								>
									Refundable deposit
									<p className="max-w-2xl mt-1 text-sm text-gray-400">
										Require a refundable deposit (in MATIC) to reserve one spot at your event
									</p>
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										type="number"
										name="refundable-deposit"
										id="refundable-deposit"
										min="0"
										step="any"
										inputMode="decimal"
										placeholder="0.00"
										className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:max-w-xs sm:text-sm"
										value={refund}
										onChange={e => setRefund(e.target.value)}
									/>
								</div>
							</div>

							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<label
									htmlFor="event-link"
									className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
								>
									Event link
									<p className="max-w-2xl mt-1 text-sm text-gray-400">
										The link for your virtual event
									</p>
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<input
										id="event-link"
										name="event-link"
										type="text"
										className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
										required
										value={eventLink}
										onChange={e => setEventLink(e.target.value)}
									/>
								</div>
							</div>
							<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
								<label
									htmlFor="about"
									className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
								>
									Event description
									<p className="mt-2 text-sm text-gray-400">
										Let people know what your event is about!
									</p>
								</label>
								<div className="mt-1 sm:mt-0 sm:col-span-2">
									<textarea
										id="about"
										name="about"
										rows={10}
										className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
										value={eventDescription}
										onChange={e => setEventDescription(e.target.value)}
									/>
								</div>
							</div>
						</div>
						<div className="pt-5">
							<div className="flex justify-end">
								<Link href="/">
									<a className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">
										Cancel
									</a>
								</Link>
								<button
									type="submit"
									className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-full shadow-sm bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
								>
									Create
								</button>
							</div>
						</div>
					</form>
				)}

				{!isConnected && (
					<section className="flex flex-col items-start py-8">
						<p className="mb-4">Please connect your wallet to create events.</p>
						<ConnectWallet />
					</section>
				)}

				{success && eventID && (
					<div>
						Success! Please wait a few minutes, then check out your event page{' '}
						<span className="font-bold">
							<Link href={`/event/${eventID}`}>here</Link>
						</span>
					</div>
				)}
			</section>
		</div>
	)
}
