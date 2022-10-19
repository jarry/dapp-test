// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Incrementer {
    uint256 public number;

    constructor(uint256 initialNumber) {
        number = initialNumber;
    }

    function multiple(uint256 value) public {
        number = number * value;
    }

    function increment(uint256 value) public {
        number = number + value;
    }

    function reset() public {
        number = 0;
    }

    function setNumber(uint256 num) public {
        number = num;
    }

    function getNumber() public view returns (uint256) {
        return number;
    }
}