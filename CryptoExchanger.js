import * as FileSystem from 'expo-file-system';

import Profile from "./Profile.js";
import { forceRender } from './Exchanger.js';


/** Logical exchanging class used for exchanging a single cryptocurrency **/
export default class CryptoExchanger {

  /* The amount of dollars the user has, which is the same across all exchanger
     components */
  static dollars = 100;

  /** Contains the objects for each cryptocurrency which are loaded in at the
      apps launch and handle all of the logic operations of exchanging the currency **/
  static cryptoExchangerArray = [];

  static cryptoExchangerArrayLength = 4;



  static getCryptoExchanger(inCoinName) {
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      if(CryptoExchanger.cryptoExchangerArray[i].getCoinName() === inCoinName) {
        return CryptoExchanger.cryptoExchangerArray[i];
      }
    }
  }

  static getCryptoPercentageDataArray() {
    var coinArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      coinArray.push({
        name: CryptoExchanger.cryptoExchangerArray[i].getCoinName(),
        population: CryptoExchanger.cryptoExchangerArray[i].getCurrentValue(),
      });
    }
    return coinArray;
  }

  static getDollars() {
    return CryptoExchanger.dollars;
  }

  static getTotalCurrentNetValue() {
    return CryptoExchanger.dollars + CryptoExchanger.getTotalCryptoValue();
  }

  static getTotalCryptoValue() {
    var totalValue = 0;
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      totalValue = totalValue + CryptoExchanger.cryptoExchangerArray[i].getCurrentValue();
    }
    return totalValue;
  }


  static setDollars(inDollars) {
    CryptoExchanger.dollars = inDollars;
    CryptoExchanger.saveDollarsToFile(inDollars);
  }

  static resetCryptoExchangers() {
    CryptoExchanger.setDollars(100);
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      CryptoExchanger.cryptoExchangerArray[i].reset();
    }
    forceRender();
  }


  static async loadCryptoExchangers() {
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("bitcoin"));
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("ethereum"));
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("litecoin"));
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("monero"));
    console.log("crytpoExchangerArrayLength: " + CryptoExchanger.cryptoExchangerArrayLength);

    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      await CryptoExchanger.cryptoExchangerArray[i].loadValuesFromFile();
      await CryptoExchanger.cryptoExchangerArray[i].fetchCoinPrice();
      console.log(CryptoExchanger.cryptoExchangerArray[i]);
    }
  }



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
      });
  }

  static parseCoinPrice(json, inCoinName) {
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



  getCoin() {
    return this.coin;
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

    Profile.forceProfileUpdate();
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

    Profile.forceProfileUpdate();
  }

  reset() {
    this.setCoin(0);
    this.fetchCoinPrice();
  }



  // Loads the amount of dollars and coins from the last time it was saved
  async loadValuesFromFile() {
    await CryptoExchanger.loadDollarsFromFile()
      .catch((error) => {CryptoExchanger.dollars = 0;});
    await this.loadCoinsFromFile()
      .catch((error) => {this.coin = 0;})
      .finally(() => {
        this.valuesLoaded = true;
      });
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

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + this.getCoinFileName(),
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  static async loadDollarsFromFile() {
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

    var fileObj = JSON.parse(fileString);

    this.coin = fileObj.fileCoins;
  }



  toString() {
    return this.coinName + ": " + this.coin + ", " + this.valuesLoaded + ", " + this.coinPrice + ", $" + CryptoExchanger.dollars + "\n";
  }

}
