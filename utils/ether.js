const Tx = require('ethereumjs-tx');
const Wallet = require('ethereumjs-wallet');
const hdkey = require('ethereumjs-wallet/hdkey');
const bip39 = require('bip39');
const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));

import {getKey, getPubKey, saveAccount, saveKey, savePubKey} from "../src/util/db";

const privateKey2 = new Buffer('cf06f0b35515af10b5dfef470e3a1e743470bf9033d06f198b4e829cb2e7ef05', 'hex');

const tokenAbi = [{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"who","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"}];

const tenzToken = new web3.eth.Contract(tokenAbi , "0xb07c36074b8333b01e38a307df804fdc6c37e0ec");



const contractAddress = '0x624a5458c3ceb82E0ef1830b9a7a25525d07F69e';
const personalWalletAddress = "0xf74694642a81a226771981cd38df9105a133c111";
// const personalWalletAddress = "0xf8894138aa4d7b54b7d49afa9d5600cdb5178721";
const privateKey = new Buffer('2e5a537948b5d4dd63f690f5a82f8591cb5c41a562c9cce850adfb29a99a8cc5', 'hex');
const publicAddress = "0x9E48c4A74D618a567CD657579B728774f35B82C5";

import { initSdk } from 'tenzorum'

export const initApp = async () => {
  const pubKey = await getPubKey();
  if (pubKey === undefined) {
      const newWallet = Wallet.generate();
      const { address } = web3.eth.accounts.privateKeyToAccount(newWallet.getPrivateKeyString().substring(2));
      await saveKey(newWallet.getPrivateKeyString().substring(2));
      await savePubKey(address);
  }
  let pk = privateKey;
  // let pk =  await getKey()
  // console.log(pk.substring(2))
  // pk = new Buffer(pk.substring(2), 'hex');
  // console.log(pk)
  initSdk(web3, pk, personalWalletAddress)
};

export const getTenzBalance = async (address) => {
  const personalMultiSig = address || '0xF74694642a81A226771981cd38df9105A133c111';
  let balance = await tenzToken.methods.balanceOf(personalMultiSig).call();
  return Math.floor(web3.utils.fromWei(balance, "ether"));
};

export const getBalance = async (address) => await web3.eth.getBalance(address).then(res => Math.round(web3.utils.fromWei(res, "ether")*100)/100);

export const _sendETH = async (_addr, _amount, _data) => {
  const publicAddress = getPubKey();
  if(addr && amount) {
    const nonce = await web3.eth.getTransactionCount(publicAddress);
    const data = _data || '';
    const chainId = await web3.eth.net.getId();
    const rawTx = {
      nonce: nonce,
      from: publicAddress,
      to: _addr,
      value: 100000000000000,
      gasPrice: 20000000000,
      gasLimit: 3000000,
      data,
      chainId,
    };

    const tx = new Tx(rawTx);
    tx.sign(privateKey2);

    const serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', (txHash) => {
        console.log('TransactionHash:' , txHash);
      })
      .on('receipt', (rec) => {
        console.log('Receipt:' , rec);
      })
  }
};

// // Callback handler for whether it was mined or not
// export const waitForMined = function(txHash, response, pendingCB, successCB){
//   if (response.blockNumber) {
//     successCB(response);
//   } else {
//     pendingCB();
//     DApp.pollingLoop(txHash, response, pendingCB, successCB);
//   }
// }
//
// export const pollingLoop = function(txHash, response, pendingCB, successCB){
//   setTimeout(() => {
//     web3.eth.getTransactionReceipt(txHash, (error, response) => {
//       if (error) { throw error }
//       if (response === null) {
//         response = { blockNumber: null }
//       } // Some ETH nodes do not return pending tx
//       waitForMined(txHash, response, pendingCB, successCB)
//     })
//   }, 800) // check again in 800 millisec.
// };
//
// waitForMined(tx, { blockNumber: null }, // see next area
//   function pendingCB () {
//     $("#spinner").removeClass('hidden');
//     console.log("Confirming transaction...");
//   },
//   function successCB (response) {
//     console.log("XXXXXX: ", response);
//     if(response.status == "0x0"){
//       console.log("Transaction failed.");
//       $('#error').removeClass('hidden');
//       $('#errorButton').html("Transaction failed.");
//     }
//     $("#spinner").addClass('hidden');
//     DApp.clearTable();
//     DApp.loadWallets();
//   }
// )

export const _callFunction = async (_address, _method, _variable1 = false, _variable2 = false) => {
  const publicAddress = await getPubKey()
  const data = ''
  const nonce = await web3.eth.getTransactionCount('');
  const chainId = await web3.eth.net.getId();

  const rawTx = {
    nonce: nonce,
    from: publicAddress,
    to: _address,
    value: 100000000000,
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
        console.log('TransactionHash:', txHash);
        this.setState({log: 'Pending Transaction', logColor: 'red', transactionHash: txHash})
      })
      .on('receipt', (rec) => {
        console.log('Receipt:', rec);
        this.setState({log: 'Transaction Complete', logColor: 'green', transactionHash: rec.transactionHash})
      })
};

export const initWalletForm = () => {
  console.log("initialising wallet ...");
  const mnemonic = bip39.generateMnemonic();
  const newWallet = hdkey.fromMasterSeed(mnemonic).getWallet();
  console.log('NEW WALLET CHECKSUM', newWallet.getChecksumAddressString());
  console.log('MENMONIV: ', mnemonic);
  return newWallet;
}
