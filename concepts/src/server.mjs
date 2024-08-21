import DHT from '@hyperswarm/dht'
import * as b4a from 'b4a'

// Make a Hyperswarm DHT node that connects to the global network.
const node = new DHT();

const server = node.createServer( (encryptedSocket) => {
  // Called when a new connection arrives.
  console.log('New connection from', b4a.toString(encryptedSocket.remotePublicKey,'hex'))
  encryptedSocket.write('Hello world!')
  encryptedSocket.end()
})

const keyPair = DHT.keyPair()

server.listen(keyPair).then(()=>{
  // Server is now listening.
  console.log('Connect to:')
  console.log(keyPair.publicKey.toString('hex'))
})
