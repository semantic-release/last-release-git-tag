import tempy from 'tempy';
import execa from 'execa';

/**
 * Commit message informations.
 *
 * @typedef {Object} Commit
 * @property {string} branch The commit branch.
 * @property {string} hash The commit hash.
 * @property {string} message The commit message.
 */

/**
 * Create a temporary git repository and change the current working directory to the repository root.
 *
 * @return {string} The path of the repository.
 */
export async function gitRepo() {
  const dir = tempy.directory();

  process.chdir(dir);
  await execa('git', ['init']);
  await gitCheckout('master');
  return dir;
}

/**
 * Create commit on the current git repository.
 *
 * @param {string} message commit message.
 *
 * @returns {Commit} The created commits.
 */
export async function gitCommit(message) {
  const {stdout} = await execa('git', ['commit', '-m', message, '--allow-empty', '--no-gpg-sign']);
  const [, branch, hash] = /^\[(\w+)\(?.*?\)?(\w+)\] .+$/.exec(stdout);
  return {branch, hash, message};
}

/**
 * Checkout a branch on the current git repository.
 *
 * @param {string} branch Branch name.
 * @param {boolean} create `true` to create the branche ans switch, `false` to only switch.
 */
export async function gitCheckout(branch, create = true) {
  await execa('git', create ? ['checkout', '-b', branch] : ['checkout', branch]);
}

/**
 * Create a tag on the head commit in the current git repository.
 *
 * @param {string} tagName The tag name to create.
 * @param {string} [sha] The commit on which to create the tag. If undefined the tag is created on the last commit.
 *
 * @return {string} The commit sha of the created tag.
 */
export async function gitTagVersion(tagName, sha) {
  await execa('git', sha ? ['tag', '-f', tagName, sha] : ['tag', tagName]);
  return (await execa('git', ['rev-list', '-1', '--tags', tagName])).stdout;
}

/**
 * @return {Array<string>} The list of commit sha from the current git repository.
 */
export async function gitLog() {
  return (await execa('git', ['log', '--format=format:%H'])).stdout.split('\n').filter(sha => Boolean(sha));
}

/**
 * Create a shallow clone of a git repository and change the current working directory to the cloned repository root.
 * The shallow will contain a limited number of commit and no tags.
 *
 * @param {string} origin The path of the repository to clone.
 * @param {number} [depth=1] The number of commit to clone.
 * @return {string} The path of the cloned repository.
 */
export async function gitShallowClone(origin, branch = 'master', depth = 1) {
  const dir = tempy.directory();

  process.chdir(dir);
  await execa('git', ['clone', '--no-hardlinks', '--no-tags', '-b', branch, '--depth', depth, `file://${origin}`, dir]);
  return dir;
}
