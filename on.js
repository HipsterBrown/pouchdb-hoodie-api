'use strict'

module.exports = on

/**
 * subscribes to given event with handler
 *
 * Supported events:
 *
 * - `add`    → (object, options)
 * - `update` → (object, options)
 * - `remove` → (object, options)
 * - `change` → (eventName, object, options)
 *
 * @param  {String} eventName
 *         Name of event, one of listed above
 * @param  {Function} handler
 *         callback for event
 */
function on (state, eventName, handler) {
  if (!state.pouchDBChangesFeedEmitter) {
    state.pouchDBChangesFeedEmitter = this.changes({
      since: 'now',
      live: true,
      include_docs: true
    })
    .on('create', function (change) {
      state.emitter.emit('add', change.doc)
    })
    .on('update', function (change) {
      state.emitter.emit('update', change.doc)
    })
  }

  switch (eventName) {
    case 'add':
    case 'update':
      state.emitter.on(eventName, handler)
      break
    case 'remove':
      break
    case 'change':
      break
  }
}
