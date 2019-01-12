import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';

const SingleItemStyles = styled.div`
	max-width: 1200px;
	margin: 2rem auto;
	box-shadow: ${(props) => props.theme.bs};
	display: grid;
	grid-auto-columns: 1fr;
	grid-auto-flow: column;
	min-height: 800px;
	img {
		width: 100%;
    height: 100%;
    object-fit: contain;
	}
`;

const SINGLE_ITEM_QUERY = gql`
	query SINGLE_ITEM_QUERY($id: ID!) {
		item(where: { id: $id }) {
			id
			title
			description
			image
			largeImage
		}
	}
`;

export default class SingleItem extends Component {
	render() {
		return (
			<Query
				query={SINGLE_ITEM_QUERY}
				variables={{
					id: this.props.id
				}}
			>
				{({ error, loading, data }) => {
					if (error) return <p>Error!</p>;
					if (loading) return <p>Loading...</p>;
					if (data)
						return (
							<SingleItemStyles>
								<Head>
									<title>Sick Fits | {data.item.title}</title>
								</Head>
								<img src={data.item.largeImage} alt="item.title" />
							</SingleItemStyles>
						);
				}}
			</Query>
		);
	}
}
