const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const Wallet = require('ethereumjs-wallet');
const hdkey = require('ethereumjs-wallet/hdkey');
const bip39 = require('bip39');

import {loadAccounts, saveAccount} from "../src/util/db";


const privateKey = new Buffer('cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05', 'hex');

const privateKeyString = 'cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05';

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));

const abi = [{"constant":true,"inputs":[],"name":"AVG_PRICE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_gameId","type":"uint256"},{"name":"_seed","type":"bytes32"}],"name":"reviewResults","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"games","outputs":[{"name":"hashedSeed","type":"bytes32"},{"name":"blockNumberToUse","type":"uint256"},{"name":"spinner","type":"address"},{"name":"state","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_gameId","type":"uint256"}],"name":"pickSpinner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_gameId","type":"uint256"}],"name":"guessTails","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_gameId","type":"uint256"},{"name":"_hashedSeed","type":"bytes32"}],"name":"flipKip","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_gameId","type":"uint256"}],"name":"guessHeads","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"createGame","outputs":[{"name":"_gameId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_boxer","type":"address"}],"name":"setBoxer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_gameId","type":"uint256"}],"name":"newSpinner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"gameId","type":"uint256"},{"indexed":false,"name":"result","type":"uint256"}],"name":"TwoUpResult","type":"event"}]

const contractAddress = '0x624a5458c3ceb82E0ef1830b9a7a25525d07F69e';

const publicAddress = '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7';

//TwoUpContract Object
const TwoUpContract = new web3.eth.Contract(abi, contractAddress);


export const createWallet = async () => {
  // const accounts = await loadAccounts();
  // if (accounts.length === 0) {
    console.log('Account Saved ✅')
    const newWallet = Wallet.generate();
    const privKey = newWallet.getPrivateKeyString();
    const { address } = web3.eth.accounts.privateKeyToAccount(privKey);
    console.log('PRIVKEY: ', privKey);
    console.log('PUBKEY: ', address);
    const account = {
      "privKey": privKey.substring(2),
      "address": address.substring(2)
    };
    saveAccount(account);
  // }
};

export const _sendETH = async (_addr, _amount, _data) => {
  if(addr && amount) {
    const nonce = await web3.eth.getTransactionCount('0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
    const data = _data || '';
    // var send = web3.eth.sendTransaction({from:eth.coinbase,to:contract_address, value:web3.toWei(0.05, "ether")});
    const chainId = await web3.eth.net.getId();
    const rawTx = {
      nonce: nonce,
      from: '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7',
      to: '0x624a5458c3ceb82E0ef1830b9a7a25525d07F69e',
      value: 100000000000000,
      gasPrice: 20000000000,
      gasLimit: 3000000,
      data,
      chainId,
    };

    const tx = new Tx(rawTx);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', (txHash) => {
        console.log('TransactionHash:' , txHash);
        // this.setState({log: 'Pending Transaction', logColor: 'red', transactionHash: txHash})
      })
      .on('receipt', (rec) => {
        console.log('Receipt:' , rec);
        // this.setState({log: 'Transaction Complete', logColor: 'green', transactionHash: rec.transactionHash})
      })
  }
};

export const _callFunction = async (_method, _variable1 = false, _variable2 = false) => {
  console.log('CONTRACT: ', TwoUpContract);

  const data = await TwoUpContract.methods.createGame();


  const nonce = await web3.eth.getTransactionCount('0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7');
    const chainId = await web3.eth.net.getId();

  const rawTx = {
    nonce: nonce,
    from: '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7',
    to: '0xd4a0d9531Bf28C26869C526b2cAd2F2eB77D3844',
    value: 100000000000,
    gasPrice: 20000000000,
    gasLimit: 3000000,
    data,
    chainId,
  };


  console.log('Nonce: ', nonce);
    // console.log('GasPrice: : ', gasPrice);
    console.log('Data: ', data);
    console.log('PublicAddress: ', publicAddress);
    console.log('ContractAddress: ', contractAddress);
    console.log('Tx: ', rawTx);

    const tx = new Tx(rawTx);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', (txHash) => {
        console.log('TransactionHash:', txHash);
        this.setState({log: 'Pending Transaction', logColor: 'red', transactionHash: txHash})
      })
      .on('receipt', (rec) => {
        console.log('Receipt:', rec);
        this.setState({log: 'Transaction Complete', logColor: 'green', transactionHash: rec.transactionHash})
      })
};

export const _getFunction = (_method) => {
  TwoUpContract.methods.createGame()
    .call().then((data) => this.setState({personsId: 'First Name: ' + data[0] + ', Age: ' + data[1]}))
};

export const init = () => {
  console.log("initialising...");
  return initWalletForm();
}

export const initWalletForm = () => {
  console.log("initialising wallet ...");
  const mnemonic = bip39.generateMnemonic();
  const newWallet = hdkey.fromMasterSeed(mnemonic).getWallet();
  console.log('NEW WALLET CHECKSUM', newWallet.getChecksumAddressString());
  console.log('MENMONIV: ', mnemonic);
  return newWallet;
}
