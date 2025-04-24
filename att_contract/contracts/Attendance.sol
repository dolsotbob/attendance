// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Attendance is ERC20 {
    uint256 public amount;
    address payable recipient;
    address owner;

    constructor() ERC20("Attendance", "ATT") {}

    function mint(address _recipient, uint256 _amount) public {
        _mint(_recipient, _amount);
    }

    function burn(address _owner, uint256 _amount) public {
        _burn(_owner, _amount);
    }
    // transfer (to 사용자, amount) 써야하나??
}
