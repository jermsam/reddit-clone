import Corestore from 'corestore';
import b4a from 'b4a';
import RAM from 'random-access-memory';
import {BSON} from 'bson';
import args from './args.mjs';

const memory = RAM.reusable();



export default class HyperNews {
  constructor() {
    this.store =  new Corestore(args.random ? memory: (args.storage || 'hypernews'));
    this.swarm = null;
    this.autobase = null;
    this.bee = null;
    this.name = null;
  }
  async start() {

  }
}
