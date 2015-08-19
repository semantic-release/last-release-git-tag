const { exec } = require('child_process')

module.exports = function (pluginConfig, config, cb) {
  exec('git tag', (err, stdout, stderr) => {
    if (err) return cb(err)

    const versionRegex = /^v((?:[0-9]+\.){2}[0-9]+)$/

    const tags = stdout
                  .trim()
                  .split('\n')
                  .map(tag => tag.trim())
                  .filter(tag => versionRegex.test(tag))

    if (tags.length < 1) return cb(null, {})

    const tag = tags.pop()
    const version = tag.match(versionRegex)[1]

    cb(null, {
      version: version,
      gitHead: tag
    })
  })
}
