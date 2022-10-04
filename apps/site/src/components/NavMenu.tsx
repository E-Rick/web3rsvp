import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import joinClassNames from '@/utils/joinClassNames'
import { truncateEthAddress } from '@/utils/helpers'
import { Zorb } from './Zorb'
import { useAuth } from '@/hooks/useAuth'

export default function Navmenu() {
	const { address, disconnect, displayName } = useAuth()
	return (
		<Menu as="div" className="relative z-10 inline-block text-left">
			<div>
				<Menu.Button className="inline-flex items-center px-2.5 py-2 rounded-md text-sm font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/10 w-32 cursor-pointer">
					<Zorb size={24} address={address} />
					<span className="pl-1 overflow-hidden text-black dark:text-white/90">
						{truncateEthAddress(displayName)}
					</span>
				</Menu.Button>
			</div>
			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href={`/create-event`}
									className={joinClassNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Create event
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href={`/my-rsvps/upcoming`}
									className={joinClassNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									My RSVPs
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href={`/my-events/upcoming`}
									className={joinClassNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									My Events
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									onClick={() => disconnect()}
									className={joinClassNames(
										address ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm cursor-pointer'
									)}
								>
									Log Out
								</a>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}
