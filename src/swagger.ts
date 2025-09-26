import merge from "deepmerge";

import YAML from "yamljs";

const base = YAML.load("./src/docs/openapi.yaml");
const auth = YAML.load("./src/docs/auth.yaml");
const user = YAML.load("./src/docs/user.yaml");
const task = YAML.load("./src/docs/task.yaml");

const swaggerSpec = {
  ...base,
  paths: merge.all([base.paths || {}, auth, user, task]),
};

export default swaggerSpec;
