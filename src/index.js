const { exec } = require('child_process')
const semver = require('semver')

module.exports = function (pluginConfig, config, cb) {
  exec('git tag', (err, stdout, stderr) => {
    if (err) return cb(err)

    const tags = stdout
                  .trim()
                  .split('\n')
                  .map(tag => tag.trim())
                  .filter(semver.valid)
                  // semantic-release always puts a v in front.
                  .filter(tag => tag.charAt(0) === 'v')
                  .sort(semver.compare)

    if (tags.length < 1) return cb(null, {})

    const tag = tags.pop()
    // semver.valid is poorly named, It actually parses it
    const version = semver.valid(tag)

    cb(null, {
      version: version,
      gitHead: tag
    })
  })
}
