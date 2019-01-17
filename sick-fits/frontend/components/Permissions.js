import React, { Component } from 'react'
import { Query } from 'react-apollo';
import Error from './ErrorMessage';
import gql from 'graphql-tag';
import Table from './styles/Table';
import SickButton from './styles/SickButton'
import PropTypes from 'prop-types';
import { check } from 'graphql-anywhere';

const possiblePermissions = [
  'ADMIN',
  'USER',
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE",
]

const ALL_USERS_QUERY = gql`
	query {
		users {
			id
			name
			email
			permissions
		}
	}
`;

const Permissions = (props) => (
	<Query query={ALL_USERS_QUERY}>
		{({ data }, loading, error ) => {
      if (loading) return <p>Loading...</p>;
			return (
				<div>
					<Error error={error} />
					<div>
						<h2>Manage Permissions</h2>
						<Table>
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
                  {possiblePermissions.map(permission => 
                    <th key={permission}>{permission}</th>
                  )}
                  <th></th>
								</tr>
							</thead>
              <tbody>
                {data.users.map((user) => <UserPermissions key={user.id} user={user}/>)}
              </tbody>
						</Table>
					</div>
				</div>
			);
		}}
	</Query>
);

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  }
  state = {
    permissions: this.props.user.permissions,
  }
  handlePermissionChange = ({target}) => {
    const {value, checked} = target;
    let updatedPermissions = [...this.state.permissions]
    if (checked) updatedPermissions.push(value)
    if (!checked) updatedPermissions = updatedPermissions.filter(p => p !== value);
    this.setState({permissions: updatedPermissions})
  }
  render() {
    const user = this.props.user;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map((permission, i) => (
          <td key={i}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input type="checkbox" checked={
                this.state.permissions.includes(permission)
              }
                value={permission}
                onChange={this.handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td><SickButton>Update</SickButton></td>
      </tr>
    )
  }
}

export default Permissions;
