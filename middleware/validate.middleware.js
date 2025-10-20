export const validate = (req, res, next) => {
  const { value } = req.body;

  if (!value)
    return res.status(400).json({ success: false, error: "No data provided" });

  if (typeof value != "string")
    return res
      .status(422)
      .json({ success: false, error: "Data must be a string" });

  next();
};
