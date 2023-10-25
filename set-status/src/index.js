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
    const issueId = core.getInput('issue_id', { required: true });
    const token = core.getInput('token', { required: true });
    const setStatusTo = core.getInput('set_status_to', { required: true });
    const projectNumber = core.getInput('project_number', { required: true });

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
      query FetchIds($issueId: ID!, $setStatusTo: String!, $projectNumber: Int!) {
        node(id: $issueId) {
          ... on Issue {
            projectV2 (number: $projectNumber) {
              id
            }
            projectItems(first: 10) {
              nodes {
                id # card id
                ... on ProjectV2Item {
                  fieldValueByName(name: "Status") {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      field {
                        ... on ProjectV2SingleSelectField {
                          id # id of the field
                          options (names: [$setStatusTo]) {
                            id  # id of specified field
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      `,
      {
        issueId,
        setStatusTo,
        projectNumber: Number(projectNumber)
      }
    );

    if (!node) return;
    const projectItemNode = node?.projectItems?.nodes[0];

    // grab the ids
    const cardId = projectItemNode?.id;
    const projectId = node?.projectV2?.id;
    const fieldId = projectItemNode?.fieldValueByName?.field?.id;
    const optionId = projectItemNode?.fieldValueByName?.field?.options[0]?.id;

    if (!cardId || !projectId || !fieldId || !optionId) return;

    const payload = { singleSelectOptionId: optionId };

    // changes the card status in the project
    await octokit.graphql(
      `
      mutation UpdateStatusOfProjCard($cardId: ID!, $project: ID!, $field: ID!, $payload: ProjectV2FieldValue!) {
        updateProjectV2ItemFieldValue(
          input: {projectId: $project, itemId: $cardId, fieldId: $field, value: $payload}
        ) {
          projectV2Item {
            id
          }
        }
      }
      `,
      {
        field: fieldId,
        cardId,
        project: projectId,
        payload
      }
    );

    console.log('successfully updated the status in the project');
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message);
  }
}

run();
