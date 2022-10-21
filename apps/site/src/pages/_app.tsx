import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
// import { ThemeProvider } from 'next-themes'
import { ApolloProvider } from '@apollo/client'
import Layout from '@/components/layouts/Layout'
import client from '@/apollo-client'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { useAnalytics } from '../lib/useAnalytics'

const Web3Provider = dynamic(() => import('@/components/Web3Provider'), {
	ssr: false,
})

export type NextPageWithLayout<PageProps = Record<string, unknown>, InitialProps = PageProps> = NextPage<
	PageProps,
	InitialProps
> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page: ReactNode) => page)

	// Initialize fathom analytics
	useAnalytics()

	return (
		// <ThemeProvider attribute="class">
		<ApolloProvider client={client}>
			<Web3Provider>
				<Layout>{getLayout(<Component {...pageProps} />)}</Layout>
			</Web3Provider>
		</ApolloProvider>
		// </ThemeProvider>
	)
}
