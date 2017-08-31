

var bidderPatterns = {
  'AppNexus': [
    '.adnxs.com/jpt',
    '.adnxs.com/ut*/prebid'
  ],
  'Openx': [
    //'.servedbyopenx.com/w/1.0/jstag', //CDN
    '.servedbyopenx.com/w/1.0/acj',
    '.openx.net/w/1.0/acj'
  ],
  'Pubmatic': [
    //'.pubmatic.com/AdServer/js/gshowad.js', //CDN
    '.pubmatic.com/AdServer/AdCallAggregator',
    '.pubmatic.com/AdServer/AdServerServlet'
  ],
  'Rubicon': [
    //'.rubiconproject.com/ad/9707.js', //CDN
    '.rubiconproject.com/a/api/fastlane.json',
    '.rubiconproject.com/a/api/ads.json'
  ],
  'Criteo': [
    '.criteo.com/delivery/rta/rta.js'
  ],
  'Conversant': [
    'media.msg.dotomi.com/s2s/header'
  ],
  'Amazon': [
    //'.amazon-adsystem.com/aax2/amzn_ads.js', //CDN
    '.amazon-adsystem.com/e/dtb/bid'
  ],
  'AOL': [
    '.adtechus.com/pubapi*cmd=bid',
    '.adtech.advertising.com/pubapi*cmd=bid'
  ],
  'Sovrn': [
    '.lijit.com/rtb/bid'
  ],
  'Yieldbot': [
    //'.yldbt.com/js/yieldbot.intent.js', //CDN
    '.yldbt.com/m/'
  ],
  'Sonobi': [
    '.sonobi.com/trinity.js'
  ],
  'Index': [
    '.casalemedia.com/cygnus',
    '.casalemedia.com/headertag'
  ],
  'Proximic': [
    '.zqtk.net/'
  ],
  'AudienceS': [
    '.revsci.net/pql'
  ],
  'Adform': [
    'adx.adform.net/adx/?rp=4'
  ],
  'WideOrbit': [
    '.atemda.com/JSAdservingMP.ashx'
  ],
  'Kruxlink': [
    'link.krxd.net/'
  ],
  'PulsePoint': [
    'bid.contextweb.com/header'
  ],
  'Roxot': [
    'r.rxthdr.com/'
  ],
  'Komoona': [
    's.komoona.com/',
    'bidder.komoona.com/v1/GetSBids'
  ],
  'Widespace': [
    'engine.widespace.com/'
  ],
  'Mantis': [
    'mantodea.mantisadnetwork.com/'
  ],
  'SmartRTB+': [
    'prg.smartadserver.com/prebid'
  ],
  'RhythmOne': [
    'tag.1rx.io/rmp/*/*/mvo'
  ],
  'DFP': [
    '.doubleclick.net/gampad/ads'
  ],
  'Aardvark': [
    'thor.rtk.io/*/*/aardvark'
  ],
  'Adblade': [
    'rtb.adblade.com/prebidjs/bid'
  ],
  'AdBund': [
    'us-east-engine.adbund.xyz/prebid/ad/get',
    'us-west-engine.adbund.xyz/prebid/ad/get'
  ],
  'AdButler': [
    'servedbyadbutler.com/adserve/;type=hbr;'
  ],
  'Adequant': [
    'rex.adequant.com/rex/c2s_prebid?'
  ],
  'AdKernel': [
    'cpm.metaadserving.com/rtbg'
  ],
  'AdMedia': [
    'b.admedia.com/banner/prebid/bidder/?'
  ],
  'Admixer': [
    'inv-nets.admixer.net/prebid.aspx'
  ],
  'Bidfluence': [
    'bidfluence.azureedge.net/forge.js'
  ],
  'Brightcom': [
    'hb.iselephant.com/auc/ortb'
  ],
  'Centro': [
    '.brand-server.com/hb'
  ],
  'DistrictM': [
    'prebid.districtm.ca/lib.js'
  ],
  'Fidelity': [
    'x.fidelity-media.com/delivery/hb.php?'
  ],
  'GetIntent': [
    'cdn.adhigh.net/adserver/hb.js'
  ],
  'GumGum': [
    'g2.gumgum.com/hbid/imp'
  ],
  'HIRO Media': [
    'hb-rtb.ktdpublishers.com/bid/get'
  ],
  'JCM': [
    'media.adfrontiers.com/pq?t=hb&bids='
  ],
  'Komoona': [
    'bidder.komoona.com/v1/GetSBids'
  ],
  'Lifestreet': [
    'ads.lfstmedia.com/getad?'
  ],
  'Meme Global': [
    'stinger.memeglobal.com/api/v1/services/prebid'
  ],
  'NginAd': [
    'server.nginad.com/bid/rtb?'
  ],
  'Piximedia': [
    'static.adserver.pm/prebid'
  ],
  'Sekindo': [
    'hb.sekindo.com/live/liveView.php?'
  ],
  'ServerBid': [
    'e.serverbid.com/api/v2'
  ],
  'Sharethrough': [
    'btlr.sharethrough.com/header-bid/v1?'
  ],
  'SmartyAds': [
    'ssp-nj.webtradehub.com/?'
  ],
  'SpringServe': [
    'bidder.springserve.com/display/hbid?'
  ],
  'StickyAdsTV': [
    'cdn.stickyadstv.com/mustang/mustang.min.js',
    'cdn.stickyadstv.com/prime-time/intext-roll.min.js',
    'cdn.stickyadstv.com/prime-time/screen-roll.min.js'
  ],
  'TapSense': [
    'ads04.tapsense.com/ads/headerad'
  ],
  'ThoughtLeadr': [
    'cdn.thoughtleadr.com/v4'
  ],
  'TripleLift': [
    'tlx.3lift.com/header/auction?'
  ],
  'Twenga': [
    'rtb.t.c4tw.net/Bid?'
  ],
  'Underdog Media': [
    'udmserve.net/udm/img.fetch?tid=1;dt=9;'
  ],
  'Vertamedia': [
    'rtb.vertamedia.com/hb'
  ],
  'Vertoz': [
    'banner.vrtzads.com/vzhbidder/bid?'
  ],
  'Xhb': [
    'ib.adnxs.com/jpt?'
  ],
};

var LOG_WAIT_TIME = 6000;

//var LOG_LOC = 'http://localhost:3000/log';
var LOG_LOC = 'http://api.prebid.org/log';


var patternsToBidders = {};

// ["*://*.adnxs.com/jpt*"]
var reqPatterns = [];

for (var b in bidderPatterns) {
  var patterns = bidderPatterns[b];
  
  for (var i = 0; i < patterns.length; i++) {
    var p = patterns[i];
    patternsToBidders[p] = b;
    
    // .adnxs.com/jpt would become *.adnxs.com/jpt
    // and ad.crwdcntrl.net/ will remain as it is
    if (p[0] === '.') p = '*' + p;
    var urlPattern = '*://' + p + '*';
    reqPatterns.push(urlPattern);
  }
}

function getBidderFromURL(url) {
  if (!url) return;
  for (var p in patternsToBidders) {
    
    var urlRegex;
    var wildcard = p.indexOf('*');
    // '*' in a bidder pattern will match urls provided by Chrome API, but not
    // the patternsToBidders map using regex syntax. It will match as a regex
    // by placing '.' before the '*', meaning any character 0 or more times
    if (wildcard !== -1) {
      urlRegex = new RegExp(p.slice(0, wildcard) + '.' + p.slice(wildcard));
    }
    
    if (url.indexOf(p) != -1 || (urlRegex && urlRegex.test(url))) {
      return patternsToBidders[p];
    }
  }
}