type EmptyState = {
	actions?: React.ReactNode
	heading: string
	subheading?: string
}

export default function EmptyState(props: EmptyState) {
	const { actions, heading, subheading } = props
	return (
		<div className="flex flex-col items-center py-8">
			<h2 className="mb-3 text-lg text-bold">{heading}</h2>
			<p className="mb-4 text-md text-black/60">{subheading}</p>
			{actions && <div className="flex justify-center gap-2">{actions}</div>}
		</div>
	)
}
