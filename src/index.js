/*
https://www.prisma.io/docs/1.13/tutorials/build-graphql-servers/development/build-a-graphql-server-from-scratch-nahgaghei6
*/

const {
  GraphQLServer
} = require('graphql-yoga')

/*
Nova definicija resolvera
*/

let idCount = 0
const posts = []

const resolvers = {
  Query: {

    /*
    Radi isto što i prije, dohvaća pripadajući String
    */

    description: () => `This is the API for a simple blogging application`,

    /*
    Vraća array u kojem spremamo objekte tipa Post
    */

    posts: () => posts,

    /*
    Pretražuje array posts i vraća jedan post s pripadajućim ID-jem
    */

    post: (parent, args) => posts.find(post => post.id === args.id),
  },
  Mutation: {

    /*
    Kreira još uvijek neobjavljani post, tzv. draft.
    */

    createDraft: (parent, args) => {
      const post = {
        id: `post_${idCount++}`,
        title: args.title,
        content: args.content,
        published: false,
      }
      posts.push(post)
      return post
    },

    /*
    Uklanja post s odgovarajućim ID-jem iz arraya posts
    */

    deletePost: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      if (postIndex > -1) {
        const deleted = posts.splice(postIndex, 1)
        return deleted[0]
      }
      return null
    },

    /*
    Boolean published postavlja na true -> objavljeni post
    */

    publish: (parent, args) => {
      const postIndex = posts.findIndex(post => post.id === args.id)
      posts[postIndex].published = true
      return posts[postIndex]
    },
  },
}


/*
Budući da shemu definiramo u zasebnoj datoteci, "importamo" je u Konstruktoru
servera.

Klasa GraphQLServer jer centralna klasa koja u sebi sadrži svu konfiguraciju
vezanu uz GQL shemu.
*/

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
})

server.start(() => console.log(`The server is running on http://localhost:4000`))

/*
Naredba node src/index.js za pokretanje servera
Odlazak na http://localhost:4000 za pokretanje GQL playgrounda
*/

/*
Primjer probnih upita na server:

1. Kreiranje neobjavljenog posta (draft)
mutation {
  createDraft(
    title: "graphql-yoga is awesome"
    content: "It really is!"
  ) {
    id
    published
  }
}

2. Obajvljivanje drafta
mutation {
  publish(id: "post_0") {
    id
    title
    content
    published
  }
}

3. Dohvaćanje postova (u ovom slučaju i objavljenih i neobjavljenih)
query {
  posts {
    id
    title
    published
  }
}
*/