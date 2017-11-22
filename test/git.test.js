import test from 'ava';
import tempy from 'tempy';
import {unshallow, gitTags} from '../lib/git';
import {gitRepo, gitCommit, gitCheckout, gitTagVersion, gitShallowClone, gitLog} from './helpers/git-utils';

test.beforeEach(t => {
  // Save the current working diretory
  t.context.cwd = process.cwd();
});

test.afterEach.always(t => {
  // Restore the current working directory
  process.chdir(t.context.cwd);
});

test.serial('Unshallow repository', async t => {
  // Create a git repository, set the current working directory at the root of the repo
  const repo = await gitRepo();
  // Add commits to the master branch
  await gitCommit('First');
  await gitCommit('Second');
  // Create a shallow clone with only 1 commit
  await gitShallowClone(repo);

  // Verify the shallow clone contains only one commit
  t.is((await gitLog()).length, 1);

  await unshallow();

  // Verify the shallow clone contains all the commits
  t.is((await gitLog()).length, 2);
});

test.serial('Do not throw error when unshallow a complete repository', async t => {
  // Create a git repository, set the current working directory at the root of the repo
  await gitRepo();
  // Add commits to the master branch
  await gitCommit('First');
  await t.notThrows(unshallow());
});

test.serial('Get the tags in the history of the current branch', async t => {
  // Create a git repository, set the current working directory at the root of the repo
  await gitRepo();
  // Add commit to the master branch
  await gitCommit('First');
  // Create the tag corresponding to version 1.0.0
  await gitTagVersion('v1.0.0');
  // Create the new branch 'other-branch' from master
  await gitCheckout('other-branch');
  // Add commit to the 'other-branch' branch
  await gitCommit('Second');
  // Create the tag corresponding to version 2.0.0
  await gitTagVersion('v2.0.0');
  // Checkout master
  await gitCheckout('master', false);
  // Add another commit to the master branch
  await gitCommit('Third');
  // Create the tag corresponding to version 3.0.0
  await gitTagVersion('v3.0.0');

  // Verify the git tag v2.0.0 is not returned as it is not accessible on the current branch
  t.deepEqual(await gitTags(), ['v1.0.0', 'v3.0.0']);
});

test.serial('Throws error if obtaining the tags fails', async t => {
  const dir = tempy.directory();
  process.chdir(dir);

  await t.throws(gitTags());
});
