var express = require('express');
var router = express.Router();
var sr = require('../selenium/crawl-search');
var SiteReport = require('../model/SiteReport.js');
var AllReports = require('../model/AllReports.js');
var AllSites = require('../model/AllSites.js');
const pool = require('../db');


var availableNodes = ['local-node'];


function oneOffTest(url, name, runtype, node) {
  
  var foo = sr.runTest(url, name, runtype, node);
  
  foo.catch(function(e){
    console.log('________sr oneoff main thread error: ' + e);
  }).then(function(obj) {
    
    pool.query('INSERT INTO timingdata (data,image) VALUES ($1::jsonb,$2::text);', [SiteReport.testdata, SiteReport.testimage], function(err, res) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log('test data inserted!');
    });
    
  });
};

router.get('/startTest', function(req, res, next) {
  SiteReport.testRunning = true;
  AllReports.testdataList = [];
  
  if(availableNodes.indexOf(req.query.nodeName) === -1){
    res.send('node ' + req.query.nodeName + ' does not exist!');
  }else{
  
  var filteredArray = 0;
  for(var customer in AllSites.customers) {
    var customerData = AllSites.customers[customer];
    //if(customerData.name === 'test'){
      //get total sites
    
      filteredArray = customerData.live.length;
      for (var site in customerData.live) {
        var foo = sr.runTest(customerData.live[site],customerData.name, 'parent', req.query.nodeName);
        
        foo.catch(function(e){
          console.log('________sr main thread error: ' + e);
        }).then(function(obj) {
          
          //check to see if this is part of a crawl
          var allCrawlableDomains = SiteReport.testdata.allCrawlableDomains;
          if(allCrawlableDomains.length > 0){
            allCrawlableDomains.forEach(function(url){
              console.log(1,url);
              url = url.replace('https://','').replace('http://','');
              oneOffTest(url, customerData.name, 'oneoff', req.query.nodeName)
            })
          }
          
          SiteReport.count++;
          
          pool.query('INSERT INTO timingdata (data,image) VALUES ($1::jsonb,$2::text);', [SiteReport.testdata, SiteReport.testimage], function(err, res) {
            if(err) {
              return console.error('error running query', err);
            }
            console.log('test data inserted!');
          });
  
          //has to be after db insert
          //SiteReport.testdata.screenShotBase64 = SiteReport.testimage;
          SiteReport.io.sockets.emit('testComplete', SiteReport.testdata);
          
          if(filteredArray === SiteReport.count){
            console.log('_____done');
            SiteReport.testRunning = false;
          }
        });
      }
    //}
  }
  res.send(req.query.nodeName + ' Node Running!');
  
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  
  // pool.query('SELECT * FROM timingdata WHERE data -> $1 > \'1\'', ['1'], function(err, res) {
  console.log('------------- ' + req.query.account + ' ' + JSON.stringify(req.params));
  var currentAccount = {"account":req.query.account};
  
  if(!(req.query.account === undefined)) {
    pool.query('SELECT * FROM timingdata WHERE data @> $1', [currentAccount], function (err, dbres) {
      if (err) {
        return console.error('error running query', err);
      }
      res.render('property', {stored: dbres.rows,accounts: AllSites.customers});
    });
  }else{
    res.render('index', {accounts: AllSites.customers});
  }
  
  
});

router.get('/delete', function(req, res, next) {
  
    pool.query('DELETE FROM timingdata', function (err, dbres) {
      if (err) {
        return console.error('error running delete query', err);
      }
      res.send('You just deleted all the data!');
    });
 
});

module.exports = router;
