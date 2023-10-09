// https://docs.github.com/graphql

// packages
const core = require('@actions/core');
const github = require('@actions/github');

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
  const issueTitle = core.getInput('issue_title', { required: true });
  const mergeIntoBranch = core.getInput('merge_into_branch', { required: true });
  // mergeIntoBranch syntax ex. "staging", "development"

  /**
   * Now we need to create an instance of Octokit which will use to call
   * GitHub's REST API endpoints.
   * We will pass the token as an argument to the constructor. This token
   * will be used to authenticate our requests.
   * You can find all the information about how to use Octokit here:
   * https://octokit.github.io/rest.js/v18
   **/
  const octokit = new github.getOctokit(token);

  /* const res =  */ await octokit.graphql(
   `
    mutation CreateNewPullRequest ($pullName: String!, $headRef: String!, $baseRef: String!, $repoId: ID!) {
      createPullRequest(
        input: {baseRefName: $baseRef, headRefName: $headRef, title: $pullName, repositoryId: $repoId}
      ) {
        pullRequest {
          title 
          permalink
          number
          id
        }
      }
    }
    `,
   {
    repoId,
    headRef: `${issueTitle.split(' ').join('-')}`,
    baseRef: mergeIntoBranch,
    pullName: `New feature - ${issueTitle}`
   }
  );

  /*   const pullRequestURL = res?.createPullRequest?.pullRequest?.permalink;
  const pullRequestNum = res?.createPullRequest?.pullRequest?.number;
  const pullRequestId = res?.createPullRequest?.pullRequest?.id;

  console.log({
   pullRequestURL,
   pullRequestNum,
   pullRequestId
  }); */

  console.log('successfully created the pull request');
 } catch (error) {
  console.log(error);
  // Fail the workflow run if an error occurs
  core.setFailed(error.message);
 }
}

run();
