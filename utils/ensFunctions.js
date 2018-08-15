const Web3 = require('web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://localhost:9545'));

console.log('web3333333: ', web3);

let factoryContract = null;
const factoryAbi = [{"constant":false,"inputs":[{"name":"_topLevelDomain","type":"string"},{"name":"_subDomain","type":"string"},{"name":"_owner","type":"address"},{"name":"_target","type":"address"}],"name":"newSubdomain","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"creator","type":"address"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"domain","type":"string"},{"indexed":false,"name":"subdomain","type":"string"}],"name":"SubdomainCreated","type":"event"},{"constant":true,"inputs":[{"name":"_subDomain","type":"string"},{"name":"_topLevelDomain","type":"string"}],"name":"subDomainOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}]
const emptyAddress = '0x0000000000000000000000000000000000000000';

  // Local
const factoryAddress = "0x9fbda871d559710256a2502a2517b794b482db40";

// // Ropsten
// factoryAddress: "0xf9fa2ff44a474b6d20500969bda61c2827fbc6b6",

// Mainnet
//factoryAddress: "0x21aa8d3eee8be2333ed180e9a5a8c0729c9b652c",
let currentAccount;

export const initWeb3 = () => {
  if(typeof web3 !== 'undefined') {
    // web3 = new Web3(web3.currentProvider);
    console.log('[x] web3 object initialized.');
    initContracts();
  } else {
    //no web3 instance available show a popup
    $('#metamaskModal').modal('show');
  }
};

export const init = () => {
  console.log('[x] Initializing ');
  initWeb3();
};

export const initContracts = () => {
  factoryContract = new web3.eth.Contract(factoryAbi, factoryAddress);
  console.log('[x] Factory contract initialized.');
  loadAccount();
  console.log("contract initialize by Kasi");
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
    .then(addr => {
      if(addr === emptyAddress){
        $('#valid').text("It's available! Go for it tiger!");
        $('#subdomain').addClass('is-valid');
      } else if(addr === currentAccount) {
        $('#valid').text("It's your domain! Edit away!");
        $('#subdomain').addClass('is-valid');
      } else {
        $('#invalid').text("Oops! It's already taken by: " + addr);
        $('#subdomain').addClass('is-invalid');
      }
    })
    .catch(err => console.log(err));
};

export const newSubdomain = (subdomain, domain, owner, target) => {
  factoryContract.methods.newSubdomain(
    subdomain, domain, owner, target).send(
    {
      gas: 150000,
      from: currentAccount
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
