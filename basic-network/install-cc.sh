#!/bin/bash
set -ev

CHAIN_CODE=ascd-cc-26

# install chaincode for channelsales1
# docker exec cli peer chaincode install -n ascd-cc -v 1.0 -p chaincode/go
docker exec cli peer chaincode install -l golang -n $CHAIN_CODE -v 1.0 -p chaincode/go
docker exec cli peer chaincode instantiate -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -v 1.0 -c '{"Args":[""]}' -P "OR ('Maluser1Org.member')"


# instant test wallet
docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"setWallet","Args":["1Q2W3E4R"]}'
sleep 2
docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"setCode","Args":["testCodeID", "1Q2W3E4R", "temp_hash"]}'
sleep 2
docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getWallet","Args":["1Q2W3E4R"]}'

docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getCode","Args":["testCodeID"]}'

docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getAllCode","Args":[""]}'

docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getWallet","Args":["1Q2W3E4R"]}'
