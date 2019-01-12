import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Form from './styles/Form';
import gql from 'graphql-tag';
import Error from '../components/ErrorMessage';
import Router from 'next/router';

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: {id: $id} ) {
			title
			description
			price
			image
		}
	}
`;

const UPDATE_ITEM_MUTATION = gql`
	mutation UPDATE_ITEM_MUTATION(
    $id: ID!
		$title: String
		$description: String
		$price: Int
	) {
		updateItem(id: $id, title: $title, description: $description, price: $price) {
			id
      title
      description
      price
		}
	}
`;

export default class UpdateItem extends Component {
	state = {};
	// Handles change for any value
	handleChange = (e) => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};
  updateItem = async (e, updateItemMutation) => {
    e.preventDefault()
    console.log('Updating Item');
    console.log(this.state);
    const res = await updateItemMutation({variables: {
      id: this.props.id,
      ...this.state
    }})

  }
	render() {
		return (
			<Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
				{({data, loading}) => {
          if (loading) return <p>Loading...</p>
					return (
						<Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
							{(updateItem, { loading, error }) => (
								<Form
									onSubmit={(e) => this.updateItem(e, updateItem)}
								>
									<Error error={error} />
									<fieldset disabled={loading}>
										<label htmlFor="title" aria-busy={loading}>
											Title
											<input
												type="text"
												id="title"
												name="title"
												placeholder="Title"
												required
												defaultValue={data.item.title}
												onChange={this.handleChange}
											/>
										</label>

										<label htmlFor="price">
											Price
											<input
												type="number"
												id="price"
												name="price"
												placeholder={0}
												required
												defaultValue={data.item.price}
												onChange={this.handleChange}
											/>
										</label>

										<label htmlFor="description">
											Description
											<input
												type="text"
												id="description"
												name="description"
												placeholder="Description"
												required
												defaultValue={data.item.description}
												onChange={this.handleChange}
											/>
										</label>

										<button type="submit">{loading ? "Saving..." : "Save"}</button>
									</fieldset>
								</Form>
							)}
						</Mutation>
					);
				}}
			</Query>
		);
	}
}
