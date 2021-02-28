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

const greet = (call, callback) => {
    const firstNmae = call.request.greeting.first_name
    const lastNmae = call.request.greeting.last_name

    callback(null, { result: `Hello ${firstNmae} ${lastNmae}` })
}


const main = () => {
    const server = new grpc.Server()

    server.addService(greetPackageDefinition.GreetService.service, {
        greet
    })

    const hostAndPort = "127.0.0.1:50051"
    server.bind(hostAndPort, grpc.ServerCredentials.createInsecure())
    server.start()
    console.log(`server is running at ${hostAndPort}`)
}

main()