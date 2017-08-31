var express = require('express');
var router = express.Router();
var sr = require('../selenium/siterunner-step2');
var SiteReport = require('../model/SiteReport.js');
var AllReports = require('../model/AllReports.js');
var AllSites = require('../model/AllSites.js');
const pool = require('../db');


var availableNodes = ['ny3-node'];


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
        var foo = sr.runTest(customerData.live[site],customerData.name, req.query.nodeName);
        
        foo.catch(function(e){
          console.log('________sr main thread error: ' + e);
        }).then(function(obj) {
          SiteReport.count++;
          console.log('--unblocking?- ' + SiteReport.testdata.I11C);
          
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
