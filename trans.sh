#!/bin/sh

if [ $1 = "install" ]; then
    sudo npm i --prefix ./back
    sudo npm i --prefix ./front
elif [ $1 = "start" ]; then
    sudo -i -u postgres &
    npm --prefix ./back run start:dev &
    npm --prefix ./front run serve &
fi