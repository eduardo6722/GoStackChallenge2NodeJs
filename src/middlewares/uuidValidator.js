const validateUUID = require("../utils/uuidValidator");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  let error = null;

  if (!validateUUID(id)) {
    error = "Invalid UUID";
  }

  if (error) return res.status(400).json({ error });
  else {
    return next();
  }
};
