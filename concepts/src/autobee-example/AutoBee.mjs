import Autobase from 'autobase'
import b4a from 'b4a'
import Hyperbee from 'hyperbee'

/**
 * @options
 * store, bootstrap, handlers = {}
 * */

export default class AutoBee extends Autobase {
  constructor(...options) {
    let [store, bootstrap, handlers = {}] = options
    // If loading an existing Autobase then set bootstrap to base.key (primary key of the bootrap core as second argument),
    // otherwise pass bootstrap as null
    if(bootstrap && typeof bootstrap !== 'string' && !b4a.isBuffer(bootstrap)) {
      handlers = bootstrap
      bootstrap = null
    }

    const open = (viewStore) => {
      const core = viewStore.get('autobee')
      return new Hyperbee(core, {
        ...handlers,
        extension: false
      })
    }

    const apply = 'apply' in handlers ? handlers.apply : AutoBee.apply

    super(store, bootstrap, {...handlers, open, apply})
  }

  static async apply (batch, view, base) {
    // update: false the core does not have to be updated before any operation
    const b = view.batch({ update: false })

    // Decode operation node key if the Hyperbee view has a keyEncoding set & it
    // wasn't already decoded.
    function decodeKey (item){
      if(b4a.isBuffer(item) && view.keyEncoding) return view.keyEncoding.decode(item);
      return item
    }

    // Process operation nodes
    for (const node of batch) {
      const op = node.value
      if (op.type === 'put') {
        const encKey = decodeKey(op.key)
        await b.put(encKey, op.value, op.opts)
      } else if (op.type === 'del') {
        const encKey = decodeKey(op.key)
        await b.del(encKey, op.opts)
      }
    }
    /*
    * A batch is atomic: it is either processed fully or not at all.A Hyperbee has a single write lock.
    * A batch acquires this write lock with its first modifying operation (put,del), and releases it when it flushes.
    * We can also explicitly acquire the lock with await batch.lock().
    * If using the batch only for read operations, the write lock is never acquired.
    * Once the write lock is acquired, the batch must flush before any other writes to the Hyperbee can be processed.
    A batch's state snaps at creation time, so write operations applied outside the batch are not taken into account when reading.
    * Write operations within the batch do get taken into account, as is to be expected — if we first run await batch.put('myKey', 'newValue')
     and later run await batch.get('myKey'), then 'newValue' should be observed.
    ***/
    await b.flush()
  }

  _getEncodedKey (key, opts) {
    // Apply keyEncoding option if provided.
    // The key is preencoded so that the encoding survives being deserialized
    // from the input core
    const encKey = opts && opts.keyEncoding
      ? opts.keyEncoding.encode(key)
      : key

    // Clear keyEncoding from options as it has now been applied
    if (opts && opts.keyEncoding) {
      delete opts.keyEncoding
    }

    return encKey
  }

  put (key, value, opts) {
    return this.append({
      type: 'put',
      key: this._getEncodedKey(key, opts),
      value,
      opts
    })
  }

  del (key, opts) {
    return this.append({
      type: 'del',
      key: this._getEncodedKey(key, opts),
      opts
    })
  }

  get (key, opts) {
    return this.view.get(key, opts)
  }

  peek (opts) {
    return this.view.peek(opts)
  }

  createReadStream (range, opts) {
    return this.view.createReadStream(range, opts)
  }

}
