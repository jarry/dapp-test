// 引入依赖包
const Web3 = require('web3')
// 引入编译文件
const contractFile = require('./compile')

// 从启动的server里选择一个私钥
const privatekey =
  '0xf5dddae8675da17928be79ded499ab19a8697aeca8e81f5d7e896e4fe6b1da65'

// 获取二进制接口
const abi = contractFile.abi

// 1、创建一个web3的实例
const web3 = new Web3('http://127.0.0.1:8545')

// 2、根据私钥创建账户
const account = web3.eth.accounts.privateKeyToAccount(privatekey)
const accountFrom = {
  privateKey: privatekey,
  accountAddress: account.address,
}

// 3、连接到合约地址
const contractAddress = '0xcCbc1eaB6359F622f688921c28142d96ABed052F'
// 创建合约实例
const incrementer = new web3.eth.Contract(abi, contractAddress)

// 4、创建交易
const resetTx = incrementer.methods.reset()

// 交互代码
const reset = async () => {
  console.log(`执行 incrementer.methods.reset() ，合约地址: ${contractAddress}`)

  // 交易签名
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: resetTx.encodeABI(),
      gas: await resetTx.estimateGas(),
    },
    accountFrom.privateKey,
  )

  // 执行交易，得到收据
  const createReceipt = await web3.eth.sendSignedTransaction(
    createTransaction.rawTransaction,
  )
  console.log(`交易成功！交易hash为: ${createReceipt.transactionHash}`)

  // 调用number查看结果
  const data = await incrementer.methods.number().call()
  console.log(`最新number: ${data}`)
}

// 3、执行重置
reset()
