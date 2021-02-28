import * as FileSystem from 'expo-file-system';

import { forceProfileUpdate } from "./Profile.js";

export var cryptoExchangersLoaded = false;

/** Contains the objects for each cryptocurrency which are loaded in at the
    apps launch and handle all of the logic operations of exchanging the currency **/
var cryptoExchangerArray = [];

var cryptoExchangerArrayLength = 4;

export async function loadCryptoExchangers() {
  cryptoExchangerArray.push(new CryptoExchanger("bitcoin"));
  cryptoExchangerArray.push(new CryptoExchanger("ethereum"));
  cryptoExchangerArray.push(new CryptoExchanger("litecoin"));
  cryptoExchangerArray.push(new CryptoExchanger("monero"));

  for(var i = 0; i < cryptoExchangerArrayLength; i++) {
    await cryptoExchangerArray[i].loadValuesFromFile();
    await cryptoExchangerArray[i].fetchCoinPrice();
    console.log("i : " + i + "\n" + cryptoExchangerArray[i]);
  }
}

export async function fetchCoinPrices() {
  for(var i = 0; i < cryptoExchangerArrayLength; i++) {
    var x = await cryptoExchangerArray[i].fetchCoinPrice();
    console.log("i : " + i + "\n" + cryptoExchangerArray[i]);
  }
}

export function setCryptosLoaded(inValue) {
  cryptoExchangersLoaded = inValue;
}

export function areCryptoExchangersLoaded() {
  return cryptoExchangersLoaded;
}

export function getCryptoExchanger(inCoinName) {
  for(var i = 0; i < cryptoExchangerArray.length; i++) {
    if(cryptoExchangerArray[i].getCoinName() === inCoinName) {
      return cryptoExchangerArray[i];
    }
  }
}

export function getCryptoPercentageDataArray() {
  var coinArray = [];
  for(var i = 0; i < cryptoExchangerArrayLength; i++) {
    coinArray.push({
      name: cryptoExchangerArray[i].getCoinName(),
      population: cryptoExchangerArray[i].getCurrentValue(),
    });
    console.log("name: " + cryptoExchangerArray[i].getCoinName() + " value: " + cryptoExchangerArray[i].getCurrentValue());
  }
  return coinArray;
}



/** Logical exchanging class used for exchanging a single cryptocurrency **/
export default class CryptoExchanger {

  constructor(inCoinName) {

    /** The all lowercase identifier of the cryptocurrency **/
    this.coinName = inCoinName;

    /** The amount of respective cryptocurrency that the user owns. **/
    this.coin = 0;

    /** The price of a single unit of cryptocurrency, in dollars **/
    this.coinPrice = 1000;

    /** If true, the price of the coin has been loaded from the web into
        the object **/
    this.priceLoaded = false;

    /** If true, the amount of coins and dollars the user has has been loaded
        into the object from file **/
    this.valuesLoaded = false;
  }

  static pricesFetched = 0;

  /** Opens a connection to CoinGecko and gets the current market price of the coin **/
  async fetchCoinPrice() {
    await fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + this.getCoinName() + "&vs_currencies=usd")
      .then((response) => response.json())
      .then((json) => {
        this.coinPrice = CryptoExchanger.parseCoinPrice(json, this.getCoinName());
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.priceLoaded = true;
        CryptoExchanger.pricesFetched += 1;
      });
  }

  static parseCoinPrice(json, inCoinName) {
    // console.log(inCoinName + ":\n" + json);
    if(inCoinName === "bitcoin") {
      return json.bitcoin.usd;
    } else if(inCoinName === "ethereum") {
      return json.ethereum.usd;
    } else if(inCoinName === "litecoin") {
      return json.litecoin.usd;
    } else if(inCoinName === "monero") {
      return json.monero.usd;
    }
  }

  /* The amount of dollars the user has, which is the same across all exchanger
     components */
  static dollars = 100;

  getCoin() {
    return this.coin;
  }

  static getDollars() {
    return CryptoExchanger.dollars;
  }

  getCoinName() {
    return this.coinName;
  }

  getCoinFileName() {
    return "new_" + this.getCoinName() + ".txt";
  }

  getCoinPrice() {
    return this.coinPrice;
  }

  /** Takes in a specified amount of cryptocurrency and returns the equivalent
      amount of dollars **/
  getDollarExchangeValue(inCoins) {
    if(isNaN(inCoins))
      return 0.0;

    return inCoins * this.coinPrice;
  }

  /** Takes in a specified amount of dollars and returns the equivalent amount
      of crypto **/
  getCryptoExchangeValue(inDollars) {
    if(isNaN(inDollars))
      return 0.0;

    return inDollars / this.coinPrice;
  }

  getCurrentValue() {
    var currentValue = (this.coin * this.coinPrice);
    return currentValue;
  }

  static getTotalCurrentNetValue() {
    return CryptoExchanger.dollars + CryptoExchanger.getTotalCryptoValue();
  }

  static getTotalCryptoValue() {
    var totalValue = 0;
    for(var i = 0; i < cryptoExchangerArrayLength; i++) {
      totalValue = totalValue + cryptoExchangerArray[i].getCurrentValue();
    }
    return totalValue;
  }

  areValuesLoaded() {
    return this.valuesLoaded;
  }

  isPriceLoaded() {
    return this.priceLoaded;
  }



  setCoin(inCoin) {
    this.coin = inCoin;
    this.saveCoinsToFile(inCoin);
  }

  static setDollars(inDollars) {
    dollars = inDollars;
    saveDollarsToFile(inDollars);
  }

  /** Buy inAmount of crypto or the equivalent amount of dollars worth of crypto
      if inDollarsWorth is true **/
  buyCrypto(inAmount, inDollarsWorth) {
    var newCoinAmount = this.coin;
    var newDollarAmount = CryptoExchanger.dollars;

    if(inDollarsWorth) {
      newCoinAmount += this.getCryptoExchangeValue(inAmount);
      newDollarAmount -= inAmount;
    } else {
      newCoinAmount += inAmount;
      newDollarAmount -= this.getDollarExchangeValue(inAmount);
    }

    if(newCoinAmount < 0 || newDollarAmount < 0)
      return;

    this.coin = newCoinAmount;
    CryptoExchanger.dollars = newDollarAmount;

    this.saveValuesToFile()
      .catch((error) => console.error(error))
      .finally(() => console.log("Values saved successfully."));

    forceProfileUpdate();
  }

  sellCrypto(inAmount, inDollarsWorth) {
    var newCoinAmount = this.coin, newDollarAmount = CryptoExchanger.dollars;

    if(inDollarsWorth) {
      newCoinAmount -= this.getCryptoExchangeValue(inAmount);
      newDollarAmount += inAmount;
    } else {
      newCoinAmount -= inAmount;
      newDollarAmount += this.getDollarExchangeValue(inAmount);
    }

    if(newCoinAmount < 0 || newDollarAmount < 0)
      return;

    this.coin = newCoinAmount;
    CryptoExchanger.dollars = newDollarAmount;

    this.saveValuesToFile()
      .catch((error) => console.error(error))
      .finally(() => console.log("Values saved successfully."));

    forceProfileUpdate();
  }

  static exchangersLoaded = 0;

  // Loads the amount of dollars and coins from the last time it was saved
  async loadValuesFromFile() {
    await this.loadDollarsFromFile()
      .catch((error) => {CryptoExchanger.dollars = 0;});
    await this.loadCoinsFromFile()
      .catch((error) => {this.coin = 0;})
      .finally(() => {
        this.valuesLoaded = true;
        CryptoExchanger.exchangersLoaded += 1;
      });
    // this.valuesLoaded = true;
  }

  // Saves the amount of dollars and coins that the user currently has to file
  async saveValuesToFile() {
    CryptoExchanger.saveDollarsToFile(CryptoExchanger.dollars);
    this.saveCoinsToFile(this.coin);
  }

  static async saveDollarsToFile(dollarAmount) {
    var fileObj = {
      fileDollars: dollarAmount,
    }

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "new_dollars.txt",
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  async saveCoinsToFile(coinAmount) {
    var fileObj = {
      fileCoins: coinAmount,
    };

    // console.log("Saved file path: " + FileSystem.documentDirectory + this.getCoinFileName());
    // console.log("Saved object: " + JSON.stringify(fileObj));

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + this.getCoinFileName(),
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  async loadDollarsFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + "new_dollars.txt",
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    var fileObj = JSON.parse(fileString);
    CryptoExchanger.dollars = fileObj.fileDollars;
  }

  async loadCoinsFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + this.getCoinFileName(),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    // console.log("Loaded file path: " + FileSystem.documentDirectory + this.getCoinFileName());
    // console.log("Loaded object: " + fileString);

    var fileObj = JSON.parse(fileString);

    this.coin = fileObj.fileCoins;
  }



  toString() {
    return this.coinName + ": " + this.coin + ", " + this.valuesLoaded + ", " + this.coinPrice + ", $" + CryptoExchanger.dollars + "\n";
  }

}
