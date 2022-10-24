import Button from '@/components/core/Button'
import ConnectWallet from '@/components/core/ConnectWallet'
import Input from '@/components/core/Input'
import NextLinks from '@/components/core/NextLink'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME } from '@/utils/consts'
import formatTimestamp from '@/utils/formatTimestamp'
import { ethers } from 'ethers'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import Alert from '../components/core/Alert'
import useHasMounted from '../hooks/useHasMounted'
import { connectContract } from '../utils/connectContract'
import { ChangeEvent, MouseEvent, useState } from 'react'
export default function CreateEvent() {
	const { address, isConnected } = useAuth()
	const mounted = useHasMounted()
	const [success, setSuccess] = useState(null)
	const [message, setMessage] = useState(null)
	const [loading, setLoading] = useState(null)
	const [eventID, setEventID] = useState(null)
	const [eventName, setEventName] = useState('')
	const [eventDate, setEventDate] = useState('')
	const [eventTime, setEventTime] = useState('')
	const [eventImage, setEventImage] = useState({})
	const [maxCapacity, setMaxCapacity] = useState('')
	const [cid, setCID] = useState('')
	const [refund, setRefund] = useState('')
	const [eventLink, setEventLink] = useState('')
	const [eventDescription, setEventDescription] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	let eventDateAndTime = new Date(`${eventDate} ${eventTime}`)
	let eventTimestamp = eventDateAndTime.getTime()

	async function handleSubmit(e) {
		e.preventDefault()
		console.log('Form submitted')
		const body = {
			name: eventName,
			description: eventDescription,
			link: eventLink,
			image: cid,
		}
		try {
			console.log('body submitting', body)
			const response = await fetch('/api/store-event-data', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			})
			if (response.status !== 200) {
				alert('Oops! Something went wrong. Please refresh and try again.')
			} else {
				console.log('Form successfully submitted!')
				let { data } = await response.json()
				console.log('responseJSON', data)
				await createEvent(data.cid)
			}
			// check response, if success is false, dont take them to success page
		} catch (error) {
			alert(`Oops! Something went wrong. Please refresh and try again. Error ${error}`)
		}
	}

	const createEvent = async cid => {
		try {
			const rsvpContract = connectContract()
			console.log(rsvpContract)
			if (rsvpContract) {
				let deposit = ethers.utils.parseEther(refund)
				let eventDateAndTime = new Date(`${eventDate} ${eventTime}`)
				let eventTimestamp = eventDateAndTime.getTime()
				let eventDataCID = cid
				console.log('eventDataCID', eventDataCID)
				console.log('eventTimestamp', eventTimestamp)
				console.log('deposit', deposit)
				console.log('maxCapacity', maxCapacity)
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

	const handleFileUpload = async e => {
		// set loading state
		// show the pinning and CID for the image

		const file = e.target.files[0]
		console.log(file)
		setEventImage(file)
	}

	// const [type, setType] = useState('')
	// const [files, setFiles] = useState({})

	// const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement> | File) => {
	// 	if (e instanceof File) {
	// 		const previewUrl = URL.createObjectURL(e)
	// 		setPreviewUrl(previewUrl)
	// 		setType(e.type)
	// 		setFiles({ ...e, name: e.name.replace(/\.[^/.]+$/, ''), type: e.type, previewUrl: previewUrl })
	// 	} else {
	// 		const file = e.target.files[0]
	// 		const previewUrl = URL.createObjectURL(file)
	// 		setPreviewUrl(previewUrl)

	// 		setType(file.type)
	// 		setFiles({ ...file, name: file.name.replace(/\.[^/.]+$/, ''), type: file.type, previewUrl: previewUrl })

	// 		const formData = new FormData()
	// 		formData.append('file', e)
	// 		console.log('formData', formData)
	// 		const response = await fetch('/api/upload', {
	// 			method: 'POST',
	// 			body: formData,
	// 		})
	// 		console.log(response)
	// 	}
	// }

	const onFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
		const fileInput = e.target

		if (!fileInput.files) {
			alert('No file was chosen')
			return
		}

		if (!fileInput.files || fileInput.files.length === 0) {
			alert('Files list is empty')
			return
		}

		const file = fileInput.files[0]

		/** File validation */
		if (!file.type.startsWith('image')) {
			alert('Please select a valide image')
			return
		}

		/** Setting file state */
		setFile(file) // we will use the file state, to send it later to the server
		console.log(file)
		setPreviewUrl(URL.createObjectURL(file)) // we will use this to show the preview of the image

		/** Reset file input */
		e.currentTarget.type = 'text'
		e.currentTarget.type = 'file'
	}

	const onCancelFile = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()
		if (!previewUrl && !file) {
			return
		}
		setFile(null)
		setPreviewUrl(null)
	}

	const onUploadFile = async (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault()

		if (!file) {
			return
		}

		try {
			var formData = new FormData()

			formData.append('media', file)

			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			const { data, error } = await res.json()
			setCID('ipfs://' + data.cid)
			console.log('contentURI', 'ipfs://' + data.cid)
			if (error || !data) {
				alert(error || 'Sorry! something went wrong in api call.')
				return
			}

			console.log('File was uploaded successfylly:', data)
		} catch (error) {
			console.error(error)
			alert('Sorry! something went wrong.')
		}
	}

	if (!mounted) return null

	return (
		<div className="max-w-5xl px-4 py-4 mx-auto text-black dark:text-white sm:px-6 lg:px-8">
			<Head>
				<title>Create your event | {APP_NAME}</title>
				<meta name="description" content="Create your virtual event on the blockchain" />
			</Head>
			<div className="flex flex-col-reverse max-w-6xl gap-8 sm:grid sm:grid-cols-2">
				<section className="relative sm:py-12">
					{loading && (
						<Alert alertType={'loading'} alertBody={'Please wait'} triggerAlert={true} color={'white'} />
					)}
					{success && (
						<Alert alertType={'success'} alertBody={message} triggerAlert={true} color={'palegreen'} />
					)}
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
								{/* Date & Time */}
								<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
									<label
										htmlFor="date"
										className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
									>
										Date & time
										<p className="max-w-2xl mt-1 text-sm text-gray-400">Your event date and time</p>
									</label>
									<div className="flex flex-wrap gap-2 mt-1 sm:mt-0 sm:flex-nowrap">
										<div className="w-full">
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
										<div className="w-full">
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
								{/* Event Image */}
								<div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
									<label
										htmlFor="event-image"
										className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
									>
										Event Image
										<p className="max-w-2xl mt-1 text-sm text-gray-400">The image for your event</p>
									</label>
									{/* <div className="mt-1 sm:mt-0 sm:col-span-2">
										<input
											className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm cursor-pointer focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
											type="file"
											id="event-image"
											name="event-image"
											required
											onChange={handleFileChange}
										/>
									</div> */}
								</div>
								<div className="flex flex-col md:flex-row gap-1.5 md:py-4">
									<div className="flex-grow">
										{previewUrl ? (
											<div className="mx-auto w-80">
												<Image
													alt="file uploader preview"
													objectFit="cover"
													src={previewUrl}
													width={320}
													height={218}
													layout="fixed"
												/>
											</div>
										) : (
											<label className="flex flex-col items-center justify-center h-full py-3 transition-colors duration-150 cursor-pointer hover:text-gray-600">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="w-14 h-14"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={2}
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
													/>
												</svg>
												<strong className="text-sm font-medium">Select an image</strong>
												<input
													className="block w-0 h-0"
													name="file"
													type="file"
													onChange={onFileUploadChange}
												/>
											</label>
										)}
									</div>
									<div className="flex mt-4 md:mt-0 md:flex-col justify-center gap-1.5">
										<button
											disabled={!previewUrl}
											onClick={onCancelFile}
											className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
										>
											Cancel file
										</button>
										<button
											disabled={!previewUrl}
											onClick={onUploadFile}
											className="w-1/2 px-4 py-3 text-sm font-medium text-white transition-colors duration-300 bg-gray-700 rounded-sm md:w-auto md:text-base disabled:bg-gray-400 hover:bg-gray-600"
										>
											Upload file
										</button>
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
								{/* Event Link */}
								<Input
									name="event-link"
									description="The link for your virtual event"
									label="Event link"
									value={eventLink}
									onChange={e => setEventLink(e.target.value)}
									required
									type="text"
								/>

								<div className="sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
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
									<Button
										variant="tertiary"
										className='px-4 py-2 ml-3 font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"'
									>
										<NextLinks href="/">Cancel</NextLinks>
									</Button>
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
				<div
					id="preview-card"
					className="static grid overflow-hidden rounded-md shadow-sm h-fit sm:sticky top-10"
				>
					<div className="relative w-full">
						<div className="h-full aspect-1">
							{previewUrl && (
								<img
									src={previewUrl ?? ''}
									alt={eventName}
									className="w-full h-full max-w-full max-h-full aspect-1"
								/>
							)}
							{/* // <Media url={previewUrl} type={type} /> */}
						</div>
					</div>

					<div id="preview-bottom" className="hidden gap-2 p-4 sm:flex md:flex-col md:relative">
						<div className="text-3xl text-bold">{eventName}</div>
						<p className="block mt-2 text-sm text-gray-500">
							{eventDate && eventTime && formatTimestamp(eventTimestamp)}
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
