// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

contract WWW {

uint256 private a;

function add(uint256 value) public {
a += value;
}

function remove(uint256 value) public {
a -= value;
}
}