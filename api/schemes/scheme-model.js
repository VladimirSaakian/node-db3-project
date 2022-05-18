const db = require("../../data/db-config");

function find() {
  return db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id", "asc")
    .select("sc.*")
    .count("st.step_id as number_of_steps");
}

async function findById(scheme_id) {
  let results = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number", "asc")
    .select(
      "sc.scheme_id as scheme_id",
      "sc.scheme_name as scheme_name",
      "st.step_id as step_id",
      "st.step_number as step_number",
      "st.instructions as instructions"
    );

  if (results.length == 0) {
    return null;
  }

  const scheme = {
    scheme_id: results[0].scheme_id,
    scheme_name: results[0].scheme_name,
    steps: [],
  };

  for (let result of results) {
    if (result.instructions != null) {
      scheme.steps.push({
        step_id: result.step_id,
        step_number: result.step_number,
        instructions: result.instructions,
      });
    }
  }
  return scheme;
}

async function findSteps(scheme_id) {
  return db("steps as st")
    .join("schemes as sc", "sc.scheme_id", "st.scheme_id")
    .orderBy("st.step_number")
    .select(
      "st.step_id as step_id",
      "st.step_number as step_number",
      "st.instructions as instructions",
      "sc.scheme_name as scheme_name"
    )
    .where({ "sc.scheme_id": scheme_id });
}

function add(scheme) {
  return db("schemes")
    .insert(scheme)
    .then(([scheme_id]) => {
      return findById(scheme_id);
    });
}

async function addStep(scheme_id, step) {
  return db("steps")
    .insert({ ...step, scheme_id })
    .then(() => {
      return db("steps as st")
        .join("schemes as sc", "sc.scheme_id", "st.scheme_id")
        .select("step_id", "step_number", "instructions", "scheme_name")
        .orderBy("step_number")
        .where("sc.scheme_id", scheme_id);
    });
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};