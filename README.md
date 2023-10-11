# workflows
Central hub for CI/CD workflows across our projects. Ensures consistency, streamlines updates, and fosters best practices. Workflows are versioned for reliable integration and deployment. Facilitates optimized automation for all repositories.


## Todo
- [x] Create an environment variable for the label and use it to create / add a label to a node
- [X] Create environment variable for the branch to copy into a new feature branch
- [x] Set an output variable of the linked branch name to use in create-pr
- [x] Create an organization PAT for accessing projects
- [x] Make a regex pattern that branch names have to fit in order to be created
- [ ] change the names on the yml files to be more reusable (ex. create-pr uses a var called 'linked_branch_name', change to 'branch_name')
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
- [ ] figure out a way to do hot fixes / bug fixes -- don't really like having a specific status/column for them
- [ ] ? Use a json file to manage the labels for a repo
- [ ] ? Set success output variables on the steps that I can check to create a success comment
- [ ] Set output variables on the pull request and issue ticket that I can use to link them together with comments
  - [ ] ---or--- figure out a way to actually link the pr and issue tickets (probably with the branch somehow)
- [ ] Add in error handling
  - [ ] Create outputs for the actions indicating whether or not they were successful
  - [ ] add error handling to set-status for when an issue is not linked to a project
- [ ] Create an action that deletes linked branches, pull requests, etc when the issue is something'd for ez clean up


## Create and publish a release through the command line
| Step | Description | Command | Example |
|------|-------------|---------|---------|
| 1 | Ensure you're on the correct branch | `git checkout <branch-name>` | `git checkout main` |
| 2 | Pull the latest changes | `git pull origin <branch-name>` | `git pull origin main` |
| 3 | Update the version number | (Depends on your project, e.g., update `package.json`) | Edit `package.json` |
| 4 | Commit the version change | `git add .`<br>`git commit -m "Bump version to x.x.x"` | `git add .`<br>`git commit -m "Bump version to 1.0.0"` |
| 5 | Tag the commit | `git tag -a v<x.x.x> -m "Release version x.x.x"` | `git tag -a v1.0.0 -m "Release version 1.0.0"` |
| 6 | Push the changes and tags | `git push origin <branch-name>`<br>`git push origin v<x.x.x>` | `git push origin main`<br>`git push origin v1.0.0` |
| 7 | (Optional) Create a GitHub Release | `gh release create v<x.x.x>` | `gh release create v1.0.0` |
| 8 | (Optional) Publish | (Depends on your project, e.g., `npm publish`) | `npm publish` |
