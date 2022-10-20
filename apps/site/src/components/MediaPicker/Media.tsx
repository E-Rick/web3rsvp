import { BoxProps, Box } from 'degen'
import * as styles from './styles.css'

type MediaProps = {
	cover?: boolean
	name?: string
	type: string
	url: string
}

export const Media = ({ cover, name, type, url }: MediaProps) => {
	const boxProps: BoxProps = cover
		? { className: styles.cover }
		: {
				maxHeight: 'full',
				maxWidth: 'full',
				height: 'full',
				width: 'full',
		  }

	if (type.includes('image')) return <Box aspectRatio="1/1" alt={name} as="img" src={url} {...boxProps} />
	else if (type.includes('audio')) return <Box as="audio" controls autoPlay muted src={url} {...boxProps} />
	else if (type.includes('video')) {
		return (
			<Box
				as="video"
				preload="auto"
				autoPlay
				loop
				muted
				src={url}
				{...boxProps}
				marginX="auto"
				objectFit="contain"
			/>
		)
	}
	return null
}
