module.exports = {
  apps: [
    {
      name: 'OAM-web',
      script: './server.js',
      cwd: '${CWD}',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      // out_file: '/dev/null',
      // error_file: '/dev/null',
    },
  ],
};
