import React, { ReactNode } from 'react'
import NextLink from 'next/link'

type LinkProps = {
	href: string
	children: ReactNode
}

// Abstraction over NextLink
const NextLinks = ({ href, children, ...props }: LinkProps, ref) => {
	if (href.startsWith('http')) {
		return (
			<a className="truncate text-amber-800 hover:underline" href={href} target="_blank" rel="noreferrer">
				{children}
			</a>
		)
	}

	return (
		<NextLink href={href} passHref ref={ref}>
			<a {...props}>{children}</a>
		</NextLink>
	)
}

export default NextLinks
