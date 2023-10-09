// https://docs.github.com/graphql

// packages
const core = require('@actions/core');
// const github = require('@actions/github');

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
  const owner = core.getInput('owner', { required: true });
  const repo = core.getInput('repo', { required: true });
  const issueNumber = core.getInput('issue_number', { required: true });
  const token = core.getInput('token', { required: true });
  const label = core.getInput('label', { required: true });

  /**
   * Now we need to create an instance of Octokit which will use to call
   * GitHub's REST API endpoints.
   * We will pass the token as an argument to the constructor. This token
   * will be used to authenticate our requests.
   * You can find all the information about how to use Octokit here:
   * https://octokit.github.io/rest.js/v18
   **/
  const octokit = new github.getOctokit(token);

  // fetch the ids of the parsed label and issue number
  const { repository } = await octokit.graphql(
   `
    query FetchLabelAndIssueIds($owner: String!, $repo: String!, $labelName: String!, $issueNumber: Int!, $branchName: String!) {
      repository(owner: $owner, name: $repo) {
        label(name: $labelName) {
          id # label id
        }
        issue(number: $issueNumber) {
          id # issue id
        }
      }
    }
  `,
   {
    owner,
    repo,
    labelName: label,
    issueNumber: Number(issueNumber),
    branchName: branchToCopy
   }
  );

  if (!repository) return;

  // grab the ids
  const labelId = repository?.label?.id;
  const issueId = repository?.issue?.id;

  if (!labelId || !issueId) return;

  // labels the issue
  await octokit.graphql(
   `
    mutation SetLabelOnIssue( $issueId: ID!, $labelId: ID! )  {
      addLabelsToLabelable(input: {labelableId: $issueId, labelIds: [$labelId]}) {
        clientMutationId
      }
    }
    `,
   {
    issueId,
    labelId
   }
  );

  console.log('successfully labeled the issue');
 } catch (error) {
  // Fail the workflow run if an error occurs
  core.setFailed(error.message);
 }
}

run();
