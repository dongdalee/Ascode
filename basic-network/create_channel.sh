# ==================================================================
# create channelmalware
docker exec cli peer channel create -o orderer.ascdpub.com:7050 -c channelmalware -f /etc/hyperledger/configtx/channel1.tx


# ==================================================================
# join peer0 to the channelmalware and update the Anchor Peers in Channel1
docker exec cli peer channel join -b channelmalware.block
docker exec cli peer channel update -o orderer.ascdpub.com:7050 -c channelmalware -f /etc/hyperledger/configtx/Malware1Organchors.tx

# pper1 node join to the channelmalware
docker exec -e "CORE_PEER_ADDRESS=peer1.maluser1.ascdpub.com:7051" cli peer channel join -b channelmalware.block


# ==================================================================
# Join peer0 to the channel and 
docker exec -e "CORE_PEER_LOCALMSPID=Maluser2Org" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/maluser2.ascdpub.com/users/Admin@maluser2.ascdpub.com/msp" -e "CORE_PEER_ADDRESS=peer0.maluser2.ascdpub.com:7051" cli peer channel join -b channelmalware.block
docker exec -e "CORE_PEER_LOCALMSPID=Maluser2Org" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/maluser2.ascdpub.com/users/Admin@maluser2.ascdpub.com/msp" -e "CORE_PEER_ADDRESS=peer0.maluser2.ascdpub.com:7051" cli peer channel update -o orderer.ascdpub.com:7050 -c channelmalware -f /etc/hyperledger/configtx/Malware2Organchors.tx

# join peer1 to the channel
docker exec -e "CORE_PEER_LOCALMSPID=Maluser2Org" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/maluser2.ascdpub.com/users/Admin@maluser2.ascdpub.com/msp" -e "CORE_PEER_ADDRESS=peer1.maluser2.ascdpub.com:7051" cli peer channel join -b channelmalware.block