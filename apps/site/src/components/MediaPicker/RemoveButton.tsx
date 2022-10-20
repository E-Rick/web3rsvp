import { VisuallyHidden, IconClose, Box, Spinner, Button } from 'degen'
import { Props } from './MediaPicker'

type RemoveButtonProps = Pick<Props, 'cover' | 'uploading'> & {
	onClick(event: React.MouseEvent<HTMLButtonElement>): void
}

const RemoveButton = ({ cover, uploading, onClick }: RemoveButtonProps) => {
	const content = (
		<>
			<VisuallyHidden>Remove Media</VisuallyHidden>
			<IconClose />
		</>
	)
	if (cover)
		return (
			<Box
				alignItems="center"
				as="button"
				borderRadius="full"
				cursor="pointer"
				disabled={uploading}
				display="flex"
				height="12"
				justifyContent="center"
				width="12"
				onClick={onClick}
			>
				{uploading ? <Spinner /> : content}
			</Box>
		)

	return (
		<Button shape="circle" size="small" variant="transparent" onClick={onClick}>
			{content}
		</Button>
	)
}

export default RemoveButton
