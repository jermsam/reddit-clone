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

seedCore.ready().then(async (instance) => {
  swarm.join(seedCore.discoveryKey)
  let length = 0;
  while (length < 1453) {
    const data = b4a.from(`next block #${seedCore.length}`,'hex')
   const instance = await seedCore.append(data)
    length = instance.length;
  }
  const publicKey = b4a.toString(seedCore.key, 'hex');
  console.log('Seed core public key:', publicKey);
})
