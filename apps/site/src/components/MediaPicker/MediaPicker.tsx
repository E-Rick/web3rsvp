import { FileInput, Box, VisuallyHidden, Tag } from 'degen'
import { FileInputProps } from 'degen/dist/types/components/FileInput'
import * as React from 'react'
import { Media } from './Media'
import MediaPreview from './MediaPreview'
import MediaTag from './MediaTag'
import RemoveButton from './RemoveButton'
import * as styles from './styles.css'

type Image = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif' | 'image/jpeg, image/png, image/webp, image/gif'
type Audio = 'audio/wav' | 'audio/mp3' | 'audio/wave' | 'audio/wav, audio/mp3, audio/wave, audio/mpeg'
type Video = 'video/mp4' | 'video/mov' | 'video/mp4, video/mov'
export type Accept = Image | Audio | Video | `${Image}, ${Audio}, ${Video}`

type BaseProps = {
	accept?: Accept
	autoFocus?: FileInputProps['autoFocus']
	defaultValue?: { name?: string; type: string; url: string }
	disabled?: FileInputProps['disabled']
	error?: boolean | React.ReactNode
	id?: FileInputProps['id']
	label: React.ReactNode
	/** Size in megabytes */
	maxSize?: number
	name?: string
	required?: FileInputProps['required']
	tabIndex?: FileInputProps['tabIndex']
	uploaded?: boolean
	uploading?: boolean
	uploadProgress?: number
	onBlur?: FileInputProps['onBlur']
	onError?(error: string): void
	onChange?: FileInputProps['onChange']
	onFocus?: FileInputProps['onFocus']
	onReset?: FileInputProps['onReset']
}

type WithoutCompact = {
	compact?: never
	cover?: boolean
}

type WithCompact = {
	/** Show smaller input */
	compact?: boolean
	cover?: never
}

export type Props = BaseProps & (WithCompact | WithoutCompact)

export const MediaPicker = ({
	accept = 'image/jpeg, image/png, image/webp, image/gif, audio/wav, audio/mp3, audio/wave, audio/mpeg, video/mp4',
	autoFocus,
	compact,
	cover,
	defaultValue,
	disabled,
	error,
	id,
	label,
	maxSize = 5,
	name,
	required,
	tabIndex,
	uploaded,
	uploading,
	uploadProgress,
	onBlur,
	onChange,
	onError,
	onFocus,
	onReset,
}: Props) => {
	const hasError = error ? true : undefined
	return (
		<FileInput
			accept={accept}
			autoFocus={autoFocus}
			defaultValue={defaultValue}
			id={id}
			maxSize={maxSize}
			name={name}
			tabIndex={tabIndex}
			onBlur={onBlur}
			onChange={onChange}
			onError={onError}
			onFocus={onFocus}
			onReset={onReset}
		>
			{context => (
				<Box position="relative">
					<Box
						className={styles.root({
							disabled,
							droppable: context.droppable,
							focused: context.focused,
						})}
					>
						<Box className={styles.label({ compact, disabled })}>
							<MediaPreview
								compact={compact}
								fileName={context.name}
								fileType={context.type}
								hasError={hasError}
								previewUrl={context.previewUrl}
								uploading={uploading}
							/>
							<Box as="span" className={styles.content({ compact })}>
								<Box
									as="span"
									color={context.file ? 'text' : 'textSecondary'}
									fontSize={compact ? 'base' : 'large'}
									fontWeight="semiBold"
									wordBreak="break-word"
								>
									{!cover && context.file ? (
										context.file.name
									) : (
										<>
											{label} {required && <VisuallyHidden as="span">(required)</VisuallyHidden>}
										</>
									)}
								</Box>
								<MediaTag
									compact={compact}
									error={error}
									maxSize={maxSize}
									uploadProgress={uploadProgress}
									uploaded={uploaded}
									uploading={uploading}
								/>
							</Box>
						</Box>
						{cover && context.type && context.previewUrl && (
							<Box display="flex" inset="0" justifyContent="center" position="absolute">
								<Media cover name={context.name} type={context.type} url={context.previewUrl} />
							</Box>
						)}
					</Box>

					{context.type && (
						<Box position="absolute" right="2" top="2">
							<RemoveButton cover={cover} uploading={uploading} onClick={context.reset} />
						</Box>
					)}
				</Box>
			)}
		</FileInput>
	)
}

MediaPicker.displayName = 'MediaPicker'
