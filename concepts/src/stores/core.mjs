import Corestore from 'corestore';
import b4a from 'b4a';
import RAM from 'random-access-memory';
import {BSON} from 'bson';

const memory = RAM.reusable();

const store = new Corestore(memory);

const core = store.get({name: 'first-core'});

core.ready().then((instance) => {
  console.log('All Hypercores are identified by two properties: A public key and a discovery key, the latter of which is derived from the public key. ' +
    'Importantly, the public key gives peers read **** capability — if we have the key, we can exchange blocks with other peers.\n' +
    'The process of block replication requires the peers to prove to each other that they know the public key. ' +
    'This is important because the public key is necessary for peers to be able to validate the blocks. ' +
    'Hence, only the peers who know the public key can perform the block replication.\n' +
    '\n',
  );
  const publicKey = b4a.toString(core.key, 'hex');
  console.log('Core public key:', publicKey);
  console.log('Core has', core.length, 'entries');
  console.log('Core is writable', core.writable);
  console.log('Core is readable', core.readable);
  console.log(
    'Since the public key is also a read capability, it can\'t be used to discover other readers ' +
    '(by advertising it on a DHT, for example) as that would lead to capability leaks. ' +
    'The discovery key, being derived from the public key but lacking read capability, can be shared openly for peer discovery.'+
    '\n',
  );
  const discoveryKey = b4a.toString(core.discoveryKey, 'hex');
  console.log('Core Discovery key:', discoveryKey);

  return core.append(b4a.from(BSON.serialize({greeting: 'Hello world'}), 'hex'));
}).then((instance) => {
  const {length, byteLength} = instance;
  console.log('Core has', length, 'entries and', byteLength, 'bytes' );
  return core.append(b4a.from(BSON.serialize({greeting2: 'Hi there!'}), 'hex'));
}).then((instance) => {
  const {length, byteLength} = instance;
  console.log('Core has', length, 'entries and', byteLength, 'bytes' );
  return core.append(b4a.from(BSON.serialize({greeting3: 'Hey there!'}), 'hex'));
}).then((instance) => {
  const {length, byteLength} = instance;
  console.log('Core has', length, 'entries and', byteLength, 'bytes' );
  return core.get(1);
}).then((block2) => {

  const secondBlock = BSON.deserialize(block2);
  console.log(secondBlock);
  const publicKey = b4a.toString(core.key, 'hex');
  const sameCore = store.get(Buffer.from(publicKey, 'hex'));
  console.log('Core has', sameCore.length, 'entries');
  const sameCorePublicKey = b4a.toString(sameCore.key, 'hex');
  console.log(sameCorePublicKey);
  console.log('Core is writable', sameCore.writable);
  console.log('Core is readable', sameCore.readable);
  const discoveryKey = b4a.toString(core.discoveryKey, 'hex');
  console.log('Core Discovery key:', discoveryKey);
});
