#!/bin/bash
set -ev

CHAIN_CODE=ascd-cc

# install chaincode for channelsales1
# docker exec cli peer chaincode install -n ascd-cc -v 1.0 -p chaincode/go

docker exec cli peer chaincode install -l golang -n $CHAIN_CODE -v 1.0 -p chaincode/go
docker exec cli peer chaincode instantiate -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -v 1.0 -c '{"Args":[""]}' -P "OR ('Maluser1Org.member')"
sleep 3

# # instant test wallet
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"setWallet","Args":["testUser1"]}'
# sleep 2
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"setWallet","Args":["testUser2"]}'
# sleep 2
# # instant test Malicious code
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"setCode","Args":["alias1", "testUser1", "temp_hash1"]}'
# sleep 2
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"setCode","Args":["alias2", "testUser1", "temp_hash2"]}'
# sleep 2
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"setCode","Args":["alias3", "testUser2", "temp_hash3"]}'
# sleep 2

# # test getWallet function
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getWallet","Args":["testUser1"]}'
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getWallet","Args":["testUser2"]}'

# # test getCode function
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getCode","Args":["alias1"]}'
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getCode","Args":["testUser1"]}'
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getCode","Args":["temp_hash1"]}'
# docker exec cli peer chaincode invoke -o orderer.ascdpub.com:7050 -C channelmalware -n $CHAIN_CODE -c '{"function":"getCode","Args":["alias3"]}'


