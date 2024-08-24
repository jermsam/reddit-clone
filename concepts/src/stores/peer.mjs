import Corestore from 'corestore';
import b4a from 'b4a';
import RAM from 'random-access-memory';
import {BSON} from 'bson';
import Hyperswarm from 'hyperswarm'
import crypto from 'crypto'
import readline from 'readline';

const swarm = new Hyperswarm()

const memory = RAM.reusable();

const store = new Corestore(memory);

swarm.on('connection', (socket) => store.replicate(socket));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Please enter the seeding core\'s primary key: ', async (input) => {
  console.log(`You entered: ${input}`);
  const seedingCoreKey = b4a.from(input,'hex')
  const seedingCore = store.get(seedingCoreKey);
  await seedingCore.ready()
  swarm.join(seedingCore.discoveryKey)
  // Make sure we have all the connections
  await swarm.flush()
  // Make sure we have the latest length
  await seedingCore.update()
  console.log('Seeding core length is:', seedingCore.length)
  rl.close();
});
