#!/bin/bash
set -ev

# if you want current block input the BLOCK_NUM=newest
BLOCK_NUM=6

rm -rf ledgersData
mkdir ledgersData

docker exec cli peer channel fetch $BLOCK_NUM -c channelmalware

docker cp cli:/opt/gopath/src/github.com/hyperledger/fabric/peer/channelmalware_$BLOCK_NUM.block ./ledgersData

cp -r ./ledgersData/channelmalware_$BLOCK_NUM.block ./bin/

cd ./bin/

../bin/configtxgen -inspectBlock channelmalware_$BLOCK_NUM.block > blockfile$BLOCK_NUM.json

rm -rf channelmalware_$BLOCK_NUM.block
mv blockfile$BLOCK_NUM.json ./../ledgersData/

# docker cp peer0.maluser1.ascdpub.com:/var/hyperledger/production/ledgersData/ ./




