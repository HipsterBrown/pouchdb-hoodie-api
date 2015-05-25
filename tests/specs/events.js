'use strict'

var test = require('tape')
var dbFactory = require('../utils/db')
var waitFor = require('../utils/wait-for')

test('has "on" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.on, 'function', 'has method')
})

test('has "one" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.one, 'function', 'has method')
})

test('has "off" method', function (t) {
  t.plan(1)

  var db = dbFactory()
  var store = db.hoodieApi()

  t.is(typeof store.off, 'function', 'has method')
})

test('store.on("add") with adding one', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.on('add', function (object) {
    addEvents.push({
      object: object
    })
  })

  store.add({
    foo: 'bar'
  })

  .then(waitFor(function () {
    return addEvents.length
  }, 1))

  .then(function () {
    t.is(addEvents.length, 1, 'triggers 1 add event')
    t.is(addEvents[0].object.foo, 'bar', 'event passes object')
  })
})

test('store.on("add") with adding two', function (t) {
  t.plan(3)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.on('add', function (object) {
    addEvents.push({
      object: object
    })
  })

  store.add([
    {foo: 'bar'},
    {foo: 'baz'}
  ])

  .then(waitFor(function () {
    return addEvents.length
  }, 2))

  .then(function () {
    t.is(addEvents.length, 2, 'triggers 2 add event')
    t.is(addEvents[0].object.foo, 'bar', '1st event passes object')
    t.is(addEvents[1].object.foo, 'baz', '2nd event passes object')
  })
})

test('store.on("add") with one element added before registering event and one after', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.add({
    foo: 'bar'
  })

  .then(function () {
    store.on('add', function (object) {
      addEvents.push({
        object: object
      })
    })

    store.add({
      foo: 'baz'
    })

    .then(waitFor(function () {
      return addEvents.length
    }, 1))

    .then(function () {
      t.is(addEvents.length, 1, 'triggers only 1 add event')
      t.is(addEvents[0].object.foo, 'baz', 'event passes object')
    })
  })
})

test('store.on("add") with add & update', function (t) {
  t.plan(2)

  var db = dbFactory()
  var store = db.hoodieApi()
  var addEvents = []

  store.on('add', function (object) {
    addEvents.push({
      object: object
    })
  })

  store.updateOrAdd({id: 'test', nr: 1})

  .then(function () {
    return store.updateOrAdd('test', {nr: 2})
  })

  .then(waitFor(function () {
    return addEvents.length
  }, 1))

  .then(function () {
    t.is(addEvents.length, 1, 'triggers 1 add event')
    t.is(addEvents[0].object.nr, 1, 'event passes object')
  })
})
