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
    const firstName = call.request.greeting.first_name
    const lastName = call.request.greeting.last_name

    callback(null, { result: `Hello ${firstName} ${lastName}` })
}

const greetManyTimes = (call, callback) => {
    const firstName = call.request.getGreeting().getFirstName
    const firstName2 = call.request.greeting.first_name

    console.log({ firstName, firstName2 })

    // const lastName = call.request.greeting.last_name

    let count = 0, intervalID = setInterval(() => {
        const greetManyTimesResponse = new greets.GreetManyTimesResponse()
        greetManyTimesResponse.setResult(firstName)

        // setup streaming
        call.write(greetManyTimesResponse)

        if (++xount > 9) {
            clearInterval(intervalID)

            call.end() // we have sent all messages
        }
    }, 1000)
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