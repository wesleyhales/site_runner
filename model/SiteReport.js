var SiteReport = module.exports = {
  count: 0,
  testRunning: false,
  testimage: {
    screenShotBase64: '',
    screenShotFilename: ''
  },
  testdata: {
    account: '',
    timestamp: 0,
    url: '',
    timedout: false,
    sessionID: 0,
    amazon: false,
    dfpTargetingKeys: '',
    geo: '',
    resourceTiming: []
  },
  io: {}
}