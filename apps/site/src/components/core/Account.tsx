import useCopyText from '@/hooks/useCopyText'
import { truncateEthAddress } from '@/utils/helpers'
import { Zorb } from './Zorb'

type AccountProps = {
	address: string
	copyable?: boolean
}

const Account = (props: AccountProps) => {
	const { address, copyable = false } = props
	const { handleCopy, hasCopied } = useCopyText()

	return (
		<>
			<Zorb address={address} size={24} />
			<span className="ml-2">{truncateEthAddress(address)}</span>
			{copyable && (
				<button
					className="ml-2 text-sm text-gray-500 hover:text-gray-700"
					onClick={() => {
						handleCopy(address)
					}}
				>
					{hasCopied ? <Check /> : <Copy />}
				</button>
			)}
		</>
	)
}

export default Account

const Check = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		strokeWidth="3"
		stroke="#21BF96"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M5 12l5 5l10 -10" />
		<title id="copied-address">Copied!</title>
	</svg>
)

const Copy = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		viewBox="0 0 24 24"
		strokeWidth="2"
		stroke="#666666"
		fill="none"
		strokeLinecap="round"
		strokeLinejoin="round"
		style={{ cursor: 'pointer' }}
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M15 3v4a1 1 0 0 0 1 1h4" />
		<path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
		<path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
		<title id="copy-address">Copy Address</title>
	</svg>
)
