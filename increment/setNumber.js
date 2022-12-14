// 引入依赖包
const Web3 = require('web3')
// 引入编译文件
const contractFile = require('./compile')

// 从启动的server里选择一个私钥
const privatekey =
  '0x8f8472b88a2245f6501dbcb979f02f71960f350a6004e77dce1f3fe96bc91e7c'

// 获取二进制接口
const abi = contractFile.abi

// 1、创建一个web3的实例
const web3 = new Web3('http://127.0.0.1:8545')

// 2、根据私钥连接账户
const account = web3.eth.accounts.privateKeyToAccount(privatekey)
const accountFrom = {
  privateKey: privatekey,
  accountAddress: account.address,
}

// 3、连接到合约地址，从部署的地址获取
const contractAddress = '0x33C942Ef1fA5Deee9283546A70c219c1c8730941'
// 创建合约实例
const incrementer = new web3.eth.Contract(abi, contractAddress)

// 交互代码
const setNumber = async (num) => {
  const newNumber = num
  const incrementTx = incrementer.methods.setNumber(newNumber)

  console.log(`执行新增 ${newNumber} ，合约地址: ${contractAddress}`)

  // 交易签名
  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: incrementTx.encodeABI(),
      gas: await incrementTx.estimateGas(),
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

// 3、执行增加
setNumber(201)
