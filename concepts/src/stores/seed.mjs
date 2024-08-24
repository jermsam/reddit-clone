import Corestore from 'corestore';
import b4a from 'b4a';
import RAM from 'random-access-memory';
import {BSON} from 'bson';

const memory = RAM.reusable();

const store = new Corestore(memory);


import Hyperswarm from 'hyperswarm'
import crypto from 'crypto'

const swarm = new Hyperswarm()

swarm.on('connection', (socket) => store.replicate(socket));

const seedCore = store.get({name: 'seeding-core'});

seedCore.ready().then((instance) => {
  swarm.join(seedCore.discoveryKey)
  while (seedCore.length < 10000) {
    const data = b4a.from(`next block #${seedCore.length}`,'hex')
    seedCore.append(data)
  }
  const publicKey = b4a.toString(seedCore.key, 'hex');
  console.log('Seed core public key:', publicKey);
})
