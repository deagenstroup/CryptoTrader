import * as FileSystem from 'expo-file-system';

import Profile from "./Profile.js";
import ExchangerScreen from "./ExchangerScreen.js"
// import ExchangerComponent from './Exchanger.js';

function round(value, decimals) {
  var num = Number(Math.trunc(value+'e'+decimals)+'e-'+decimals);
  if(!isNaN(num))
     return num;
  return 0;
}

/** Logical exchanging class used for exchanging a single cryptocurrency **/
export default class CryptoExchanger {

  static areCryptosLoaded = false;

  /* The amount of dollars the user has, which is the same across all exchanger
     components */
  static dollars = 100;

  /** Contains the objects for each cryptocurrency which are loaded in at the
      apps launch and handle all of the logic operations of exchanging the currency **/
  static cryptoExchangerArray = [];

  static cryptoExchangerArrayLength = 0;

  /** The total amount of dollars spent buying the cryptocurrencies that have
      been removed from the portfolio **/
  static removedDollarBoughtVolume = 0;

  /** The total amount of dollars that have been made selling the cryptocurrencies
      that have been removed from the portfolio **/
  static removedDollarSoldVolume = 0;



  static getDollars() {
    return CryptoExchanger.dollars;
  }

  static getFirstCryptoExchanger() {
    if(CryptoExchanger.cryptoExchangerArrayLength == 0)
      return null;
    return CryptoExchanger.cryptoExchangerArray[0];
  }

  static getCryptoExchangerArray() {
    var cryptoArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      cryptoArray.push(CryptoExchanger.cryptoExchangerArray[i]);
    }
    return cryptoArray;
  }

  /** Takes in the ID of a cryptocurrency and returns the CryptoExchanger object
      which handles that currency **/
  static getCryptoExchanger(inCoinID) {
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      if(CryptoExchanger.cryptoExchangerArray[i].getCoinID() === inCoinID) {
        return CryptoExchanger.cryptoExchangerArray[i];
      }
    }
    return null;
  }

  /** Takes in the name of a cryptocurrency and returns the CryptoExchanger object
      which handles that currency **/
  static getCryptoExchangerByName(inCoinName) {
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      if(CryptoExchanger.cryptoExchangerArray[i].getCoinName() === inCoinName) {
        return CryptoExchanger.cryptoExchangerArray[i];
      }
    }
  }


  /** Returns an array filled with the names and dollar values of all the
      cryptocurrencies currently in memory **/
  static getCryptoValueArray() {
    var coinArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      coinArray.push({
        name: CryptoExchanger.cryptoExchangerArray[i].getCoinName(),
        population: CryptoExchanger.cryptoExchangerArray[i].getCurrentValue(),
      });
    }
    return coinArray;
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

  static getNetWorthList() {
    var netWorthArray = [];
    CryptoExchanger.cryptoExchangerArray.map( (cryptoObj, i, arr) => {
      netWorthArray[i] = round(cryptoObj.getCurrentValue(), 2);
    });
    return netWorthArray;
  }

  static getProfitList() {
    var profitArray = [];
    CryptoExchanger.cryptoExchangerArray.map( (cryptoObj, i, arr) => {
      profitArray[i] = cryptoObj.getNetProfit();
    });
    return profitArray;
  }

  static getTotalProfit() {
    var totalDollarBoughtVolume = this.removedDollarBoughtVolume;
    var totalDollarSoldVolume = this.removedDollarSoldVolume;
    var totalCryptoValue = 0;
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      totalDollarBoughtVolume += CryptoExchanger.cryptoExchangerArray[i].dollarBoughtVolume;
      totalDollarSoldVolume += CryptoExchanger.cryptoExchangerArray[i].dollarSoldVolume;
      totalCryptoValue += CryptoExchanger.cryptoExchangerArray[i].getCurrentValue();
    }
    console.log("totalDollarSoldVolume: " + totalDollarSoldVolume + ", totalDollarBoughtVolume: " + totalDollarBoughtVolume);
    return totalDollarSoldVolume + totalCryptoValue - totalDollarBoughtVolume;
  }

  static getCryptoNameList() {
    var nameArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      nameArray.push(CryptoExchanger.cryptoExchangerArray[i].getCoinName());
    }
    return nameArray;
  }


  static setDollars(inDollars) {
    CryptoExchanger.dollars = inDollars;
    CryptoExchanger.saveDollarsToFile(inDollars);
  }

  static addCryptoExchanger(inCryptoID, inCryptoName) {
    var newExchanger = new CryptoExchanger(inCryptoID, inCryptoName, false);
    CryptoExchanger.cryptoExchangerArray.push(newExchanger);
    CryptoExchanger.cryptoExchangerArrayLength++;
    newExchanger.fetchCoinPrice();
    newExchanger.saveCoinsToFile();
    Profile.forceProfileUpdate();
    CryptoExchanger.saveCryptoList()
      .catch((error) => console.log("There was an error saving crypto list..."))
      .then(console.log("crypto list saved successfully"));
    // newExchanger.saveValuesToFile();
    // CryptoExchanger.saveCryptoList();
  }

  static removeCryptoExchanger(inCryptoID) {
    var removedCryptoExchanger;
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      if(inCryptoID == CryptoExchanger.cryptoExchangerArray[i].getCoinID()) {
        removedCryptoExchanger = CryptoExchanger.cryptoExchangerArray.splice(i, 1);
        removedCryptoExchanger[0].sellCrypto(removedCryptoExchanger[0].getCoin(), false);
        CryptoExchanger.cryptoExchangerArrayLength--;
        break;
      }
    }
    CryptoExchanger.removedDollarBoughtVolume += removedCryptoExchanger[0].dollarBoughtVolume;
    CryptoExchanger.removedDollarSoldVolume += removedCryptoExchanger[0].dollarSoldVolume;
    console.log("removedDollarSoldVolume: " + CryptoExchanger.removedDollarSoldVolume + ", removedDollarBoughtVolume" + CryptoExchanger.removedDollarBoughtVolume);
    CryptoExchanger.saveDollarVolumes();
    ExchangerScreen.resetChosenCrypto();
    Profile.forceProfileUpdate();
    CryptoExchanger.saveCryptoList()
      .catch((error) => console.log("There was an error saving crypto list..."))
      .then(console.log("crypto list saved successfully"));
  }

  static resetCryptoExchangers() {
    CryptoExchanger.setDollars(100);
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      CryptoExchanger.cryptoExchangerArray[i].reset();
    }
    // ExchangerComponent.forceUpdate();
  }


  static async loadCryptoExchangers() {
    if(CryptoExchanger.areCryptosLoaded)
      return;

    var cryptoList = await CryptoExchanger.getCryptoListFromFile();
    for(var i = 0; i < cryptoList.length; i++) {
      CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger(cryptoList[i], null, true));
      CryptoExchanger.cryptoExchangerArrayLength = CryptoExchanger.cryptoExchangerArrayLength + 1;
    }

    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      await CryptoExchanger.cryptoExchangerArray[i].loadValuesFromFile();
      await CryptoExchanger.cryptoExchangerArray[i].fetchCoinPrice();
      console.log(CryptoExchanger.cryptoExchangerArray[i]);
    }

    try {
      await CryptoExchanger.loadDollarVolumes();
      console.log("removedDollarSoldVolume: " + CryptoExchanger.removedDollarSoldVolume + ", removedDollarBoughtVolume" + CryptoExchanger.removedDollarBoughtVolume);
    } catch(error) {
      console.log("Error loading removed dollar volumes...");
    }


    CryptoExchanger.areCryptosLoaded = true;
  }

  static async loadDollarVolumes() {
    let fileObj = JSON.parse(await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + "cryptolist.txt",
      { encoding: FileSystem.EncodingType.UTF8 }
    ));
    if(fileObj.removedDollarBoughtVolume != null)
      this.removedDollarBoughtVolume = fileObj.removedDollarBoughtVolume;
    if(fileObj.removedDollarSoldVolume != null)
      this.removedDollarSoldVolume = fileObj.removedDollarSoldVolume;
  }

  static async saveCryptoExchangers() {
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      await CryptoExchanger.cryptoExchangerArray[i].saveValuesToFile();
    }
    await CryptoExchanger.saveCryptoList();
  }

  static async saveCryptoList() {
    await FileSystem.deleteAsync(
      FileSystem.documentDirectory + "cryptolist.txt",
      { idempotent: true }
    );
    var nameArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArrayLength; i++) {
      nameArray.push(CryptoExchanger.cryptoExchangerArray[i].getCoinID());
    }
    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "cryptolist.txt",
      JSON.stringify(nameArray),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  static async saveDollarVolumes() {
    var fileObj = {
      removedDollarBoughtVolume: this.removedDollarBoughtVolume,
      removedDollarSoldVolume: this.removedDollarSoldVolume,
    }

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + "cryptolist.txt",
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  /** Returns an array of strings with the names of all the cryptocurrencies which
      the user has in their porfolio **/
  static async getCryptoListFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      FileSystem.documentDirectory + "cryptolist.txt",
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    var cryptoList = JSON.parse(fileString);
    return cryptoList;
  }





  constructor(inCoinID, inCoinName, inWaitForLoad) {

    this.coinName = inCoinName;

    // A unique identifier of the coin
    this.coinID = inCoinID;

    /** The amount of respective cryptocurrency that the user owns. **/
    this.coin = 0;

    /** The price of a single unit of cryptocurrency, in dollars **/
    this.coinPrice = 1000;

    /** The total amount of dollars spent buying the cryptocurrency **/
    this.dollarBoughtVolume = 0;

    /** The total amount of dollars that have been made selling the cryptocurrency **/
    this.dollarSoldVolume = 0;

    /** If true, the price of the coin has been loaded from the web into
        the object **/
    this.priceLoaded = false;

    /** If true, the amount of coins and dollars the user has has been loaded
        into the object from file **/
    this.valuesLoaded = !inWaitForLoad;
  }

  /** Opens a connection to CoinGecko and gets the current market price of the coin **/
  async fetchCoinPrice() {
    await fetch("https://api.coingecko.com/api/v3/simple/price?ids=" + this.getCoinID() + "&vs_currencies=usd")
      .then((response) => response.json())
      .then((json) => {
        this.coinPrice = json[this.getCoinID()]["usd"];
      })
      .catch((error) => console.error(error))
      .finally(() => {
        this.priceLoaded = true;
        this.coinPrice = this.coinPrice;
      });
  }



  getCoin() {
    return this.coin;
  }

  getCoinName() {
    if(this.coinName == null)
      return this.coinID;
    return this.coinName;
  }

  getCoinID() {
    return this.coinID;
  }

  getCoinFilename() {
    return this.getCoinID() + ".txt";
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

  getNetProfit() {
    return this.dollarSoldVolume + this.getCurrentValue() - this.dollarBoughtVolume;
  }

  areValuesLoaded() {
    return this.valuesLoaded;
  }

  isPriceLoaded() {
    return this.priceLoaded;
  }



  setCoin(inCoin) {
    this.coin = inCoin;
    this.saveCoinsToFile();
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
    if(inDollarsWorth) {
      this.dollarBoughtVolume += inAmount;
    } else {
      this.dollarBoughtVolume += this.getDollarExchangeValue(inAmount);
    }

    console.log(this);
    console.log("Net Profit: " + this.getNetProfit());

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
    if(inDollarsWorth) {
      this.dollarSoldVolume += inAmount;
    } else {
      this.dollarSoldVolume += this.getDollarExchangeValue(inAmount);
    }

    console.log(this);
    console.log("Net Profit: " + this.getNetProfit());

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
      .catch((error) => console.log("Error loading coin values from file..."))
      .finally(() => {
        this.valuesLoaded = true;
      });
  }

  // Saves the amount of dollars and coins that the user currently has to file
  async saveValuesToFile() {
    CryptoExchanger.saveDollarsToFile(CryptoExchanger.dollars);
    this.saveCoinsToFile();
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

  async saveCoinsToFile() {
    var fileObj = {
      // coinName: this.getCoinID().substring(0, 1).toUpperCase() + this.getCoinID().substring(1, this.getCoinID().length),
      coinName: this.getCoinName(),
      coin: this.coin,
      dollarBoughtVolume: this.dollarBoughtVolume,
      dollarSoldVolume: this.dollarSoldVolume,
    };

    await FileSystem.writeAsStringAsync(
      FileSystem.documentDirectory + this.getCoinFilename(),
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
      FileSystem.documentDirectory + this.getCoinFilename(),
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    var fileObj = JSON.parse(fileString);

    if(fileObj.coin != null)
      this.coin = fileObj.coin;

    if(fileObj.coinName != null)
      this.coinName = fileObj.coinName;

    if(fileObj.dollarBoughtVolume != null)
      this.dollarBoughtVolume = fileObj.dollarBoughtVolume;

    if(fileObj.dollarSoldVolume != null)
      this.dollarSoldVolume = fileObj.dollarSoldVolume;
  }



  toString() {
    return this.coinName + "(" + this.coinID + "): " + this.coin + ", " + this.coinPrice + ", +$" + this.dollarBoughtVolume + ", -$" + this.dollarSoldVolume + "\n"
           + this.valuesLoaded + ", $" + CryptoExchanger.dollars + "\n";
  }

}
