
var exports = module.exports = {};
var webdriver = require('selenium-webdriver'),
  chrome = require('selenium-webdriver/chrome'),
  By = webdriver.By,
  until = webdriver.until,
  SiteReport = require('../model/SiteReport.js'),
  AllReports = require('../model/AllReports.js');
  const pool = require('../db');


exports.runTest = function(site,account,node){
  var returnMessage = {};
  var options = new chrome.Options();
  var logging_prefs = new webdriver.logging.Preferences();
  // https://github.com/SeleniumHQ/selenium/wiki/Logging
  logging_prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Type.SERVER,webdriver.logging.Level.ALL);
  options.setLoggingPrefs(logging_prefs);
  options.addArguments("--load-extension=/abp-latest");
  options.addArguments("--no-sandbox");
  
  var capabilities = {
    'applicationName' : node
  };
    
  var driver = new webdriver.Builder()
    .withCapabilities(capabilities)
    .forBrowser('chrome')
    .setChromeOptions(options)
    .usingServer('http://198.199.115.13:4444/wd/hub')
    .build();
  
  console.log('_____adding test for ' + site + ' to node: ' + node);
  
  // console.log(driver.manage().logs())
  // driver.manage().logs().get('performance').then(function(text) {
  //   console.log(text);
  // });
  // driver.manage().logs().get('server').then(function(text) {
  //   console.log(text);
  // });
  
  driver.manage().window().setSize(1280, 1280);
  
  var domainArray = site.split('.');
  var domainSlashArray = site.split('/');
  var testUrl = 'http://' + site;
  var cookieDomain = site;
  
  if(domainArray.length >= 3){
    // testUrl = 'http://www.' + site;
    cookieDomain = domainArray[domainArray.length - 2] + '.' + domainArray[domainArray.length - 1];
  }else if(domainSlashArray.length > 0){
    cookieDomain = domainSlashArray[0];
  }
  
  var testdata = {}, testimage = {};
  
  driver.get(testUrl).catch(function(e){
      console.log('________Issue in the initial get: ' + e);
      testdata.I11C = false;
  }).then(function() {
// set a cookie on the current domain
    if(countDots = 3){
      // site split to tld
    }
    
    driver.manage().addCookie({
      name: "magicMorph",
      value: "foo",
      path: "/",
      domain: "." + cookieDomain//,
      // expiry: Date.UTC(2018, 08, 30) / 1000
    }).catch(function(e){
      console.log('________Issue setting cookie: ' + e);
      testdata.I11C = false;
    });
    
  })
   // get a page with the cookie
   returnMessage = driver.get(testUrl).then(function() {
    
    var ip = 0;
    
    driver.wait(function () {
      return driver.executeScript('' +
        'if(window.I11C){return (window.I11C.Morph && window.I11C.Morph === 1)}else{return false}' +
        '').then(function (return_value) {
        if(return_value){
          testdata.I11C = true;
        }
        return return_value;
      });
    }, 15000, '\n Failed to find I11C.').catch(function(e){
      if (e.message.match("Timed out")){
        console.log('________I11C wait timed out: ' + e);
      } else {
        console.log('________I11C detection error: ' + e);
        testdata.I11C = false;
        testdata.timedout = true;
      }
    }).then(null, function (err) {
      if (err)
        testdata.I11C = false;
    });
  
    driver.wait(function () {
        return driver.executeScript('' +
          'if(performance.getEntriesByType("resource").length > 0){return performance.getEntriesByType("resource")}else{return false}' +
          '').then(function (return_value) {
          if(return_value){
            testdata.resourceTiming = return_value;
            return true;
          }else{
            return return_value;
          }
        });
      }, 5000, '\n Failed to resources.').catch(function(e){
          console.log('________resource detection error: ' + e);
      }).then(null, function (err) {
        if (err)
          console.log('________resource detection error: ' + err);
      });
  
    // driver.wait(function () {
    //   return driver.executeScript('' +
    //     'var isAmazon = false;for(var entry in performance.getEntriesByType("resource")){' +
    //     'if(performance.getEntriesByType("resource")[entry].name.indexOf("amazon-adsystem.com") >= 0){isAmazon = true;break}' +
    //     '}return isAmazon').then(function (return_value) {
    //     if(return_value){
    //       testdata.amazon = true;
    //     }
    //     return return_value;
    //   });
    // }, 5000, '\n Failed to find amazon.').catch(function(e){
    //   if (e.message.match("Timed out")){
    //     console.log('________amazon wait timed out: ' + e);
    //   } else {
    //     console.log('________amazon detection error: ' + e);
    //     testdata.amazon = false;
    //   }
    // }).then(null, function (err) {
    //   if (err)
    //     testdata.amazon = false;
    // });
  
    //google DFP targeting array
    driver.wait(function () {
      return driver.executeScript('' +
        'var gpubads = false;' +
        'if(googletag.pubads().getTargetingKeys().length >= 0){gpubads=true}else{gpubads=false};' +
        'if(gpubads === false){return false}else{return googletag.pubads().getTargetingKeys()}').then(function (return_value) {
        if(return_value === false){
          return return_value;
        }else{
          testdata.dfpTargetingKeys = return_value;
          return true
        }
      });
    }, 5000, '\n Failed to find dfp targeting.').catch(function(e){
      if (e.message.match("Timed out")){
        console.log('________dfp targeting wait timed out: ' + e);
      } else {
        console.log('________dfp targeting detection error: ' + e);
      }
    }).then(null, function (err) {
      if (err)
        console.log('________dfp targeting detection error: ' + err);
    });
    
    driver.takeScreenshot().catch(function(e){
        if (e.message.match("Timed out")){
          console.log('________Screenshot timed out: ' + e);
        } else {
          console.log('________Screenshot error: ' + e);
        }
      }).then(
      function(image, err) {
        var unblocking = false;
        var ss_filename = 'out-' + ip + '-' + (new Date().getTime()) + '.png';
        
        testdata.url = site;
        testdata.account = account;
        testdata.timestamp = Date.now();
        testdata.geo = node;
        SiteReport.testdata = testdata;
        SiteReport.testimage = image;
      }
    );
    
    //AllReports.testdataList.push(testdata);
  
    driver.close();
    
    
  })//driver.get 2
  
  return returnMessage;
  
}//end if
