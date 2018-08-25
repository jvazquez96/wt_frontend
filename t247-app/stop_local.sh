#! /bin/bash
sudo lsof -t -i tcp:4200 | xargs kill -9
sudo kill -9 $(ps aux | grep '[@]angular/cli' | awk '{print $2}')
