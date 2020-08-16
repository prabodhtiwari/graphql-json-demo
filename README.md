# graphql-json-demo

graphql-json-demo is graphql demo in node using json as database.

### Setup

This requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ npm install 
$ node run devstart
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:4000/graphql
```

### Mutation

Create Author:
```
mutation{
  addAuthor(name: "Prabodh Tiwari") {
    id
    name
  }
}
```

Create Book:
```
mutation{
  addbook(name: "Prabodh's book", authorId: 4) {
    id
    name
		author{
      id
			name
    }

  }
}
```


### Query

Fetch Author:
```
{
  author(id: 4){
    id
    name
  }
}
```

Fetch Authors:
```
{
  authors{
    id
    name
    books{
      name
    }
  }
}
```

Fetch Book:
```
{
  book(id: 9){
    id
    name
    author {
        name
    }
  }
}
```

Fetch Books:
```
{
  books{
    id
    name
    author{
      name
    }
  }
}
```

License
----

MIT