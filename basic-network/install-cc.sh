#!/bin/bash
set -ev

# install chaincode for channelsales1
# docker exec cli peer chaincode install -n ascd-cc -v 1.0 -p chaincode/go
docker exec cli peer chaincode install -l golang -n ascd-cc -v 1.0 -p chaincode/go
docker exec cli peer chaincode instantiate -o orderer.ascdpub.com:7050 -C channelmalware -n ascd-cc -v 1.0 -c '{"Args":[""]}' -P "OR ('Maluser1Org.member')"

# instant test wallet
docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n ascd-cc -c '{"function":"setWallet","Args":["testUser", "1Q2W3E4R"]}'
