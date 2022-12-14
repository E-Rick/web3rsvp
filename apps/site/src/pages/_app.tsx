import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'next-themes'
import Web3Provider from '@/components/Web3Provider'
import { ApolloProvider } from '@apollo/client'
import Layout from '@/components/Layout'
import client from '@/apollo-client'
import type { ReactElement, ReactNode } from 'react'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? (page => page)

	return (
		<ThemeProvider attribute="class">
			<ApolloProvider client={client}>
				<Web3Provider>
					<Layout>{getLayout(<Component {...pageProps} />)}</Layout>
				</Web3Provider>
			</ApolloProvider>
		</ThemeProvider>
	)
}
