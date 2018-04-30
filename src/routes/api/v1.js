var v1Router = require('express').Router();
var web3 = require('../../utils/web3');

function web3Middleware(req, res, next) {
  if(web3 && web3.isConnected()) {
    next();
  } else {
    next(new Error('Web3 Provider is not Connected'));
  }
}

v1Router.get('/node', web3Middleware, (req, res, next) => {
  var result = web3.admin.nodeInfo;

  res.status(200).json({
    data: {
      enode: result.enode,
      name: result.name,
    },
  });
});

v1Router.get('/block/:blockNumber', web3Middleware, (req, res, next) => {
  const { blockNumber } = req.params;

  if (blockNumber) {
    web3.eth.getBlock(blockNumber, (error, result) => {
      if (!error) {
        res.status(200).json({
          data: result,
        });
      } else {
        next(error);
      }
    })
  }
});

v1Router.get('/transaction/:transationHash', web3Middleware, (req, res, next) => {
  const { transationHash } = req.params;

  if (transationHash) {
    web3.eth.getTransaction(transationHash, (error, result) => {
      if (!error) {
        res.status(200).json({
          data: result,
        });
      } else {
        next(error);
      }
    })
  }
});

v1Router
  .route('/miner')
  .all(web3Middleware)
  .put((req, res, next) => {
    web3.miner.start(1, (error, result) => {
      if (!error) {
        res.status(204);
      } else {
        next(error);
      }
    })
  })
  .delete((req, res, next) => {
    web3.miner.end((error, result) => {
      if (!error) {
        res.status(204);
      } else {
        next(error);
      }
    })
  });

module.exports = v1Router;