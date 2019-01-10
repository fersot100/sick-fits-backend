import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

// Extends app component from Next
// By default next would go into pages folder
// This allows us to modify it ourselves
class MyApp extends App {
	// getIntialProps is a Next.js lifecycle method
	// We define it below
	static async getInitialProps({Component, ctx}) {
		let pageProps = {};
		if (Component.getInitialProps) {
			// Crawls through every page we enter and detects the Queries and Mutations
			pageProps = await Component.getInitialProps(ctx);
		}
		// This exposes the query to the user
		pageProps.query = ctx.query;
		return { pageProps };
	}
	render() {
		const { Component, apollo, pageProps } = this.props;
		return (
			<Container>
				<ApolloProvider client={apollo}>
					<Page>
						<Component {...pageProps}/>
					</Page>
				</ApolloProvider>
			</Container>
		);
	}
}
// Analogous to connect method in react + redux
export default withData(MyApp);
