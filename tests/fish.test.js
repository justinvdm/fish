var vv = require('drainpipe'),
    assert = require('assert'),
    fish = require('../src')


describe("fish api", function() {
  describe("fish", function() {
    it("should summarize the data into tags", function() {
      vv([{
          amount: 123,
          description: 'foo'
        }, {
          amount: -789,
          description: 'quux'
        }, {
          amount: -345,
          description: 'baz'
        }, {
          amount: 901,
          description: 'bar'
        }, {
          amount: 123,
          description: 'baz'
        }, {
          amount: -789,
          description: 'quux'
        }, {
          amount: -345,
          description: 'bar'
        }, {
          amount: 901,
          description: 'foo'
        }])
        (fish, {
          tags: {
            a: ['foo', 'bar'],
            b: ['baz', 'quux']
          }
        })
        (assert.deepEqual, {
          a: {
            credit: 1925,
            debit: -345,
            balance: 1580
          },
          b: {
            credit: 123,
            debit: -1923,
            balance: -1800
          }
        })
    })

    it("should summarize unaccounted data", function() {
      vv([{
          amount: 123,
          description: 'foo'
        }, {
          amount: -789,
          description: 'quux'
        }, {
          amount: -345,
          description: 'baz'
        }, {
          amount: 901,
          description: 'bar'
        }, {
          amount: 123,
          description: 'baz'
        }, {
          amount: -789,
          description: 'quux'
        }, {
          amount: -345,
          description: 'bar'
        }, {
          amount: 901,
          description: 'foo'
        }])
        (fish, {tags: {a: ['foo', 'bar']}})
        (assert.deepEqual, {
          a: {
            credit: 1925,
            debit: -345,
            balance: 1580
          },
          unaccounted: {
            credit: 123,
            debit: -1923,
            balance: -1800
          }
        })
    })

    it("should ignore case when matching tag strings", function() {
      vv([{
          amount: 123,
          description: 'fOo'
        }, {
          amount: 901,
          description: 'bAr'
        }, {
          amount: -345,
          description: 'bar'
        }, {
          amount: 901,
          description: 'foo'
        }])
        (fish, {tags: {a: ['foo', 'bar']}})
        (assert.deepEqual, {
          a: {
            credit: 1925,
            debit: -345,
            balance: 1580
          }
        })
    })

    it("should support configurable field names", function() {
      vv([{
          name: 'foo',
          rands: 123
        }, {
          name: 'bar',
          rands: -456
        }])
        (fish, {
          tags: {a: ['foo', 'bar']},
          fields: {
            amount: 'rands',
            description: 'name'
          }
        })
        (assert.deepEqual, {
          a: {
            credit: 123,
            debit: -456,
            balance: -333
          }
        })
    })
  })
})
