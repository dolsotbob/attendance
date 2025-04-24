// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Questionlist is ERC20 {
    address public spender;
    address public owner;
    uint256 public amount;
    uint256 public gasUsed;

    function approve(address _spender, uint256 _amount) public returns (bool) {
        return approve(address(this), _amount); // spender = contractQuestionlist주소
    }

    // 질문 저장
    function transferFrom(address _owner, address _spender, uint256 _amount) {
        transferFrom(_owner, _spender, _amount);
    }

    function trackGasUsage() public {
        uint256 initialGas = gasleft();
        uint256 result = 0;

        for (uint i = 0; i < 10; i++) {
            result += i;
        }

        uint256 finalGas = gasleft();
        gasUsed = initialGas - finalGas;
    }

    function generateHash(
        string calldata message
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(message));
    }
}
