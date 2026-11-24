module.exports = {
  apps: [{
    name: 'bikecaucasus',
    cwd: '/home/www/bikecaucasus',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 8055',
    interpreter: 'node',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    max_memory_restart: '512M',
    env: { NODE_ENV: 'production', PORT: '8055' },
    error_file: '/root/.pm2/logs/bikecaucasus-error.log',
    out_file: '/root/.pm2/logs/bikecaucasus-out.log',
    time: true,
    merge_logs: true
  }]
};