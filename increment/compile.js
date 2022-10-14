// https://docs.moonbeam.network/cn/builders/build/eth-api/libraries/web3js/
// 1. 导入依赖包
const fs = require('fs')
const solc = require('solc')

// 2. 获取合约源码
const source = fs.readFileSync('Incrementer.sol', 'utf8')

// 3. 创建输入文件
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
// 4. 编译合约生成对象
const tempFile = JSON.parse(solc.compile(JSON.stringify(input)))
const contractFile = tempFile.contracts['Incrementer.sol']['Incrementer']

console.log('contractFile tempFile:', contractFile)

// 5. 导出合约文件
module.exports = contractFile
