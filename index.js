const express = require("express")
const { graphqlHTTP } = require("express-graphql");
const {books, authors} = require("./db")

const { 
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLScalarType,
} = require("graphql")

const AuthorType = new GraphQLObjectType({
    name: "authors",
    description: "This represent an author of the book",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(AuthorType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            } 
        }

    })
})

const BookType = new GraphQLObjectType({
    name: "books",
    description: "This represent a book written by an author",
    fields: () => ({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: "mutation",
    description: "root mutation",
    fields: () => ({
        addbook: {
            type: BookType,
            description: "Add a book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
                },
            resolve: (parent, args) => {
                const book = {id: (books.length + 1), name: args.name, authorId: args.authorId}
                books.push(book) 
                book.author = authors.find(author => author.id === book.authorId)
                return book
            }

        },
        addAuthor: {
            type: AuthorType,
            description: "Add an author",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)}
                },
            resolve: (parent, args) => {
                const author = {id: (authors.length + 1), name: args.name}
                authors.push(author)
                return author
            } 

        }
    })
})


const RootQueryType = new GraphQLObjectType({
    name: "query",
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: "A book",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: GraphQLList(BookType),
            description: "List of books",
            resolve: () => books

        },
        author: {
            type: AuthorType,
            description: "An author",
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: "List of authors",
            resolve: () => authors

        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})


const app = express()
app.use("/graphql", graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(4000, () => console.log("server running at :4000"))