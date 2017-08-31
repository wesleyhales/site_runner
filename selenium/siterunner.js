
var exports = module.exports = {};
var webdriver = require('selenium-webdriver'),
  chrome = require('selenium-webdriver/chrome'),
  By = webdriver.By,
  until = webdriver.until,
  SiteReport = require('../model/SiteReport.js');
  const pool = require('../db');


exports.runTest = function(site,account,node){
  var returnMessage = {};
  var options = new chrome.Options();
  
  // https://github.com/SeleniumHQ/selenium/wiki/Logging
  var logging_prefs = new webdriver.logging.Preferences();
  logging_prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Type.SERVER,webdriver.logging.Level.ALL);
  options.setLoggingPrefs(logging_prefs);
  options.addArguments("--no-sandbox");
  
  var capabilities = {
    'applicationName' : node
  };
  
  var hubAddr = '165.227.123.79';
    
  var driver = new webdriver.Builder()
    .withCapabilities(capabilities)
    .forBrowser('chrome')
    .setChromeOptions(options)
    .usingServer('http://' + hubAddr + ':4444/wd/hub')
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

  var testUrl = 'http://' + site,
      testdata = {}, testimage = {};
  
   // get a page with the cookie
   returnMessage = driver.get(testUrl).then(function() {
    
    var ip = 0;
     
  
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
      }, 30000, '\n Failed to resources.').catch(function(e){
          console.log('________resource detection error: ' + e);
      }).then(null, function (err) {
        if (err)
          console.log('________resource detection error: ' + err);
      });
  
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
    
    
  })
  
  return returnMessage;
  
}//end if
