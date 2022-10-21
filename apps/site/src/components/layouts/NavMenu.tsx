import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import joinClassNames from '@/utils/joinClassNames'
import { truncateEthAddress } from '@/utils/helpers'
import { Zorb } from '../core/Zorb'
import { useAuth } from '@/hooks/useAuth'
import Button from '../core/Button'
import NextLink from '../core/NextLink'

export default function Navmenu() {
	const { address, disconnect, displayName } = useAuth()
	return (
		<Menu as="div" className="relative z-10 inline-block text-left">
			<Menu.Button as={Button} variant="transparent" icon={<Zorb size={24} address={address} />}>
				{truncateEthAddress(address)}
			</Menu.Button>
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
								<NextLink
									href={`/create-event`}
									className={joinClassNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Create event
								</NextLink>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<NextLink
									href={`/my-events/upcoming`}
									className={joinClassNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									My Events
								</NextLink>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<NextLink
									href={`/my-rsvps/upcoming`}
									className={joinClassNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									My RSVPs
								</NextLink>
							)}
						</Menu.Item>

						<Menu.Item>
							{({ active }) => (
								<NextLink
									href={`/`}
									onClick={() => disconnect()}
									className={joinClassNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm cursor-pointer'
									)}
								>
									Log Out
								</NextLink>
							)}
						</Menu.Item>
					</div>
				</Menu.Items>
			</Transition>
		</Menu>
	)
}
