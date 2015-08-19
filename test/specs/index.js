const test = require('tap').test
const proxyquire = require('proxyquire')

const tags = ['firstVersion',
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
  t.plan(2)

  t.test('last release from git tags', (tt) => {
    lastRelease({}, {}, (err, release) => {
      tt.error(err)
      tt.is(release.version, '2.1.3', 'version')
      tt.is(release.gitHead, 'v2.1.3', 'gitHead')

      tt.end()
    })
  })

  t.test('ignore invalid tags', (tt) => {
    tags.splice(0, tags.length)
    tags.push('foo', 'bar', 'baz', '1.0.0', 'v1.0', '1.0', 'v1.a.0')
    lastRelease({}, {}, (err, release) => {
      tt.error(err)
      tt.same(release, {}, 'inital release')

      tt.end()
    })
  })

  t.end()
})
