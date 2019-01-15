import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNUP_MUTATION = gql`
	mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
		signUp(email: $email, name: $name, password: $password) {
			id
			email
			name
		}
	}
`;

class SignUp extends Component {
	state = {
		email: '',
		name: '',
		password: ''
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
				mutation={SIGNUP_MUTATION}
				variables={this.state}
				refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
			>
				{(signUp, { error, loading }) => (
					<Form
						method="post"
						onSubmit={async (e) => {
							e.preventDefault();
							const res = await signUp();
							this.setState = { name: '', email: '', password: '' };
						}}
					>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Sign Up for An Account</h2>
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
							<label htmlFor="name">
								Name
								<input
									name="name"
									placeholder="name"
									value={this.state.name}
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
export default SignUp;
