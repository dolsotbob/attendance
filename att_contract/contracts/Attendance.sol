// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Attendance is ERC20 {
    // 이 스마트 계약의 소유자(관리자) 주소 저장; public -> 누구든지 owner() 함수를 통해 확인할 수 있다
    address public owner;
    // 지갑 주소별로 가장 최근에 출석한 시간 저장하는 변수; block.timestamp(현재 시간, 초 단위) 저장
    // 사용자가 하루 한 번만 출석할 수 있도록 제한
    mapping(address => uint256) public lastAttendance;
    uint256 public rewardAmount = 10 * 10 ** 18; /// 10 ATT

    constructor() ERC20("Attendance", "ATT") {
        owner = msg.sender; // 스마트 계약을 배포할 때 배포한 사람의 지갑 주소가 msg.sender가 되니까, 결국 owner = msg.sender는 "이 계약을 배포한 사람을 owner로 설정해라"는 뜻
    }

    // 출석 함수: 하루 한 번만 가능
    function attend() public {
        require(
            block.timestamp - lastAttendance[msg.sender] >= 1 days,
            "You can only attend once per day"
        );

        _mint(msg.sender, rewardAmount);
        lastAttendance[msg.sender] = block.timestamp; // block.timestamp는 함수를 실행하는 시점의 현재시간을 나타내는 전역 변수
    }

    // (선택) 출석 보상량 조절
    function setRewardAmount(uint256 _amount) public {
        require(msg.sender == owner, "Only owner can set reward");
        rewardAmount = _amount;
    }
}
