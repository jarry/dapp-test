// 引入依赖包
const Web3 = require('web3')
const { abi } = require('./compile')

// 1、创建一个web3的实例
const web3 = new Web3('http://127.0.0.1:8545')

// 2、部署合约后获得地址，复制过来
const contractAddress = '0x1db62437A431e643Af8efca9D73d1645e982f318'
// 连接到合约地址
const incrementer = new web3.eth.Contract(abi, contractAddress)

// 合约执行代码
const get = async () => {
  console.log(`Making a call to contract at address: ${contractAddress}`)

  // 打印全部方法
  console.log('incrementer.methods: ', incrementer.methods)

  // 调用number
  const data = await incrementer.methods.number().call()
  console.log(`incrementer.methods.number(): ${data}`)

  // 调用getNumber函数
  const result = await incrementer.methods.getNumber().call()
  console.log(`incrementer.methods.getNumber(): ${result}`)
}
// 3、代码执行
get()
