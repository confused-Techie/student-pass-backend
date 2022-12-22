
async function decodeQueryActions(paramAction) {
  // This expects a string of actions seperated by commas, with no periods.
  let action_array = paramAction.split(",");
  console.log(action_array);
  return {
    ok: true,
    content: action_array
  };
}

module.exports = {
  decodeQueryActions,
};
