const Yup = require("yup");

const validateUUID = require("../utils/uuidValidator");

module.exports = async (req, res, next) => {
  const { id } = req.params;

  let error = null;

  if (!validateUUID(id)) {
    error = "Invalid UUID";
  }

  const respositorySchema = Yup.object().shape({
    title: Yup.string().nullable(),
    url: Yup.string().url().nullable(),
    techs: Yup.array().of(Yup.string()).nullable(),
  });

  await respositorySchema.validate(req.body).catch((err) => {
    error = err.message;
  });

  if (error) return res.status(400).json({ error });
  else {
    return next();
  }
};
