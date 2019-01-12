import withApollo from 'next-with-apollo'; // Base apollo client package
import ApolloClient from 'apollo-boost'; // Official bundle of apollo extensions
import { endpoint } from '../config';

// Define a function to create client
function createClient({ headers }) {
	// Encapsulate in HOC
	return new ApolloClient({
		// Assign the server link
		uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
		// Express Middleware
		request: (operation) => {
			operation.setContext({
				// Include credentials from cache
				fetchOptions: {
					credentials: 'include'
				},
				headers
			});
		}
	});
}

export default withApollo(createClient);
