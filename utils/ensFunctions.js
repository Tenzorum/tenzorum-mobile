const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://ropsten.infura.io/rqmgop6P5BDFqz6yfGla'));

let factoryContract = null;
const factoryAbi = [{"constant":false,"inputs":[{"name":"_topLevelDomain","type":"string"},{"name":"_subDomain","type":"string"},{"name":"_owner","type":"address"},{"name":"_target","type":"address"}],"name":"newSubdomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"creator","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"domain","type":"string"},{"indexed":false,"name":"subdomain","type":"string"}],"name":"SubdomainCreated","type":"event"},{"constant":true,"inputs":[{"name":"_subDomain","type":"string"},{"name":"_topLevelDomain","type":"string"}],"name":"subDomainOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]

// Local
// const factoryAddress = "0x9fbda871d559710256a2502a2517b794b482db40";

// // Ropsten
const factoryAddress = "0xf9fa2ff44a474b6d20500969bda61c2827fbc6b6";

// Mainnet
//factoryAddress: "0x21aa8d3eee8be2333ed180e9a5a8c0729c9b652c",

factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
let currentAccount;

export const initWeb3 = () => {
  if(typeof web3 !== 'undefined') {
    // web3 = new Web3(web3.currentProvider);
    console.log('[x] web3 object initialized.');
    // initContracts();
  } else {
    //no web3 instance available show a popup
  }
};

export const init = () => {
  console.log('[x] Initializing ');
  initWeb3();
};

export const loadAccount = () => {
  web3.eth.getAccounts(function(error, accounts) {
    if(error) {
      console.log("[x] Error loading accounts", error);
    } else {
      currentAccount = accounts[0];
      console.log("[x] Using account", currentAccount);
      initActions();
    }
  });
};

export const checkSubdomainOwner = (subdomain, domain) => {
  factoryContract.methods.subDomainOwner(subdomain, domain).call()
    .then(addr => addr)
    .catch(err => console.log(err));
};

export const newSubdomain = (subdomain, domain, owner, target) => {
  factoryContract.methods.newSubdomain(
    subdomain, domain, owner, target).send(
    {
      gas: 150000,
      from: '0x37386A1c592Ad2f1CafFdc929805aF78C71b1CE7'
    },
    function(error, result){
      if(error){
        console.log('[x] Error during execution', error);
      } else {
        console.log('[x] Result', result);
      }
    }
  )
};

export const setSubdomain = async () => {
    const data = await factoryContract.methods.newSubdomain(subdomain, domain, owner, target).encodeABI();
    const nonce = await web3.eth.getTransactionCount(account1.publicKey);
    const chainId = await web3.eth.net.getId();

    const rawTx = {
      "nonce": nonce,
      "from": account1.publicKey,
      "to": "0xdb0a1cf7ec068fd48a3f5869bf4f60b62e4ecb5e",
      "value": "0x0",
      "gas": 40000,
      "gasPrice": 500000000000, // converts the gwei price to wei
      "chainId": 3,
      "data": web3.utils.toHex(data)
    };

    const tx = new Tx(rawTx);
    tx.sign(account1.privateKey);

    const serializedTx = tx.serialize();

    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('transactionHash', (txHash) => {
        console.log('Tokens transferred:' , txHash);
      })
      .on('confirmation', (conf, msg) => {
        //after account gets money
        if (conf === 0) {
          console.log('& Confirmed:' , conf);
        }
      })
}

export const initActions = () => {
  $("#domain").on("change", function() {
    updateDomainAvailable();
  });
  $("#subdomain").on("paste keyup", function() {
    updateDomainAvailable();
  });
  $("#owner").on("paste keyup", function() {
    $("ownerHelp").remove();
    validateAddress("#owner");
  });
  $("#target").on("paste keyup", function() {
    $("targetHelp").remove();
    validateAddress("#target");
  });

  $("#subdomain-form").submit(function(event) {
    event.preventDefault();

    $("#ownerHelp").remove();
    $("#targetHelp").remove();

    let fullDomain = $('#subdomain').val() + "." +
      $('#domain option').filter(":selected").val() + ".eth";

    $("a").attr("href", "https://ropsten.etherscan.io/enslookup?q=" + fullDomain);
    $('#confirmModal').modal('show');

    $("#subdomain").removeClass("is-valid is-invalid");
    newSubdomain(
      $('#subdomain').val(),
      $('#domain option').filter(":selected").val(),
      $('#owner').val(),
      $('#target').val()
    );
  });
};

export const validateAddress = (element) => {
  if(web3.utils.isAddress($(element).val())){
    $(element).removeClass("is-invalid");
  } else {
    $(element).addClass("is-invalid");
  }
}

init();
