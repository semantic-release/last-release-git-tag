const test = require('tap').test
const proxyquire = require('proxyquire')

let tags = ['firstVersion',
              'thing',
              'v1.0',
              'foo',
              '1.0.0',
              'v1..0',
              'v1.0.0',
              'v1.1.1',
              'foo',
              'bar',
              'baz',
              'v2.1.3',
              'x',
              'y',
              'z']

const lastRelease = proxyquire('../../dist', {
  'child_process': {
    exec: (cmd, cb) => {
      cb(null, `  ${['', ...tags, ''].join('\n')}    `, '')
    }
  }
})

test('last release from git tags', (t) => {
  t.plan(3)

  t.test('last release from git tags', (tt) => {
    lastRelease({}, {}, (err, release) => {
      tt.error(err)
      tt.is(release.version, '2.1.3', 'version')
      tt.is(release.gitHead, 'v2.1.3', 'gitHead')

      tt.end()
    })
  })

  t.test('ignore invalid tags', (tt) => {
    tags = ['foo', 'bar', 'baz', '1.0.0', 'v1.0', '1.0', 'v1.a.0']
    lastRelease({}, {}, (err, release) => {
      tt.error(err)
      tt.same(release, {}, 'inital release')

      tt.end()
    })
  })

  t.test('deal with unsorted versions', (tt) => {
    tags = shuffle(['v1.0.0', 'v1.1.0', 'v1.1.1', 'v2.8.7', 'v3.6.9', 'v9.9.9'])

    lastRelease({}, {}, (err, release) => {
      tt.error(err)
      tt.is(release.version, '9.9.9', 'version')
      tt.is(release.gitHead, 'v9.9.9', 'gitHead')

      tt.end()
    })
  })

  t.end()
})

// http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle (array) {
  var currentIndex = array.length
  var temporaryValue
  var randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

