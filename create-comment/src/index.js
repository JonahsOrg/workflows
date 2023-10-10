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
    const nodeId = core.getInput('node_id', { required: true });

    /**
     * Now we need to create an instance of Octokit which will use to call
     * GitHub's REST API endpoints.
     * We will pass the token as an argument to the constructor. This token
     * will be used to authenticate our requests.
     * You can find all the information about how to use Octokit here:
     * https://octokit.github.io/rest.js/v18
     **/
    const octokit = new github.getOctokit(token);

    const message = 'this is a test message';

    await octokit.graphql(
      `
      mutation AddCommentToNode ($nodeId: ID!, $message: String!){
        addComment(
          input: {subjectId: $nodeId, body: $message}
        ) {
          subject {
            id
          }
        } 
      }
      `,
      {
        nodeId,
        message
      }
    );

    console.log('successfully added a comment to the issue');
  } catch (error) {
    console.log(error);
    // Fail the workflow run if an error occurs
    core.setFailed(error.message);
  }
}

run();
