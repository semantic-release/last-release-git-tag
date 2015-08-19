const { defaults } = require('lodash')
const test = require('tap').test

const lastRelease = require('../../dist')

test('last release from git tags', (t) => {
  t.plan(1)

  t.test('TODO', (tt) => {
    lastRelease({}, {
      pkg: {name: 'available'}
    }, (err, release) => {
      tt.error(err)
      tt.is(release.version, '1.33.7', 'version')
      tt.is(release.gitHead, 'HEAD', 'gitHead')

      tt.end()
    })
  })
})
