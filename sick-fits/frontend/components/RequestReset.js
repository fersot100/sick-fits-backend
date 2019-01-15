import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const REQUEST_RESET_MUTATION = gql`
	mutation REQUEST_RESET_MUTATION($email: String!) {
		requestReset(email: $email) {
			message
		}
	}
`;

class RequestReset extends Component {
	state = {
		email: ''
	};
	// Handles change for any value
	handleChange = (e) => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	render() {
		return (
			<Mutation
				mutation={REQUEST_RESET_MUTATION}
				variables={this.state}
				refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
			>
				{(requestReset, { error, loading, called }) => (
					<Form
						method="post"
						onSubmit={async (e) => {
							e.preventDefault();
							const res = await requestReset();
							this.setState = { email: ''};
						}}
					>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Request a Password Reset</h2>
							<Error error={error} />
              {!error && !loading && called && <p>Success! Check your email for a link</p>}
							<label htmlFor="email">
								Email
								<input
									name="email"
									placeholder="email"
									value={this.state.email}
									onChange={this.handleChange}
								/>
							</label>
							<button type="submit">Submit</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}
export default RequestReset;
