import React from 'react'

type InputProps = {
	label: string
	name: string
	description?: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	value?: string | ReadonlyArray<string> | number | undefined
} & React.InputHTMLAttributes<HTMLInputElement>

const Input = ({ label, name, description, onChange, value }: InputProps) => {
	return (
		<>
			<label htmlFor={name} className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
				{label}
				<p className="max-w-2xl mt-1 text-sm text-gray-400">{description}</p>
			</label>
			<input
				id={name}
				name={name}
				type="text"
				className="block w-full max-w-lg border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
				required
				value={value}
				onChange={onChange}
			/>
		</>
	)
}

export default Input
