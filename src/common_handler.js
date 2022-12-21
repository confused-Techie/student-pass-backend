
async function handleError(req, res, statusObj) {
  console.log(statusObj.content.content);
  res.status(500).json({
    message: statusObj.content.short,
    detail: statusObj.content.detail
  });
}

module.exports = {
  handleError,
};
