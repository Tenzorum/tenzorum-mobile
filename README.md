# react-native-web3-boilerplate
This is the mobile version to the JOE (Javascript on Everything) platform. 
JOE is a platform that aims to connect mobile apps, web apps, desktop apps, server apps, and IoT apps to the blockchain entirely using Javascript.

![Scheme](PRESENTATION-1.png)

# Get Started

Go into your terminal and choose a directory that you want the project to reside in.
Enter into your terminal
`git clone https://github.com/markspereira/react-native-web3-boilerplate.git RNWeb3BoilerPlate`

`cd RNWeb3BoilerPlate`

`npm install`

`react-native run-ios`

### If you haven't installed node.js

#### Install NVM

Check to see if you have nvm by running ``` nvm --version ``` in your terminal

If not then download it from
https://github.com/creationix/nvm

#### Install Node.js

Check to see if you have node by running ```node --version``` in your terminal

If you don't then

``` nvm install 8.60.0 ```

Go into the root directory of the app
```cd RNWeb3BoilerPlate```

Then enter
```npm install```

Then 
```react-native run-ios```

You can then look into `App.js` to see the code I've written.

# Happy coding! 🎉

# Tenzorum Gasless TXs

### Format

```
{
      uint8 _v, bytes32 _r, bytes32 _s,
      address _from, //the subscriber
      address _to, //the publisher
      uint _value, //wei value of transfer
      bytes _data, //data input
      address _rewardType, //reward relayers in tokens or ETH
      uint _rewardAmount //amount to reward
}
```

### Rx
```
    ##Client SDK

    HTTP POST https://login.tenzorum.app/execute + data
    GRAPHQL endpoint mutation ExecuteGaslessTx($from: $WalletAddress!, $to: $WalletAddress!, $amount: Int!) {
                       executeTransaction(from: $from, to: $to) {
                            amount
                       }
                     }

    ##Relay RPG
    -Coming
```

### Tx
```
{
    function execute(
      uint8 _v, bytes32 _r, bytes32 _s,
      address _from,
      address _to,
      uint _value,
      bytes _data,
      address _rewardType, uint _rewardAmount) public
}
```

### Example Implementation Links

[Tenzorum](https://github.com/austintgriffith/meta-transaction-format-share/blob/master/tenzorum.org.md)
# Tenzorum Gasless TXs

### Format

```
{
      uint8 _v, bytes32 _r, bytes32 _s,
      address _from, //the subscriber
      address _to, //the publisher
      uint _value, //wei value of transfer
      bytes _data, //data input
      address _rewardType, //reward relayers in tokens or ETH
      uint _rewardAmount //amount to reward
}
```

### Rx
```
    ##Client SDK

    HTTP POST https://login.tenzorum.app/execute + data
    GRAPHQL endpoint mutation ExecuteGaslessTx($from: $WalletAddress!, $to: $WalletAddress!, $amount: Int!) {
                       executeTransaction(from: $from, to: $to) {
                            amount
                       }
                     }

    ##Relay RPG
    -Coming
```

### Tx
```
{
    function execute(
      uint8 _v, bytes32 _r, bytes32 _s,
      address _from,
      address _to,
      uint _value,
      bytes _data,
      address _rewardType, uint _rewardAmount) public
}
```

### Example Implementation Links

[Tenzorum](https://github.com/austintgriffith/meta-transaction-format-share/blob/master/tenzorum.org.md)
