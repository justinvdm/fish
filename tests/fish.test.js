const vv = require('drainpipe')
const it = require('ava')
const fish = require('../src')
const csv = fish.csv

// ## fish

it('should summarize the data into tags', t => {
  vv([
    {
      amount: 123,
      description: 'foo'
    },
    {
      amount: -789,
      description: 'quux'
    },
    {
      amount: -345,
      description: 'baz'
    },
    {
      amount: 901,
      description: 'bar'
    },
    {
      amount: 123,
      description: 'baz'
    },
    {
      amount: -789,
      description: 'quux'
    },
    {
      amount: -345,
      description: 'bar'
    },
    {
      amount: 901,
      description: 'foo'
    }
  ])(fish, {
    tags: {
      a: ['foo', 'bar'],
      b: ['baz', 'quux']
    }
  })(t.deepEqual, {
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

it('should not categorize a datum under more than one tag', t => {
  vv([
    {
      amount: 123,
      description: 'foo'
    },
    {
      amount: -789,
      description: 'foo'
    }
  ])(fish, {
    tags: {
      a: ['foo'],
      b: ['foo']
    }
  })(t.deepEqual, {
    a: {
      credit: 123,
      debit: -789,
      balance: -666
    },
    b: {
      credit: 0,
      debit: 0,
      balance: 0
    }
  })
})

it('should summarize unaccounted data', t => {
  vv([
    {
      amount: 123,
      description: 'foo'
    },
    {
      amount: -789,
      description: 'quux'
    },
    {
      amount: -345,
      description: 'baz'
    },
    {
      amount: 901,
      description: 'bar'
    },
    {
      amount: 123,
      description: 'baz'
    },
    {
      amount: -789,
      description: 'quux'
    },
    {
      amount: -345,
      description: 'bar'
    },
    {
      amount: 901,
      description: 'foo'
    }
  ])(fish, { tags: { a: ['foo', 'bar'] } })(t.deepEqual, {
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

it('should support a configurable name for unaccounted data', t => {
  vv([
    {
      amount: 123,
      description: 'foo'
    },
    {
      amount: -789,
      description: 'quux'
    }
  ])(fish, { fallbackTag: 'other' })(t.deepEqual, {
    other: {
      credit: 123,
      debit: -789,
      balance: -666
    }
  })
})

it('should ignore case when matching tag strings', t => {
  vv([
    {
      amount: 123,
      description: 'fOo'
    },
    {
      amount: 901,
      description: 'bAr'
    },
    {
      amount: -345,
      description: 'bar'
    },
    {
      amount: 901,
      description: 'foo'
    }
  ])(fish, { tags: { a: ['foo', 'bar'] } })(t.deepEqual, {
    a: {
      credit: 1925,
      debit: -345,
      balance: 1580
    }
  })
})

it('should support configurable field names', t => {
  vv([
    {
      name: 'foo',
      rands: 123
    },
    {
      name: 'bar',
      rands: -456
    }
  ])(fish, {
    tags: { a: ['foo', 'bar'] },
    fields: {
      amount: 'rands',
      description: 'name'
    }
  })(t.deepEqual, {
    a: {
      credit: 123,
      debit: -456,
      balance: -333
    }
  })
})

// ## fish.csv

it('should summarize data from a csv file', async t => {
  const result = await promisify(csv)(
    ['description,amount', 'foo,3', 'bar,-23', 'baz,7', 'quux,-13'].join('\n'),
    {
      tags: {
        a: ['foo', 'bar'],
        b: ['baz', 'quux']
      }
    }
  )

  t.deepEqual(result, {
    a: {
      credit: 3,
      debit: -23,
      balance: -20
    },
    b: {
      credit: 7,
      debit: -13,
      balance: -6
    }
  })
})

it('should allow csv parse options to be given', async t => {
  const result = await promisify(csv)(
    ['description|amount', 'foo|3', 'bar|-23'].join('\n'),
    {
      tags: { a: ['foo', 'bar'] },
      csv: { delimiter: '|' }
    }
  )

  t.deepEqual(result, {
    a: {
      credit: 3,
      debit: -23,
      balance: -20
    }
  })
})

function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)))
    })
}
