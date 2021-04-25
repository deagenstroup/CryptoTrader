import * as FileSystem from 'expo-file-system';

import { fileDir, getFileURI } from "./App.js";
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
  static dollars = -1;

  /* The amount of dollars that the user initiallity started with. */
  static startingDollars = 0;

  /** Contains the objects for each cryptocurrency which are loaded in at the
      apps launch and handle all of the logic operations of exchanging the currency **/
  static cryptoExchangerArray = [];


  /** The total amount of dollars spent buying the cryptocurrencies that have
      been removed from the portfolio **/
  static removedDollarBoughtVolume = 0;

  /** The total amount of dollars that have been made selling the cryptocurrencies
      that have been removed from the portfolio **/
  static removedDollarSoldVolume = 0;



  static getDollars() {
    return CryptoExchanger.dollars;
  }

  static getStartingDollars() {
    return CryptoExchanger.startingDollars;
  } 
  
  static didDollarVolumesLoad() {
    if(CryptoExchanger.dollars != -1)
      return true;
    else
      return false;
  }
  
  static getAreCryptosLoaded() {
    return CryptoExchanger.areCryptosLoaded;
  }

  static getFirstCryptoExchanger() {
    if(CryptoExchanger.cryptoExchangerArray.length == 0 || 
       CryptoExchanger.cryptoExchangerArray[0] == null)
      return null;
    return CryptoExchanger.cryptoExchangerArray[0];
  }

  static getFirstCryptoExchangerName() {
    if(CryptoExchanger.getFirstCryptoExchanger() == null)
      return null;
    return CryptoExchanger.getFirstCryptoExchanger().getCoinName();
  }

  static getCryptoExchangerArray() {
    return CryptoExchanger.cryptoExchangerArray;
    /*var cryptoArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      cryptoArray.push(CryptoExchanger.cryptoExchangerArray[i]);
    }
    return cryptoArray;*/
  }

  /** Takes in the ID of a cryptocurrency and returns the CryptoExchanger object
      which handles that currency **/
  static getCryptoExchanger(inCoinID) {
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      if(CryptoExchanger.cryptoExchangerArray[i].getCoinID() === inCoinID) {
        return CryptoExchanger.cryptoExchangerArray[i];
      }
    }
    return null;
  }

  /** Takes in the name of a cryptocurrency and returns the CryptoExchanger object
      which handles that currency **/
  static getCryptoExchangerByName(inCoinName) {
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      if(CryptoExchanger.cryptoExchangerArray[i].getCoinName() === inCoinName) {
        return CryptoExchanger.cryptoExchangerArray[i];
      }
    }
  }


  /** Returns an array filled with the names and dollar values of all the
      cryptocurrencies currently in memory **/
  static getCryptoValueArray() {
    var coinArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      coinArray.push({
        name: CryptoExchanger.cryptoExchangerArray[i].getCoinName(),
        population: CryptoExchanger.cryptoExchangerArray[i].getCurrentValue(),
      });
    }
    return coinArray;
  }

  static getTotalCurrentNetValue() {
    return parseFloat(CryptoExchanger.dollars) 
      + parseFloat(CryptoExchanger.getTotalCryptoValue());
  }

  static getTotalCryptoValue() {
    var totalValue = 0;
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
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
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      totalDollarBoughtVolume += CryptoExchanger.cryptoExchangerArray[i].dollarBoughtVolume;
      totalDollarSoldVolume += CryptoExchanger.cryptoExchangerArray[i].dollarSoldVolume;
      totalCryptoValue += CryptoExchanger.cryptoExchangerArray[i].getCurrentValue();
    }
    console.log("totalDollarSoldVolume: " + totalDollarSoldVolume + ", totalDollarBoughtVolume: " + totalDollarBoughtVolume);
    return totalDollarSoldVolume + totalCryptoValue - totalDollarBoughtVolume;
  }

  static getCryptoNameList() {
    console.log("DEBUG: getCryptoNameList called, length: " + CryptoExchanger.cryptoExchangerArray.length);
    var nameArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      nameArray.push(CryptoExchanger.cryptoExchangerArray[i].getCoinName());
    }
    return nameArray;
  }


  static initializeDollars(inDollars) {
    CryptoExchanger.dollars = inDollars;
    CryptoExchanger.startingDollars = inDollars;
    CryptoExchanger.saveDollarsToFile(inDollars);
    CryptoExchanger.saveDollarVolumes();
  }

  static setDollars(inDollars) {
    CryptoExchanger.dollars = inDollars;
    CryptoExchanger.saveDollarsToFile(inDollars);
  }

  static addCryptoExchanger(inCryptoID, inCryptoName) {
    var newExchanger = new CryptoExchanger(inCryptoID, inCryptoName, false);
    CryptoExchanger.cryptoExchangerArray.push(newExchanger);
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
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      if(inCryptoID == CryptoExchanger.cryptoExchangerArray[i].getCoinID()) {
        removedCryptoExchanger = CryptoExchanger.cryptoExchangerArray.splice(i, 1);
        removedCryptoExchanger[0].sellCrypto(removedCryptoExchanger[0].getCoin(), false);
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

  static resetCryptoExchangers(inDollars) {
    CryptoExchanger.setDollars(inDollars);
    CryptoExchanger.removedDollarBoughtVolume = 0;
    CryptoExchanger.removedDollarSoldVolume = 0;
    CryptoExchanger.startingDollars = inDollars;
    CryptoExchanger.areCryptosLoaded = false;
    Profile.forceProfileUpdate();
    while(CryptoExchanger.cryptoExchangerArray.length > 0) {
      var removedExchanger = CryptoExchanger.cryptoExchangerArray.splice(0, 1);
      removedExchanger[0].reset();
    }
    CryptoExchanger.resetCryptoList()
      .then(CryptoExchanger.loadCryptoExchangerData().then(() => {
        console.log("forcing update after load");
        Profile.forceProfileUpdate();
        ExchangerScreen.forceUpdate();
      }));
    CryptoExchanger.saveDollarVolumes()
      .catch((error) => console.log(error));
    // ExchangerComponent.forceUpdate();
  }

  static async checkIfFileDirExists() {
    var retObj = await FileSystem.getInfoAsync(fileDir);
    if(retObj.exists && retObj.isDirectory)
      return true;
    else
      return false;
  }  

  // Adds and initializes a default amount of cryptocurrencies to the portfolio
  static initializeDefaultPortfolio() {
    // Add default crypto objects to crypto array  
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("bitcoin", "Bitcoin", false));
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("ethereum", "Ethereum", false));
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("litecoin", "Litecoin", false));
    CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger("monero", "Monero", false));
    CryptoExchanger.areCryptosLoaded = true; 
  }

  /** Loads in all of the cryptocurrency exchanger objects, user cash, and stats from file and
   *  applys default values if the objects and values cannot be read **/
  static async loadCryptoExchangerData() {
    if(CryptoExchanger.areCryptosLoaded)
      return;

    // If the portfolio directory does not exist, then the application is being run for the
    // first time and must be initialized
    /*if(!CryptoExchanger.checkIfFileDirExists()) {
      console.log("DEBUG: Portfolio directory does not exist...");
      CryptoExchanger.initalizeDefaultPortfolio();
      await CryptoExchanger.saveCryptoExchangers();
      return;
    } else {
      console.log("DEBUG: Portfolio directory does exist...");
    }*/ 
    
    if(false) {
      await FileSystem.deleteAsync(
        fileDir + "cryptolist.txt",
        { idempotent: true }
      );
      await FileSystem.deleteAsync(
        fileDir + "dollars.txt",
        { idempotent: true }
      );
    }  

    var cryptoList;
    try {
      cryptoList = await CryptoExchanger.getCryptoListFromFile();
      console.log("DEBUG: crypto list loaded from file: " + cryptoList);
      for(var i = 0; i < cryptoList.length; i++) {
        CryptoExchanger.cryptoExchangerArray.push(new CryptoExchanger(cryptoList[i], null, true));
        await CryptoExchanger.cryptoExchangerArray[i].loadValuesFromFile();
      }
    } catch(error) {
      console.log("ERROR: cryptolist cannot be read");
      //console.log(error);
      this.initializeDefaultPortfolio();
      await CryptoExchanger.saveCryptoExchangers();
    }
   
    // fetch the price of all of the currencies in the portfolio
    try {
      console.log("DEBUG: fetching crypto prices for each crypto exchanger object");
      for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
        await CryptoExchanger.cryptoExchangerArray[i].fetchCoinPrice();
        //console.log(CryptoExchanger.cryptoExchangerArray[i]);
      }
    } catch(error) {
      console.log(error);
    }

    try {
      await CryptoExchanger.loadDollarsFromFile();
    } catch(error) {
      console.log("ERROR: cannot load dollars from file");
    }  

    // load the amount of cash the user has and buying stats for cryptocurrencies
    // that have been removed from the portfolio
    try {
      await CryptoExchanger.loadDollarVolumes();
    } catch(error) {
      console.log("ERROR: cannot load dollar volumes");
      console.log(error);
    }

    CryptoExchanger.areCryptosLoaded = true;
  }

  static async loadDollarsFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      fileDir + "dollars.txt",
      { encoding: FileSystem.EncodingType.UTF8 }
    );

    var fileObj = JSON.parse(fileString);
    CryptoExchanger.dollars = fileObj.fileDollars;
  }

  static async loadDollarVolumes() {
    var fileObj;
    try {
      fileObj = JSON.parse(await FileSystem.readAsStringAsync(
        fileDir + "dollarvolumes.txt",
        { encoding: FileSystem.EncodingType.UTF8 }
      ));
    } catch(error) {
      console.log("There was an error reading dollar volumes");
      return;
    }
    if(fileObj == null)
      return;
    if(fileObj.removedDollarBoughtVolume != null)
      this.removedDollarBoughtVolume = fileObj.removedDollarBoughtVolume;
    if(fileObj.removedDollarSoldVolume != null)
      this.removedDollarSoldVolume = fileObj.removedDollarSoldVolume;
    if(fileObj.startingDollars != null)
      CryptoExchanger.startingDollars = fileObj.startingDollars;
  }

  /** Saves the data for all the cryptocurrencies in the portfolio to file and
   *  saves a list of all of the cryptocurrencies in the portfolio to file **/
  static async saveCryptoExchangers() {
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      await CryptoExchanger.cryptoExchangerArray[i].saveValuesToFile();
    }
    await CryptoExchanger.saveCryptoList();
  }

  static async saveCryptoList() {
    console.log("DEBUG: saving crypto list");
    await FileSystem.deleteAsync(
      fileDir + "cryptolist.txt",
      { idempotent: true }
    );
    var nameArray = [];
    for(var i = 0; i < CryptoExchanger.cryptoExchangerArray.length; i++) {
      nameArray.push(CryptoExchanger.cryptoExchangerArray[i].getCoinID());
    }
  

    //var saveURI = FileSystem.documentDirectory + "cryptolist.txt";
    var saveURI = fileDir + "cryptolist.txt";
    try { 
      await FileSystem.writeAsStringAsync(
        saveURI,
        JSON.stringify(nameArray),
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      console.log("DEBUG: crypto list saved to file: " + JSON.stringify(nameArray));
    } catch(error) {
      console.log("ERROR: cannot save crypto list: " + JSON.stringify(nameArray)
                + "to file " + saveURI);
      console.log(error);
    }
  }

  static async saveDollarsToFile(dollarAmount) {
    var fileObj = {
      fileDollars: dollarAmount,
    }

    await FileSystem.writeAsStringAsync(
      fileDir + "dollars.txt",
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  static async saveDollarVolumes() {
    console.log("DEBUG: saving dollar volumes");
    var fileObj = {
      removedDollarBoughtVolume: this.removedDollarBoughtVolume,
      removedDollarSoldVolume: this.removedDollarSoldVolume,
      startingDollars: CryptoExchanger.startingDollars,
    }

    await FileSystem.writeAsStringAsync(
      fileDir + "dollarvolumes.txt",
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  /** Creates a default list of cryptocurrencies to use in the portfolio and
   *  saves that default list to file **/
  static async resetCryptoList() {
    try {
      await FileSystem.deleteAsync(
      fileDir + "cryptolist.txt",
      { idempotent: true }
    );
    } catch(error) {
      console.log("there was an error deleteing the cryptolist file");
    }
    var nameArray = [ "bitcoin", "ethereum", "litecoin", "monero" ];
    console.log("resetCryptoList called");
    try {
      await FileSystem.writeAsStringAsync(
      fileDir + "cryptolist.txt",
      JSON.stringify(nameArray),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
    } catch(error) { 
      console.log("there was an error saving cryptolist.txt file during reset");
      console.log(error);
    }
  }

  /** Returns an array of strings with the names of all the cryptocurrencies which
      the user has in their porfolio **/
  static async getCryptoListFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      fileDir + "cryptolist.txt",
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
    if(this.coinID == null)
      console.log("coinID null");
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
      if inDollarsWorth is true, returns true if successful and false otherwise **/
  buyCrypto(inAmount, inDollarsWorth) {
    var newCoinAmount = this.coin;
    var newDollarAmount = CryptoExchanger.dollars;
    
    // Get the amount of dollars being sold 
    var dollarWorth = (inDollarsWorth?inAmount:this.getDollarExchangeValue(inAmount));
    if(dollarWorth.toFixed(2) == parseFloat(CryptoExchanger.dollars).toFixed(2)) {
      newCoinAmount += this.getCryptoExchangeValue(inAmount);
      newDollarAmount = 0;
    } else if(inDollarsWorth) {
      newCoinAmount += this.getCryptoExchangeValue(inAmount);
      newDollarAmount -= inAmount;
    } else {
      newCoinAmount += inAmount;
      newDollarAmount -= this.getDollarExchangeValue(inAmount);
    }

    if(newCoinAmount < 0 || newDollarAmount < 0) {
      return false;
    }

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
    return true;
  }

  sellCrypto(inAmount, inDollarsWorth) {
    if(inAmount <= 0)
      return;

    var newCoinAmount = this.coin, newDollarAmount = CryptoExchanger.dollars;

    // Get the amount of crypto being sold
    var cryptoWorth = (inDollarsWorth?this.getCryptoExchangeValue(inAmount):inAmount);
    // If the amount being sold is equal to the amount currently owned up to 5 decimal places
    if(cryptoWorth.toFixed(5) == this.coin.toFixed(5)) {
      newCoinAmount = 0;
      newDollarAmount += this.getDollarExchangeValue(inAmount);
    } else if(inDollarsWorth) {
      newCoinAmount -= this.getCryptoExchangeValue(inAmount);
      newDollarAmount += inAmount;
    } else {
      newCoinAmount -= inAmount;
      newDollarAmount += this.getDollarExchangeValue(inAmount);
    }

    if(newCoinAmount < 0 || newDollarAmount < 0) {
      return false;
    }  

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

    return true;
  }

  reset() {
    this.setCoin(0);
    this.dollarBoughtVolume = 0;
    this.dollarSoldVolume = 0;
    this.saveCoinsToFile();
    this.fetchCoinPrice();
  }



  // Loads the amount of dollars and coins from the last time it was saved
  async loadValuesFromFile() {
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

  async saveCoinsToFile() {
    var fileObj = {
      // coinName: this.getCoinID().substring(0, 1).toUpperCase() + this.getCoinID().substring(1, this.getCoinID().length),
      coinName: this.getCoinName(),
      coin: this.coin,
      dollarBoughtVolume: this.dollarBoughtVolume,
      dollarSoldVolume: this.dollarSoldVolume,
    };

    await FileSystem.writeAsStringAsync(
      fileDir + this.getCoinFilename(),
      JSON.stringify(fileObj),
      { encoding: FileSystem.EncodingType.UTF8 }
    );
  }

  async loadCoinsFromFile() {
    let fileString = await FileSystem.readAsStringAsync(
      fileDir + this.getCoinFilename(),
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
