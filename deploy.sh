#!/bin/bash

# Git pull to fetch the latest changes
git pull

# Yarn install to install dependencies
yarn install

# Yarn build to build the application
yarn build

# Restart the server
yarn start
