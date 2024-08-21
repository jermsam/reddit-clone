import DHT from '@hyperswarm/dht' // not browser supported!
import * as b4a from 'b4a'

export function setupData() {
  const node = new DHT()
  const remotePublicKey = b4a.from('1bf248b76e6087a49c9350cdd11cbc7c52591ebb73ace2e95e85af172a2e05de','hex')
  console.log(remotePublicKey);
  const encryptedSocket = node.connect(remotePublicKey)

  encryptedSocket.on('open', function () {
    console.log('Connected to server')
  })

  encryptedSocket.on('data', function (data) {
    console.log('Remote said:', data.toString())
  })

}

setupData()
