module.exports = {
  apps: [
    {
      name: 'poe-flip',
      script: './dist/server/main.js',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
  ],
};
