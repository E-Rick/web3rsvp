import Link from 'next/link'
import Image from 'next/image'
import formatTimestamp from '../utils/formatTimestamp'

export default function EventCard({ id, name, eventTimestamp, imageURL }) {
	return (
		<div className="relative rounded-lg group clickable-card focus-within:ring-2 focus-within:ring-offset-2 focus-within:r ing-offset-gray-100 focus-within:ring-amber-500">
			<Link href={`/event/${id}`}>
				<a className="clickable-card__link"></a>
			</Link>
			<div className="relative block w-full overflow-hidden bg-gray-100 rounded-lg aspect-w-10 aspect-h-7 group-hover:opacity-75">
				{imageURL && <Image src={imageURL} alt="event image" layout="fill" />}
			</div>
			<p className="block mt-2 text-sm text-gray-500">{formatTimestamp(eventTimestamp)}</p>
			<p className="block text-base font-medium text-gray-900 dark:text-white">{name}</p>
		</div>
	)
}
