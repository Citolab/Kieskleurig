const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/apps/burgerschap-leerling',
    '<rootDir>/libs/data',
    '<rootDir>/apps/burgerschap-leraar',
    '<rootDir>/libs/ui',
    '<rootDir>/apps/functions',
  ],
};
