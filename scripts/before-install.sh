#!/bin/bash
# Install node.js and PM2 globally
sudo apt-get -y update
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"                   # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion
sudo apt-get -y install redis
sudo apt-get -y install nginx
nvm install 16.19.0
npm install yarn -g
npm install pm2 -g
