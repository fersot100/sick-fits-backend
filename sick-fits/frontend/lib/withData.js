import withApollo from 'next-with-apollo'; // Base apollo client package
import ApolloClient from 'apollo-boost'; // Official bundle of apollo extensions
import { endpoint } from '../config';
import { LOCAL_STATE_QUERY } from '../components/Cart';
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
		},
		clientState: {
			resolvers: {
				Mutation: {
					toggleCart(_, variables, { cache }) {
						const { cartOpen } = cache.readQuery({
							query: LOCAL_STATE_QUERY
						})
						const data = {
							data: { cartOpen: !cartOpen}
						}
						cache.writeData(data);
						return data;
					}
				}
			},
			defaults: {
				cartOpen: false
			}
		}
	});
}

export default withApollo(createClient);
