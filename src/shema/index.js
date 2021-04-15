const { gql } = require("apollo-server");

module.exports = {
  typeDefs: gql`
    type Category {
      id: ID
      title: String
      description: String
      icon: String
      products: [Product]
      parent: Category
      childrens: [Category]
    }

    type Product {
      id: ID
      title: String
      cost: Float
      short_description: String
      description: String
      preview: String
      warehouse: Float
      rating: Float
      categories: [String]
      categoriesFull: [Category]
    }

    type Query {
      products(userId: String!): [Product]
      product(id: ID!): [Product]
      categories(userId: String!): [Category]
      productsByCategories(productsCategory: [String]!): [Product]
    }

    type Mutation {
      addCategory(
        title: String!
        description: String
        icon: String
        parent: ID
        childrens: [ID]
      ): Category
      updateCategory(
        id: ID!
        title: String!
        description: String
        icon: String
        parent: ID
        childrens: [ID]
      ): Category
      removeCategory(id: ID!): Category

      addProduct(
        title: String!
        cost: Float!
        short_description: String
        description: String
        preview: String
        warehouse: Float
        rating: Float
        categories: [String]
      ): Product

      updateProduct(
        id: ID!
        title: String!
        cost: Float!
        short_description: String
        description: String
        preview: String
        warehouse: Float
        rating: Float
        categories: [String]
      ): Product
      removeProduct(id: ID!): Product
    }
  `,
};
