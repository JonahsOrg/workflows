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
    const repoId = core.getInput('repo_id', { required: true });
    const issueId = core.getInput('issue_id', { required: true });
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
    const { node } = await octokit.graphql(
      `
        query FetchLabelAndIssueIds($repoId: ID!, $labelName: String!) {
          node(id: $repoId) {
              ... on Repository {
              label(name: $labelName) {
                id
              }
            }
          }
        }
      `,
      {
        repoId,
        labelName: label
      }
    );

    if (!node) return;

    // grab the ids
    const labelId = node?.label?.id;
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
