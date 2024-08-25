import  minimist from 'minimist';

export default  minimist(process.argv, {
  alias: {
    writers: 'w',
    indices: 'i',
    storage: 's',
    name: 'n'
  },
  default: {
    swarm: true
  },
  boolean: ['random','swarm']
});
