import { Tag } from 'degen'
import { Props } from './MediaPicker'

type MediaTagProps = Pick<Props, 'compact' | 'error' | 'maxSize' | 'uploadProgress' | 'uploaded' | 'uploading'>

const MediaTag = ({ compact, error, maxSize, uploadProgress, uploaded, uploading }: MediaTagProps) => {
	let statusProps: Parameters<typeof Tag>[0] | undefined
	if (uploading)
		statusProps = {
			tone: 'accent',
			...(uploadProgress
				? { label: 'Uploading', children: `${uploadProgress * 100}%` }
				: { children: 'Uploading' }),
		}
	else if (uploaded) statusProps = { children: 'Success', tone: 'green' }
	else if (error)
		statusProps = {
			tone: 'red',
			...(typeof error === 'string' ? { label: 'Error', children: error } : { children: 'Error' }),
		}
	else if (maxSize !== undefined)
		statusProps = {
			label: 'Maximum size',
			children: `${maxSize} MB`,
		}

	if (!statusProps) return null
	return <Tag as="span" size={compact ? 'small' : 'medium'} {...statusProps} />
}

export default MediaTag
