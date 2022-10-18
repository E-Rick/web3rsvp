import { useState, Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { XIcon, EmojiHappyIcon, ExclamationCircleIcon } from '@heroicons/react/outline'

const Alert = ({ alertType, alertBody, triggerAlert, color }) => {
	const [showAlert, setShowAlert] = useState(triggerAlert)

	return (
		<Transition
			show={showAlert}
			as={Fragment}
			enter="transform ease-out duration-300 transition"
			enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
			enterTo="translate-y-0 opacity-100 sm:-translate-x-2/4"
			leave="transition ease-in duration-100"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<div
				className="z-50 w-full max-w-lg p-3 overflow-hidden rounded-lg shadow-lg pointer-events-auto alert ring-1 ring-black ring-opacity-5"
				style={{ backgroundColor: color }}
			>
				<div className="flex">
					<div className="flex-shrink-0">
						{alertType === 'success' ? (
							<EmojiHappyIcon className="w-5 h-5" />
						) : (
							<ExclamationCircleIcon className="w-5 h-5" />
						)}
					</div>
					<div className="ml-2">
						<p className="text-sm font-medium text-gray-900">{alertBody}</p>
					</div>
					<div className="pl-3 ml-auto">
						<div className="mx-3.5 -my-1.5">
							<button
								type="button"
								className="inline-flex rounded-md p-1.5 text-gray-900 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600"
							>
								<span className="sr-only">Dismiss</span>
								<XIcon
									className="w-5 h-5"
									aria-hidden="true"
									onClick={() => {
										setShowAlert(!showAlert)
									}}
								/>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Transition>
	)
}
export default Alert
