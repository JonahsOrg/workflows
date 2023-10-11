// https://docs.github.com/graphql

// packages
const core = require('@actions/core');
const github = require('@actions/github');

function createBranchName(title) {
  // Convert to lowercase
  let branchName = title.toLowerCase();

  // Replace spaces with hyphens
  branchName = branchName.replace(/\s+/g, '-');
  // Remove special characters
  branchName = branchName.replace(/[^a-z0-9_-]/g, '');

  // Optional: truncate if too long
  // const maxLength = 50; // adjust as needed
  // if (branchName.length > maxLength) {
  //   branchName = branchName.substring(0, maxLength);
  // }

  // Optional: add prefix (e.g., "feature/")
  branchName = 'feature/' + branchName;
  return branchName;
}

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
async function run() {
  try {
    /**
     * We need to fetch all the inputs that were provided to our action
     * and store them in variables for us to use.
     **/
    const token = core.getInput('token', { required: true });
    const repoId = core.getInput('repo_id', { required: true });
    const issueId = core.getInput('issue_id', { required: true });
    const issueTitle = core.getInput('issue_title', { required: true });
    const branchToCopy = core.getInput('branch_to_copy', { required: true });

    const branchName = createBranchName(branchToCopy);
    // this is the branch that is copied for each new issue branch when it is opened
    // has to be formatted as refs/heads/<branch-name>

    // need to change this to force branch names to fit a regex pattern
    const branchToCopyRef = `refs/heads/${branchName}`;

    /**
     * Now we need to create an instance of Octokit which will use to call
     * GitHub's REST API endpoints.
     * We will pass the token as an argument to the constructor. This token
     * will be used to authenticate our requests.
     * You can find all the information about how to use Octokit here:
     * https://octokit.github.io/rest.js/v18
     **/
    const octokit = new github.getOctokit(token);

    const { node } = await octokit.graphql(
      `
      query FetchLatestCommitOfBranch($repoId: ID!, $branchName: String!) {
        node(id: $repoId) {
          ... on Repository {
            ref(qualifiedName: $branchName) {
              target {
                oid
              }
            }
          }
        }
      }
    `,
      {
        repoId,
        branchName: branchToCopyRef
      }
    );

    const latestCommitSHA = node?.ref?.target?.oid;
    if (!latestCommitSHA) return console.log('could not get the latestCommitSHA');

    const newBranchName = `refs/heads/${issueTitle.split(' ').join('-')}`;
    const { createLinkedBranch: res } = await octokit.graphql(
      `
      mutation CreateNewBranch($branch: String!, $sha: GitObjectID!, $assignToIssue: ID!, $repoId: ID!) {
        createLinkedBranch(
          input: {name: $branch, oid: $sha, repositoryId: $repoId, issueId: $assignToIssue}
        ) {
          linkedBranch {
            ref {
              name
            }
          }
        }
      }
      `,
      {
        repoId,
        sha: latestCommitSHA,
        branch: newBranchName,
        assignToIssue: issueId
      }
    );

    const linkedBranchName = res?.linkedBranch?.ref?.name;
    core.setOutput('linkedBranchName', linkedBranchName);

    console.log('successfully created the linked branch');
  } catch (error) {
    console.log(error);
    // Fail the workflow run if an error occurs
    core.setFailed(error.message);
  }
}

run();
