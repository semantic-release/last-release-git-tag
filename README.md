# @semantic-release/last-release-git-tag

[semantic-release](https://github.com/semantic-release/semantic-release) plugin to determine the version of the last release with git tags.

[![Travis](https://img.shields.io/travis/semantic-release/last-release-git-tag.svg)](https://travis-ci.org/semantic-release/last-release-git-tag)
[![Codecov](https://img.shields.io/codecov/c/github/semantic-release/last-release-git-tag.svg)](https://codecov.io/gh/semantic-release/last-release-git-tag)
[![Greenkeeper badge](https://badges.greenkeeper.io/semantic-release/last-release-git-tag.svg)](https://greenkeeper.io/)

## Configuration

The plugin doesn't have any options. It can be used with the following [semantic-release](https://github.com/semantic-release/semantic-release) configuration:

```json
{
  "release": {
    "getLastRelease": "@semantic-release/last-release-git-tag",
  }
}
```
