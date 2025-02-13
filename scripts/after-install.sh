#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

mkdir -p /home/ubuntu/oam-web
cd /home/ubuntu/oam-web
sudo cp -i ./scripts/nginx/nginx.conf /etc/nginx/nginx.conf
sudo cp -i ./scripts/nginx/oam-web.conf /etc/nginx/sites-available/oam-web.conf
sudo ln -sfn /etc/nginx/sites-available/oam-web.conf /etc/nginx/sites-enabled/oam-web.conf
sudo rm -rf /etc/nginx/sites-enabled/default
sudo rm -rf /etc/nginx/sites-available/default
sed "s#\${CWD}#/home/ubuntu/oam\-web#g" ecosystem.config.example.js >ecosystem.config.js
