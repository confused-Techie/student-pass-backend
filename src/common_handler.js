
async function handleError(req, res, statusObj) {
  console.log(statusObj.content);
  res.status(500).json({
    message: statusObj.short,
    detail: statusObj.detail
  });
}

module.exports = {
  handleError,
};
