#!/bin/bash
set -ev

# docker-compose -f docker-compose-ca.yaml up -d ca.sales1.acornpub.com
docker-compose -f docker-compose-ca.yaml up -d ca.maluser1.ascdpub.com

sleep 1
cd $GOPATH/src/Ascode/application/sdk
node enrollAdmin.js
sleep 1
node registUser.js
