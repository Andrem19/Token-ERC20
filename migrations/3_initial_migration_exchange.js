//https://ethereum.stackexchange.com/questions/29812/truffle-migrate-how-to-deploy-a-contract-whose-constructor-takes-a-parameter/29856

const Exchange = artifacts.require("Exchange");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Exchange, accounts[1], 0);
};
