// 引入依赖包
const Web3 = require('web3')
// 引入编译文件
const contractFile = require('./compile')

// 从启动的server里选择一个私钥
const privatekey =
  '0xa2c50a788071fecc5075dcb1eef0e4ff2305e039c95ae46b86d49a0d79d3f688'

// 获取合约二进制和二进制接口
const bytecode = contractFile.evm.bytecode.object
const abi = contractFile.abi

// 1、创建一个web3的实例
const web3 = new Web3('http://127.0.0.1:8545')

// 2、根据私钥创建账户
const account = web3.eth.accounts.privateKeyToAccount(privatekey)
const accountFrom = {
  privateKey: privatekey,
  accountAddress: account.address,
}

// 部署方法
const Deploy = async () => {
  // 创建合约实例
  const deployContract = new web3.eth.Contract(abi)

  // 创建交易
  const deployTx = deployContract.deploy({
    data: bytecode,
    // 传递参数给合约构造函数
    arguments: [0],
  })

  // 交易签名
  const deployTransaction = await web3.eth.accounts.signTransaction(
    {
      data: deployTx.encodeABI(),
      gas: await deployTx.estimateGas(),
    },
    accountFrom.privateKey,
  )

  // 交易收据
  const deployReceipt = await web3.eth.sendSignedTransaction(
    deployTransaction.rawTransaction,
  )

  // 得到合约部署之后的地址，执行合约时用到
  console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`)
}

// 3、执行部署
Deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
