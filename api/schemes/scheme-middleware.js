const db = require("../../data/db-config");

async function checkSchemeId(req, res, next) {
  let scheme = await db("schemes")
    .where({ scheme_id: req.params.scheme_id })
    .first();
  if (!scheme) {
    next({
      message: `scheme with scheme_id ${req.params.scheme_id} not found`,
      status: 404,
    });
  } else {
    next();
  }
}

const validateScheme = (req, res, next) => {
  let { scheme_name } = req.body;
  if (!scheme_name || typeof scheme_name != "string" || !scheme_name.trim()) {
    next({ message: "invalid scheme_name", status: 400 });
  } else {
    next();
  }
};

const validateStep = (req, res, next) => {
  let { instructions, step_number } = req.body;
  if (
    !instructions ||
    typeof instructions != "string" ||
    !instructions.trim() ||
    typeof step_number != "number" ||
    step_number < 1
  ) {
    next({ message: "invalid step", status: 400 });
  } else {
    next();
  }
};

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
};