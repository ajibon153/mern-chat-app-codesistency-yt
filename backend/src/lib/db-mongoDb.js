import pkg from "mongodb"

const { MongoClient, ServerApiVersion } = pkg
const uri = "mongodb+srv://root:root@node-crud.b2tfqn3.mongodb.net/?appName=node-crud"

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export async function runDb() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        console.log("Try to connect to MongoDB...")

        await client.connect()
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!")
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}
