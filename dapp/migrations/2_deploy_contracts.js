// let MyContract = artifacts.require("./MyContract.sol");

let LicitacaoContract = artifacts.require("./LicitacaoContract.sol");

module.exports = function(deployer) {
  deployer.deploy(LicitacaoContract);
};
