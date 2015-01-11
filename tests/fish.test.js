var vv = require('drainpipe'),
    assert = require('assert'),
    fish = require('../src')


describe("fish api", function() {
  describe("fish", function() {
    it("should summarize the data into tags", function() {
      vv([{
          date: '1990/03/23',
          description: 'foo',
          amount: 123
        }, {
          date: '1990/04/24',
          description: 'quux',
          amount: -789
        }, {
          date: '1990/05/25',
          description: 'baz',
          amount: -345
        }, {
          date: '1990/06/26',
          description: 'bar',
          amount: 901
        }, {
          date: '1990/07/23',
          description: 'baz',
          amount: 123
        }, {
          date: '1990/08/24',
          description: 'quux',
          amount: -789
        }, {
          date: '1990/09/25',
          description: 'bar',
          amount: -345
        }, {
          date: '1990/10/26',
          description: 'foo',
          amount: 901
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
          date: '1990/03/23',
          description: 'foo',
          amount: 123
        }, {
          date: '1990/04/24',
          description: 'quux',
          amount: -789
        }, {
          date: '1990/05/25',
          description: 'baz',
          amount: -345
        }, {
          date: '1990/06/26',
          description: 'bar',
          amount: 901
        }, {
          date: '1990/07/23',
          description: 'baz',
          amount: 123
        }, {
          date: '1990/08/24',
          description: 'quux',
          amount: -789
        }, {
          date: '1990/09/25',
          description: 'bar',
          amount: -345
        }, {
          date: '1990/10/26',
          description: 'foo',
          amount: 901
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
          date: '1990/03/23',
          description: 'fOo',
          amount: 123
        }, {
          date: '1990/06/26',
          description: 'bAr',
          amount: 901
        }, {
          date: '1990/09/25',
          description: 'bar',
          amount: -345
        }, {
          date: '1990/10/26',
          description: 'foo',
          amount: 901
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
  })
})
