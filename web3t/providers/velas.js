// Generated by LiveScript 1.5.0
(function(){
  var Wallet, VelasCrypto, ref$, map, foldl, filter, get, post, plus, minus, times, div, fromHex, bip39, bigInteger, moment, toCallback, calcFee, getKeys, transformTx, getTransactions, bigInt, getUnspents, createTransaction, pushTx, checkTxStatus, getTotalReceived, getUnconfirmedBalance, getBalance, out$ = typeof exports != 'undefined' && exports || this, toString$ = {}.toString;
  Wallet = require('../node_modules_embed/vlx-wallet/Crypto/Wallet.js')['default'];
  VelasCrypto = require('../node_modules_embed/vlx-wallet/Crypto/index.js')['default'];
  ref$ = require('prelude-ls'), map = ref$.map, foldl = ref$.foldl, filter = ref$.filter;
  ref$ = require('./superagent.js'), get = ref$.get, post = ref$.post;
  ref$ = require('../math.js'), plus = ref$.plus, minus = ref$.minus, times = ref$.times, div = ref$.div, fromHex = ref$.fromHex;
  bip39 = require('bip39');
  bigInteger = require('big-integer');
  moment = require('moment');
  toCallback = function(p, cb){
    p.then(function(res){
      return cb(null, res);
    });
    return p['catch'](function(res){
      return cb(res);
    });
  };
  out$.calcFee = calcFee = function(arg$, cb){
    var network, feeType, account, amount, to, data;
    network = arg$.network, feeType = arg$.feeType, account = arg$.account, amount = arg$.amount, to = arg$.to, data = arg$.data;
    return cb(null, network.txFee);
  };
  out$.getKeys = getKeys = function(arg$, cb){
    var network, mnemonic, index;
    network = arg$.network, mnemonic = arg$.mnemonic, index = arg$.index;
    return toCallback(VelasCrypto.init(), function(err, vc){
      var seedBuffer, seed, res, address, privateKey;
      try {
        seedBuffer = bip39.mnemonicToSeed(mnemonic);
        seed = seedBuffer.toString('hex');
        res = vc.keysGen.fromSeed(seed, 'm/' + index + '\'');
        address = res.toWallet().Base58Address;
        privateKey = res.privateKey;
        return cb(null, {
          address: address,
          privateKey: privateKey
        });
      } catch (e$) {
        err = e$;
        return cb(err);
      }
    });
  };
  transformTx = curry$(function(network, t){
    var url, tx, time, to, from, fee;
    url = network.api.url;
    network = 'vlx';
    tx = t.tx_hash;
    time = moment.utc(t.dt).unix();
    url = url + "/tx/" + tx;
    to = t.to_address;
    from = t.from_address;
    fee = t.commission;
    return {
      network: network,
      tx: tx,
      amount: t.amount,
      fee: fee,
      time: time,
      url: url,
      from: from,
      to: to
    };
  });
  out$.getTransactions = getTransactions = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    return get(network.api.historyUrl.replace(':address', address)).end(function(err, data){
      var txs, ref$, newTxs;
      if (err != null) {
        return cb(err);
      }
      txs = (ref$ = data.body) != null ? ref$.items : void 8;
      if (toString$.call(txs).slice(8, -1) !== 'Array') {
        return cb("expected array");
      }
      if (txs.length === 0) {
        return cb(null, []);
      }
      newTxs = map(transformTx(network))(
      txs);
      console.log('velas', newTxs);
      return cb(null, newTxs);
    });
  };
  bigInt = function(it){
    return new bigInteger(it);
  };
  getUnspents = function(arg$, cb){
    var network, address, baseUrl;
    network = arg$.network, address = arg$.address;
    baseUrl = network.api.apiUrl;
    return get(baseUrl + "/wallet/unspent/" + address).end(function(err, res){
      var unspentsNative;
      if (err != null) {
        return cb(err);
      }
      unspentsNative = res.body;
      if (toString$.call(unspentsNative).slice(8, -1) !== 'Array') {
        return cb("expected array, got " + toString$.call(unspentsNative).slice(8, -1));
      }
      if (err != null) {
        return cb(err);
      }
      return cb(null, res.body);
    });
  };
  out$.createTransaction = createTransaction = curry$(function(arg$, cb){
    var network, account, recipient, amount, amountFee, data, feeType, txType;
    network = arg$.network, account = arg$.account, recipient = arg$.recipient, amount = arg$.amount, amountFee = arg$.amountFee, data = arg$.data, feeType = arg$.feeType, txType = arg$.txType;
    if (!Wallet.IsValidAddress(account.address)) {
      return cb("Given address is not valid Velas address");
    }
    if (!Wallet.IsValidAddress(recipient)) {
      return cb("Recipient address is not valid Velas address");
    }
    return getUnspents({
      network: network,
      address: account.address
    }, function(err, unspentsNative){
      var unspents;
      if (err != null) {
        return cb(err);
      }
      if (unspentsNative.length === 0) {
        return cb("there is not any unspents");
      }
      unspents = map(function(it){
        return {
          hash: it.hash,
          index: it.index,
          value: bigInt(it.value)
        };
      })(
      unspentsNative);
      return calcFee({
        network: network,
        feeType: feeType,
        account: account,
        amount: amount,
        to: recipient,
        data: data
      }, function(err, fee){
        if (err != null) {
          return cb(err);
        }
        return toCallback(VelasCrypto.init(), function(err, vc){
          var hdKeys, wallet, amountSatoshi, amountSatoshiBigInt, feeSatoshi, feeBigInt, txUnsigned, tx, rawtx;
          if (err != null) {
            return cb(err);
          }
          hdKeys = vc.keysGen.fromPrivateKey(account.privateKey);
          wallet = hdKeys.toWallet();
          amountSatoshi = times(amount, Math.pow(10, network.decimals));
          amountSatoshiBigInt = bigInt(amountSatoshi);
          feeSatoshi = times(fee, Math.pow(10, network.decimals));
          feeBigInt = bigInt(feeSatoshi);
          txUnsigned = vc.tx.generate(unspents, amountSatoshiBigInt, hdKeys, account.address, recipient, feeBigInt);
          tx = txUnsigned.sign();
          rawtx = tx.toJSON();
          return cb(null, {
            rawtx: rawtx
          });
        });
      });
    });
  });
  out$.pushTx = pushTx = curry$(function(arg$, cb){
    var network, rawtx, baseUrl, tx;
    network = arg$.network, rawtx = arg$.rawtx;
    baseUrl = network.api.apiUrl;
    tx = JSON.parse(rawtx);
    return post(baseUrl + "/txs/publish", tx).end(function(err, res){
      if (err != null) {
        return cb(err);
      }
      if (res.body.result !== 'ok') {
        return cb("expected result ok");
      }
      return cb(null, tx.hash);
    });
  });
  out$.checkTxStatus = checkTxStatus = function(arg$, cb){
    var network, tx;
    network = arg$.network, tx = arg$.tx;
    return cb("Not Implemented");
  };
  out$.getTotalReceived = getTotalReceived = function(arg$, cb){
    var address, network;
    address = arg$.address, network = arg$.network;
    if (!Wallet.IsValidAddress(address)) {
      return cb("Given address is not valid Velas address");
    }
    return cb(null, 0);
  };
  out$.getUnconfirmedBalance = getUnconfirmedBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    if (!Wallet.IsValidAddress(address)) {
      return cb("Given address is not valid Velas address");
    }
    return cb(null, 0);
  };
  out$.getBalance = getBalance = function(arg$, cb){
    var network, address;
    network = arg$.network, address = arg$.address;
    if (!Wallet.IsValidAddress(address)) {
      return cb("Given address is not valid Velas address");
    }
    return getUnspents({
      network: network,
      address: address
    }, function(err, unspentsNative){
      var decimals, balance, this$ = this;
      if (err != null) {
        return cb(err);
      }
      if (unspentsNative.length === 0) {
        return cb(null, 0);
      }
      decimals = Math.pow(10, network.decimals);
      balance = foldl(plus, 0)(
      map(function(it){
        return div(it, decimals);
      })(
      map(function(it){
        return it.value;
      })(
      unspentsNative)));
      return cb(null, balance);
    });
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);
