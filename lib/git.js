const execa = require('execa');
const debug = require('debug')('semantic-release:last-release-git-tag');

/**
 * @return {Array<string>} List of git tags in the history of the current branch.
 *
 * @throws {Error} If the `git` command fails.
 */
async function gitTags() {
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
