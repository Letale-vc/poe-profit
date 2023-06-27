module.exports = function (wallaby) {
  return {
    autoDetect: true,
    files: [
      'src/**/*.+(ts|tsx|json|snap|css)',
      '!src/**/*.spec.+(ts|tsx)',
    ],
    tests: [
      'src/**/*.spec.+(ts|tsx)',
    ],
    env: {
      type: 'node',
  },
  }
};