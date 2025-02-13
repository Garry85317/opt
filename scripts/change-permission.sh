#!/bin/bash

chown ubuntu:ubuntu -R /home/ubuntu/oam-web
find /home/ubuntu/oam-web -type d -exec chmod 755 {} \;
