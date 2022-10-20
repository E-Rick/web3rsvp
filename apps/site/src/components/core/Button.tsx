import joinClassNames from '@/utils/joinClassNames'
import React from 'react'

type ButtonProps = {
	children: React.ReactNode
	onClick?: () => void
	className?: string
	variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'transparent'
	size?: 'sm' | 'md' | 'lg'
	disabled?: boolean
	type?: 'button' | 'submit' | 'reset'
	icon?: React.ReactNode
}

const Button = (props: ButtonProps) => {
	const { children, onClick, className, variant = 'primary', size = 'md', disabled, type = 'button', icon } = props

	const buttonClasses = {
		primary: 'bg-amber-500 hover:bg-amber-600 text-white',
		secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
		tertiary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300',
		danger: ' bg-red-100 text-red-800 dark:bg-red-900/10 ',
		transparent:
			'bg-transparent text-gray-800 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-200 dark:hover:text-gray-100 dark:hover:bg-amber-800/20',
	}

	return (
		<button
			onClick={onClick}
			className={joinClassNames(
				buttonClasses[variant],
				className,
				'inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md shadow-sm text-sm font-medium cursor-pointer w-fit'
			)}
		>
			{icon}
			{children}
		</button>
	)
}

export default Button
