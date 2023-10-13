# workflows
Central hub for CI/CD workflows across our projects. Ensures consistency, streamlines updates, and fosters best practices. Workflows are versioned for reliable integration and deployment. Facilitates optimized automation for all repositories.




## Todo
- [x] Create an environment variable for the label and use it to create / add a label to a node
- [x] Create environment variable for the branch to copy into a new feature branch
- [x] Set an output variable of the linked branch name to use in create-pr
- [x] Create an organization PAT for accessing projects
- [x] Make a regex pattern that branch names have to fit in order to be created
- [x] change the variable names on the action files to be more reusable (ex. create-pr uses a var called 'linked_branch_name', change to 'branch_name')
- [x] link the pr and issue with comments
- [x] figure out a way to do hot fixes / bug fixes -- don't really like having a specific status/column for them
  - [ ] use custom field properties -- like type = feature, bug, task, etc. 
- [ ] Mark a branch as stale / needs rebase after becoming 30+ commits behind main
- [ ] Lint a branch after a push
  - [ ] https://github.com/super-linter/super-linter
- [ ] Add/edit a changelog for a pull request on each commit to the branch
- [ ] Add size to project cards
- [ ] remove environment from custom fields
- [ ] Create a template "core" repository that includes the basic github workflows for a core.
- [ ] Create a template "submodule" repository that includes the basic github workflows for a submodule.
- [ ] change the trigger from the issue creation to ? attaching a label or setting the type or etc
  - [ ] Use a json file to manage the labels for a repo
- [ ] add a task list including the pr to the issue - https://docs.github.com/en/issues/managing-your-tasks-with-tasklists/about-tasklists
  - [ ] create an edit description action
- [ ] make a create repository action for a core repo 
  - [ ] create a repo
  - [ ] add the repo as a submodule to the repo
- [ ] make a create release action for a repo
- [ ] make a merge pull request action for a repo
  - [ ] need to figure out what would trigger it, probably a label
- [ ] make a "build" action for a repo
  - [ ] run the build command for a repo and output to a desired location
  - [ ] if core - detect all the submodules
    - [ ] run a build command for each compiled to one app
- [ ] ? Use success output variables from the steps that checks before attaching a label to mark it ready / failed
  - [ ] if failed attach a comment describing what failed
- [x] Set output variables on the pull request and issue ticket that I can use to link them together with comments
  - [ ] ---or--- figure out a way to actually link the pr and issue tickets (probably with the branch somehow)
- [ ] add error handling to set-status for when an issue is not linked to a project
- [ ] Create an action that deletes linked branches, pull requests, etc when the issue is something'd for ez clean up


## Create and publish a release through the command line
| Description | Command | Example |
|------|-------------|---------|---------|
| Ensure you're on the correct branch | `git checkout <branch-name>` | `git checkout main` |
| Pull the latest changes | `git pull origin <branch-name>` | `git pull origin main` |
| Update the version number | (Depends on your project, e.g., update `package.json`) | Edit `package.json` |
| Commit the version change | `git add .`<br>`git commit -m "Bump version to x.x.x"` | `git add .`<br>`git commit -m "Bump version to 1.0.0"` |
| Tag the commit | `git tag -a v<x.x.x> -m "Release version x.x.x"` | `git tag -a v1.0.0 -m "Release version 1.0.0"` |
| Push the changes and tags | `git push origin <branch-name>`<br>`git push origin v<x.x.x>` | `git push origin main`<br>`git push origin v1.0.0` |
| (Optional) Create a GitHub Release | `gh release create v<x.x.x>` | `gh release create v1.0.0` |
| (Optional) Publish | (Depends on your project, e.g., `npm publish`) | `npm publish` |
