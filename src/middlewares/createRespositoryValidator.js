const Yup = require("yup");

module.exports = async (req, res, next) => {
  let error = null;

  const respositorySchema = Yup.object().shape({
    title: Yup.string().required(),
    url: Yup.string().url().required(),
    techs: Yup.array().of(Yup.string()).required(),
  });

  await respositorySchema.validate(req.body).catch((err) => {
    error = err.message;
  });

  if (error) return res.status(400).json({ error });
  else return next();
};
