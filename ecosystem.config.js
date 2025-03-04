module.exports = {
  apps: [{
    name: "text-file-splitter",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production",
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
