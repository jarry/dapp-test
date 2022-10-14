// https://docs.moonbeam.network/cn/builders/build/eth-api/libraries/web3js
// 完整示例测试

// 引入依赖包
const Web3 = require('web3')
const solc = require('solc')
const fs = require('fs')

// 私钥，从启动的server里选择一个
const privatekey =
  '0xfa62db63e0f175d3e96f33fce848061f0509bb095426dae13e08ab3065e025e5'

// 1、 编译智能合约
const source = fs.readFileSync('Incrementer.sol', 'utf8')

// 编译 solidity 合约
const input = {
  language: 'Solidity',
  sources: {
    'Incrementer.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

// 得到合约编译后的字符串，解析为对象
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)))
const contractFile = tempFile.contracts['Incrementer.sol']['Incrementer']
console.log('Incrementer.sol：', tempFile)

// 2、合约部署
let deployReceipt
// 获取合约二进制接口
const bytecode = contractFile.evm.bytecode.object
const abi = contractFile.abi

// 创建一个Web3的实例
const web3 = new Web3('http://127.0.0.1:8545')

// 根据私钥创建账户
const account = web3.eth.accounts.privateKeyToAccount(privatekey)
const accountFrom = {
  privateKey: privatekey,
  accountAddress: account.address,
}

const Deploy = async () => {
  // 创建合约实例
  const deployContract = new web3.eth.Contract(abi)

  // 创建以太坊交易
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

  deployReceipt = await web3.eth.sendSignedTransaction(
    deployTransaction.rawTransaction,
  )
  // 打印部署之后的合约地址
  console.log(`Contract deployed at address: ${deployReceipt.contractAddress}`)
}

// 部署调用
Deploy()
  .then(() => {
    // 调用合约
    get(deployReceipt)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// 3、执行合约测试
const get = async (deployReceipt) => {
  const contractAddress = deployReceipt.contractAddress
  const incrementer = new web3.eth.Contract(abi, contractAddress)
  console.log(`Making a call to contract at address: ${contractAddress}`)

  console.log('incrementer.getNumber():', incrementer.methods)
  // 异步获取执行结果
  const data = await incrementer.methods.number().call()
  console.log(`The current number stored is: ${data}`)
}
