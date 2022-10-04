import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from 'next-themes'
import Web3Provider from '@/components/Web3Provider'
import { ApolloProvider } from '@apollo/client'
import Layout from '@/components/Layout'
import client from '@/apollo-client'

const App = ({ Component, pageProps }) => {
	return (
		<ThemeProvider attribute="class">
			<ApolloProvider client={client}>
				<Web3Provider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</Web3Provider>
			</ApolloProvider>
		</ThemeProvider>
	)
}

export default App
