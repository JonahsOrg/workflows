# workflows
Central hub for CI/CD workflows across our projects. Ensures consistency, streamlines updates, and fosters best practices. Workflows are versioned for reliable integration and deployment. Facilitates optimized automation for all repositories.


## Todo
- [ ] Create outputs for the actions indicating whether or not they were successful
- [ ] Add in error handling
- [x] Create an environment variable for the label and use it to create / add a label to a node
- [ ] Make a regex pattern that branch names have to fit in order to be created
- [X] Create environment variable for the branch to copy into a new feature branch
- [ ] Use a json file to create / house the labels for a repository


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
