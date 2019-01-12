import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Form from './styles/Form';
import gql from 'graphql-tag';
import Error from '../components/ErrorMessage';
import Router from 'next/router';

const CREATE_ITEM_MUTATION = gql`
	mutation CREATE_ITEM_MUTATION(
		$title: String!
		$description: String!
		$price: Int!
		$image: String
		$largeImage: String
	) {
		createItem(title: $title, description: $description, price: $price, image: $image, largeImage: $largeImage) {
			id
		}
	}
`;

export default class CreateItem extends Component {
	state = {
		title: '',
		description: '',
		image: '',
		largeImage: '',
		price: 0
	};
	// Handles change for any value
	handleChange = (e) => {
		const { name, type, value } = e.target;
		const val = type === 'number' ? parseFloat(value) : value;
		this.setState({ [name]: val });
	};

	uploadFile = async (e) => {
		const files = e.target.files;
		const data = new FormData();
		data.append('file', files[0]);
		data.append('upload_preset', 'sick-fits');

		const res = await fetch('https://api.cloudinary.com/v1_1/mastery-coding/image/upload', {
			method: 'POST',
			body: data
		});
		const file = await res.json();
		this.setState({
			image: file.secure_url,
			largeImage: file.eager[0].secure_url
		});
	};

	render() {
		return (
			<Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
				{(createItem, { loading, error }) => (
					<Form
						onSubmit={async (e) => {
							// Prevent form from submitting
							e.preventDefault();
							// Create the item
							const res = await createItem();
							// Navigate to item page
							Router.push({
								pathname: '/item',
								query: {
									id: res.data.createItem.id
								}
							});
						}}
					>
						<Error error={error} />
						<fieldset disabled={loading}>
							<label htmlFor="image">
								Image
								<input
									type="file"
									id="image"
									name="image"
									placeholder="Upload an image"
									required
									onChange={this.uploadFile}
								/>
								{this.state.image && <img src={this.state.image} alt="Upload Preview"/>}
							</label>

							<label htmlFor="title" aria-busy={loading}>
								Title
								<input
									type="text"
									id="title"
									name="title"
									placeholder="Title"
									required
									value={this.state.title}
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
									value={this.state.price}
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
									value={this.state.description}
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
