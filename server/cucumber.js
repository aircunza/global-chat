const common = [
  "--require-module ts-node/register", // Cargar módulo TypeScript
];

const usersBackend = [
  ...common,
  "tests/apps/users/features/**/*.feature",
  "--require tests/apps/users/features/step_definitions/*.steps.ts",
].join(" ");

module.exports = {
  usersBackend,
};
