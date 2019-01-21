import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag'

// const ADD_TO_CART_MUTATION = gql`
//   mutation addToCart(id: ID!) {
//     addToCart(id: $id) {
//       id
//       quantity
//     }
//   }
// `

export default class AddToCart extends Component {
  render() {
    const {id} = this.props;
    return ( <div></div>
      // <Mutation>
      //   {(addToCart) => (
          
      //   )}
      // </Mutation>
      
    )
  }
}

