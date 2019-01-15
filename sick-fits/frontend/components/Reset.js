import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import PropTypes from 'prop-types'

const RESET_MUTATION = gql`
	mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
		resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
			message
		}
	}
`;

class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired
  }
  state = {
    password: '',
    confirmPassword: ''
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
				mutation={RESET_MUTATION}
				variables={{
          resetToken: this.props.resetToken,
          password: this.state.password,
          confirmPassword: this.state.confirmPassword
        }}
				refetchQueries={[ { query: CURRENT_USER_QUERY } ]}
			>
				{(resetMutation, { error, loading, called }) => (
					<Form
						method="post"
						onSubmit={async (e) => {
							e.preventDefault();
							const res = await resetMutation();
							this.setState = { email: ''};
						}}
					>
						<fieldset disabled={loading} aria-busy={loading}>
							<h2>Reset Your Password {this.props.resetToken}</h2>
							<Error error={error} />
              {!error && !loading && called && <p>Success! Check your email for a link</p>}
							<label htmlFor="password">
								Password
								<input
                  name="password"
                  type="password"
									placeholder="password"
									value={this.state.password}
									onChange={this.handleChange}
								/>
							</label>
              <label htmlFor="confirmPassword">
								Confirm Your Password
								<input
									name="confirmPassword"
                  placeholder="confirmPassword"
                  type="password"
									value={this.state.confirmPassword}
									onChange={this.handleChange}
								/>
							</label>
							<button type="submit">Reset Your Password</button>
						</fieldset>
					</Form>
				)}
			</Mutation>
		);
	}
}
export default Reset;
