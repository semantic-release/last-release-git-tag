const {callbackify} = require('util');
const semver = require('semver');
const {gitTags, unshallow} = require('./lib/git');

async function getLastRelease(pluginConfig, {logger}) {
  // Unshallow the repo in order to get all the tags
  await unshallow();
  const tags = (await gitTags()).filter(tag => semver.valid(semver.clean(tag))).sort(semver.compare);

  if (tags.length > 0) {
    const tag = tags[tags.length - 1];
    logger.log('Found git tag version %s.', tag);
    return {gitHead: tag, version: semver.valid(semver.clean(tag))};
  }
  logger.log('No git tag version found.');
  return {};
}

module.exports = callbackify(getLastRelease);
