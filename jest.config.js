module.exports = {
  runInBand: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  exclude: ['node_modules', 'dist', 'test'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', {
      tsconfig: 'tsconfig.json'
    }]
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^nanoid$': require.resolve('nanoid'),
  },
  transformIgnorePatterns: [
    'node_modules/(?!(nanoid)/)',
  ],
}; 