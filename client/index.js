const path = require('path')
const protoLoader = require('@grpc/proto-loader')
const grpc = require('grpc')

// grpc service definition for greet

const greetProtoPath = path.join(__dirname, '..', 'protos', 'greet.proto')
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defualts: true,
    oneofs: true
})

const greetPackageDefinition = grpc.loadPackageDefinition(greetProtoDefinition).greet

const hostAndPort = "127.0.0.1:50051"
const client = new greetPackageDefinition.GreetService(
    hostAndPort,
    grpc.credentials.createInsecure()
)

const callGreeting = () => {
    const request = {
        greeting: {
            first_name: "Jerry",
            last_name: 'Tom'
        }
    }

    console.log({client})
    client.greet(request, (error, response) => {
        if (!error) {
            console.log('Greeting response: ', response.result)
        }
        else {
            console.error(error)
        }
    })
}

const main = () => {
    callGreeting()
}

main()