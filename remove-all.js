'use strict'

var toObject = require('./utils/to-object')
var toDoc = require('./utils/to-doc')

module.exports = removeAll

/**
 * removes all existing objects
 *
 * @param  {Function} [filter]   Function returning `true` for any object
 *                               to be removed.
 * @return {Promise}
 */
function removeAll (filter) {
  var objects
  var db = this

  return db.allDocs({
    include_docs: true
  })

  .then(function (res) {
    objects = res.rows.map(function (row) {
      return toObject(row.doc)
    })

    if (typeof filter === 'function') {
      objects = objects.filter(filter)
    }

    return objects.map(function (object) {
      var doc = toDoc(object)
      doc._deleted = true
      return doc
    })
  })

  .then(db.bulkDocs.bind(db))

  .then(function (results) {
    return results.map(function (result, i) {
      objects[i]._rev = result.rev
      return objects[i]
    })
  })
}
