# Contributing to API Designer

Do you want to help improve this project?? Here are some instructions to get you started. They are probably not perfect, please let us know if anything feels wrong or incomplete.

## Reporting Issues

When reporting [issues](https://github.com/mulesoft/api-designer/issues)
on GitHub please include the version of the API Designer you are using, as well as the name and version of your browser, and your OS. Please also include the steps required to reproduce the problem if possible and applicable. This information will help us review and fix your issue faster.

As an example:

```
API Designer Version: 0.0.4
Browser: Chrome Version 43.0.2357.132 (64-bit), Safari Version 8.0.6 (10600.6.3)
OS: Mac OS X 10.10.3

Steps to Reproduce:
1. Start API Designer with Chrome;
2. Click on Import
3. Choose Swagger spec
4. Insert https URL
```

## Build Environment

Install global tools

```sh
npm install -g grunt-cli
npm install -g bower
npm install -g karma # Optional for running the test suite
```

Install node modules

```sh
npm install
```

Install bower modules

```sh
bower install
```

Install webdriver required to run `localScenario` task

```sh
node node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update
```

Run the application locally

```sh
grunt server
```

Run the test suite

```sh
grunt test
```

Build the application

```sh
grunt
```

## Workflow

* We are using [git triangular workflow](https://www.sociomantic.com/blog/2014/05/git-triangular-workflow/);
* No one, not even the API Designer maintainers, push contributions directly into the master;
* All contribution come in through pull requests;
* Each contributor will need to [fork the main API Designer](https://github.com/mulesoft/api-designer/fork) repo on GitHub;
* All contributions are made as commits to your fork;
* A pull request must contain a single feature or a single fix (or a small batch of related fixes);
* Before submitting a pull request, you need to execute `squash commits`. Submit the pull request afterwards to have them considered for merging into the main API Designer repo;
* A good summary of some workflow best practice can be found in this [article]( http://blakeembrey.com/articles/2013/04/contributing-to-open-source/).

## Contribution guidelines

### Contributor’s Agreement

To contribute source code to this repository, please read our [contributor's agreement](http://www.mulesoft.org/legal/contributor-agreement.html), and then execute it by running this notebook and following the instructions: https://api-notebook.anypoint.mulesoft.com/notebooks/#380297ed0e474010ff43

### Pull requests are always welcome

We are always thrilled to receive pull requests, and do our best to process them as fast as possible. Not sure if that typo is worth a pull request? Do it! We will appreciate it.

If your pull request is not accepted on the first try, don't be discouraged! If there's a problem with the implementation, hopefully you received feedback on what to improve.

We're trying very hard to keep the API Designer lean and focused. We don't want it to do everything for everybody. This means that we might decide against incorporating a new feature. However, there might be a way to implement that feature on top of API Designer.

### Create issues...

Any significant improvement should be documented as [a GitHub issue](https://github.com/mulesoft/api-designer/issues) before anybody
starts working on it.

### ...but check for existing issues first!

Please take a moment to check that an issue doesn't already exist documenting your bug report or improvement proposal. If it does, it never hurts to add a quick "+1" or "I have this problem too". This will help prioritize the most common problems and requests.

### Conventions

Write clean code. Universally formatted code promotes ease of writing, reading, and maintenance. Make sure to avoid unnecessary white space changes which complicate diffs and make reviewing pull requests much more time consuming.

Pull requests descriptions should be as clear as possible and include a reference to all the issues that they address. In other words, please try to explain in full detail the rationale for the change, and if the change is opaque (or hard) try to explain the fix as much as possible.  

Pull requests must not contain commits from other users or branches.

Commit messages must start with a short summary (max. 50 chars) written in the imperative, followed by an optional, more detailed explanatory text which is separated from the summary by an empty line.

Code review comments may be added to your pull request. Discuss, then make the suggested modifications and push additional commits to your feature branch. Be sure to post a comment after pushing. The new commits will show up in the pull request automatically, but the reviewers will not be notified unless you comment.

Before the pull request is merged, make sure that you squash your commits into logical units of work using `git rebase -i` and `git push -f`. After every commit, the test suite should be passing. Include documentation changes in the same commit so that a revert would remove all traces of the feature or fix.

Commits that fix or close an issue should include a reference like Closes #XXX or Fixes #XXX, which will automatically close the issue when merged.

Commits that change or fix bugs on any UI related sources must be accompanied by a screenshot. That also includes changes on any CSS files.

Commits that introduce new features must be accompanied by a short `.gif` with a demo of the feature in action. If possible, the demo must include error handling and all possible scenarios.

Seriously consider adding tests to any commits, good tests can be very descriptive of the problem you are solving and they greatly improve the development experience for other developers. Obviously, changes to the README or other descriptive files do not need any tests.

Some last words, please do not get discouraged if submitting a small fix, requires you to work in a larger refactor than you were expecting. Sometimes the best fix is not a quick and dirty one, but requires a shift in how the application looks at the model.

### Merge approval

The API Designer maintainers will review your pull request and, if approved, will merge into the main repo. Commits get approval based on the conventions outlined in the previous section. For example, new features without additional tests will be not approved.

### How can I become a maintainer?

* Step 1: learn the code inside out
* Step 2: make yourself useful by
  * contributing code
  * bugfixes
  * support
  * provide feedback on PRs
  * report issues and propose fixes for them
  * documentation
* Step 3: introduce yourself to the other maintainers

Don't forget: being a maintainer is a time investment. Make sure you will have time to make yourself available. You don't have to be a maintainer to make a difference on the project!
