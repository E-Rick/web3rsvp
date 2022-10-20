import { Box, IconExclamation, IconUpload, Spinner } from 'degen'
import { Media } from './Media'
import { Props } from './MediaPicker'
import * as styles from './styles.css'

type MediaPreviewProps = Pick<Props, 'compact' | 'uploading'> & {
	fileName?: string
	fileType?: string
	hasError?: boolean
	previewUrl?: string
}

const MediaPreview = ({ compact, fileName, fileType, hasError, previewUrl, uploading }: MediaPreviewProps) => {
	let content: React.ReactNode
	if (uploading) content = <Spinner />
	else if (fileType && previewUrl) {
		content = <Media name={fileName} type={fileType} url={previewUrl} />
	} else if (hasError) content = <IconExclamation />
	else content = <IconUpload />

	return (
		<Box as="span" className={styles.preview({ compact })}>
			{content}
		</Box>
	)
}

export default MediaPreview
