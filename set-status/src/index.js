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

    const statusName = 'In Development';

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
      query FetchIds($issueId: ID!, $statusName: String!) {
        node(id: $issueId) {
          ... on Issue {
            projectItems(first: 10) {
              nodes {
                id # card id
                project {
                  id # project id
                }
                ... on ProjectV2Item {
                  fieldValueByName(name: "Status") {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      field {
                        ... on ProjectV2SingleSelectField {
                          id # id of the field
                          options (names: [$statusName]) {
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
        statusName
      }
    );

    if (!node) return;

    // grab the ids
    const cardId = node?.projectItems?.nodes[0]?.id;
    const projectId = node?.projectItems?.nodes[0]?.project?.id;

    console.log(node?.projectItems?.nodes[0]);

    if (!cardId || !projectId) return;

    console.log({ cardId, projectId });

    // const tempPayload = { singleSelectOptionId: '4b2fdd91' };

    // changes the card status in the project
    // await octokit.graphql(
    //   `
    //   mutation UpdateStatusOfProjCard($item: ID!, $project: ID!, $field: ID!, $payload: ProjectV2FieldValue!) {
    //     updateProjectV2ItemFieldValue(
    //       input: {projectId: $project, itemId: $item, fieldId: $field, value: $payload}
    //     ) {
    //       projectV2Item {
    //         id
    //       }
    //     }
    //   }
    //   `,
    //   {
    //     field: fieldId || 'PVTSSF_lAHOBk645c4AVbXfzgNsVfc',
    //     item: projectCardId || 'PVTI_lAHOBk645c4AVbXfzgJgFoE',
    //     project: projectId || 'PVT_kwHOBk645c4AVbXf',
    //     payload: payloadObj || tempPayload
    //   }
    // );

    console.log('successfully updated the status in the project');
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message);
  }
}

run();
