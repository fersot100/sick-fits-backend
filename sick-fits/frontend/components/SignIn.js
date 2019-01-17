import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGN_IN_MUTATION = gql`
	mutation SIGN_IN_MUTATION($email: String!, $password: String!) {
		signIn(email: $email, password: $password) {
			id
			email
			name
		}
	}
`;

class SignIn extends Component {
	state = {
		email: '',
		name: '',
		password: ''
	};
	// Handles change for any value
	handleChange = (e) => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
	};

	render() {
		return (
			<Mutation
				mutation={SIGN_IN_MUTATION}
				variables={this.state}
				refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
			>
				{(signIn, { error, loading }) => (
					<Form
						method="post"
						onSubmit={async (e) => {
							e.preventDefault();
							const res = await signIn();
							this.setState = { name: '', email: '', password: '' };
						}}
					>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Sign In To An Account</h2>
							<Error error={error} />
							<label htmlFor="email">
								Email
								<input
									name="email"
									placeholder="email"
									value={this.state.email}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor="password">
								Password
								<input
									name="password"
									placeholder="password"
									value={this.state.password}
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
export default SignIn;
