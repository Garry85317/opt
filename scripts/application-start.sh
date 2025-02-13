#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

# Stop all servers and start the server
cd /home/ubuntu/oam-web
pm2 startOrReload ecosystem.config.js --env production
pm2 save
sudo systemctl start nginx
sudo systemctl reload nginx
