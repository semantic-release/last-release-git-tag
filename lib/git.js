const execa = require('execa');
const debug = require('debug')('semantic-release:last-release-git-tag');

async function gitTags(gitHead) {
  try {
    return (await execa.stdout('git', ['tag', '--merge', 'HEAD']))
      .split('\n')
      .map(tag => tag.trim())
      .filter(tag => Boolean(tag));
  } catch (err) {
    debug(err);
    throw new Error(err.stderr);
  }
}

/**
 * Unshallow the git repository (retriving every commits and tags).
 */
async function unshallow() {
  await execa('git', ['fetch', '--unshallow', '--tags'], {reject: false});
}

module.exports = {unshallow, gitTags};
