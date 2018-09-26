// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

import { AsyncStorage } from 'react-native';
import { accountId } from './account';
import SecureStorage, { ACCESS_CONTROL, ACCESSIBLE, AUTHENTICATION_TYPE } from 'react-native-secure-storage'
const config = {
  // accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
  accessible: ACCESSIBLE.WHEN_UNLOCKED,
  authenticationPrompt: 'Access your account',
  service: 'tenzorum',
  // authenticateType: AUTHENTICATION_TYPE.BIOMETRICS,
};
const privKey = 'privKey';
const pubKey = 'pubKey';

const pubConfig = {
  accessible: ACCESSIBLE.WHEN_UNLOCKED,
  authenticationPrompt: 'View your address',
  service: 'tenzorum',
};

export const saveKey = async (key) => {
  await SecureStorage.setItem(privKey, key, config);
};

export const getKey = async () => {
  return await SecureStorage.getItem(privKey, config)
};

export const savePubKey = async (key) => {
  await SecureStorage.setItem(pubKey, key, pubConfig);
};

export const getPubKey = async () => {
  return await SecureStorage.getItem(pubKey, pubConfig)
};

const accountsStore_v1 = {
  keychainService: 'accounts',
  sharedPreferencesName: 'accounts'
};

export const deleteAccount_v1 = async account =>
  SecureStorage.deleteItem(account.address, accountsStore_v1);

export async function loadAccounts_v1() {
  if (!SecureStorage) {
    return Promise.resolve([]);
  }

  return SecureStorage.getAllItems(accountsStore_v1).then(accounts =>
    Object.values(accounts).map(account => JSON.parse(account))
  );
}

const accountsStore = {
  keychainService: 'accounts_v2',
  sharedPreferencesName: 'accounts_v2'
};

function accountTxsKey({ address, networkType, chainId }) {
  return 'account_txs_' + accountId({ address, networkType, chainId });
}

function txKey(hash) {
  return 'tx_' + hash;
}

export const deleteAccount = async account =>
  SecureStorage.deleteItem(accountId(account), accountsStore);

export const saveAccount = account =>
  SecureStorage.setItem(
    accountId(account),
    JSON.stringify(account, null, 0),
    accountsStore
  );

export const saveAccounts = accounts => accounts.forEach(saveAccount);

export async function loadAccounts() {
  if (!SecureStorage) {
    return Promise.resolve([]);
  }

  return SecureStorage.getAllItems(accountsStore).then(accounts =>
    Object.values(accounts).map(account => JSON.parse(account))
  );
}

export async function saveTx(tx) {
  if (!tx.sender) {
    throw new Error('Tx should contain sender to save');
  }
  if (!tx.recipient) {
    throw new Error('Tx should contain recipient to save');
  }
  await [
    storagePushValue(accountTxsKey(tx.sender), tx.hash),
    storagePushValue(accountTxsKey(tx.recipient), tx.hash),
    AsyncStorage.setItem(txKey(tx.hash), JSON.stringify(tx))
  ];
}

export async function loadAccountTxHashes(account) {
  const result = await AsyncStorage.getItem(accountTxsKey(account));
  return result ? JSON.parse(result) : [];
}

export async function loadAccountTxs(account) {
  const hashes = await loadAccountTxHashes(account);
  return (await AsyncStorage.multiGet(hashes.map(txKey))).map(v => [
    v[0],
    JSON.parse(v[1])
  ]);
}

async function storagePushValue(key, value) {
  let currentVal = await AsyncStorage.getItem(key);
  if (currentVal === null) {
    return AsyncStorage.setItem(key, JSON.stringify([value]));
  } else {
    currentVal = JSON.parse(currentVal);
    const newVal = new Set([...currentVal, value]);
    return AsyncStorage.setItem(key, JSON.stringify(Array.from(newVal)));
  }
}
