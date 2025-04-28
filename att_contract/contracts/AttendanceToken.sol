// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AttendanceToken is ERC20Permit, Ownable {
    uint private limitTime;
    uint private maxCallsPerDay; // 허용된 최대 출석 횟수

    struct UserCallData {
        uint lastCallDay;
        uint callCount; // 사용자가 오늘 출석 버튼을 몇 번 눌렀는지 기록하는 숫자
    }

    mapping(address => UserCallData) public userCallData;

    modifier dailyLimit(address _caller) {
        if (_caller != owner()) {
            UserCallData storage data = userCallData[_caller];
            uint today = (block.timestamp + 32400) / limitTime; // +32400: 우라니라 시간 기준으로 변경

            // 만약 오늘이 아닌 날 출석 기록이 남아 있으면, 새로 하루를 시작하면서 callCount를 0으로 초기화 한다
            if (data.lastCallDay != today) {
                data.lastCallDay = today;
                data.callCount = 0;
            }

            // 오늘 출석한 횟수(callCount)가 허용된 최대 횟수(maxCallsPerDay)보다 작아야만 출석할 수 있다
            // 출석에 성공하면 callCount를 1씩 증가시킨다
            require(
                data.callCount < maxCallsPerDay,
                "Limit reached. Please try again later."
            );
            data.callCount += 1;
        }
        _;
    }

    // 괄호 밖 호출 이유: 상속받은 부모들의 constructor에 인자 넘겨주는 부분;
    // 만약 안 하면 부모 constructor 인자 없다고 컴파일 에러 발생함
    constructor()
        ERC20("RocketBoostToken", "RBT")
        ERC20Permit("RocketBoostToken")
        Ownable(msg.sender)
    {
        _mint(msg.sender, 1000000 * 10 ** decimals());
        limitTime = 86400; // 1 day
        maxCallsPerDay = 1; // 1 call
    }

    function attendance(
        address student,
        uint256 amount
    ) public onlyOwner dailyLimit(student) {
        _transfer(msg.sender, student, amount); // _transfer: 인터널 transfer(ERC20 에 있음); 인자 3개
    }

    function setLimitTime(uint _limitTime) public onlyOwner {
        require(
            _limitTime >= 1 minutes,
            "Limit time must be at least 1 minute."
        );
        limitTime = _limitTime;
    }

    function setMaxCallsPerDay(uint _maxCallsPerDay) public onlyOwner {
        require(
            _maxCallsPerDay > 0,
            "Max calls per day must be greater than 0"
        );
        maxCallsPerDay = _maxCallsPerDay;
    }

    function resetCallCount(address user) public onlyOwner {
        require(user != address(0), "Invalid address");
        userCallData[user].callCount = 0;
    }

    function getMaxCallsPerDay() public view returns (uint) {
        return maxCallsPerDay;
    }

    function getLimitTime() public view returns (uint) {
        return limitTime;
    }
}

// 처음에 내가 만든 컨트랙트

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// contract Attendance is ERC20 {
//     // 이 스마트 계약의 소유자(관리자) 주소 저장; public -> 누구든지 owner() 함수를 통해 확인할 수 있다
//     address public owner;
//     // 지갑 주소별로 가장 최근에 출석한 시간 저장하는 변수; block.timestamp(현재 시간, 초 단위) 저장
//     // 사용자가 하루 한 번만 출석할 수 있도록 제한
//     mapping(address => uint256) public lastAttendance;
//     uint256 public rewardAmount = 10 * 10 ** 18; /// 10 ATT

//     constructor() ERC20("Attendance", "ATT") {
//         owner = msg.sender; // 스마트 계약을 배포할 때 배포한 사람의 지갑 주소가 msg.sender가 되니까, 결국 owner = msg.sender는 "이 계약을 배포한 사람을 owner로 설정해라"는 뜻
//     }

//     // 출석 함수: 하루 한 번만 가능
//     function attend() public {
//         require(
//             block.timestamp - lastAttendance[msg.sender] >= 1 days,
//             "You can only attend once per day"
//         );

//         _mint(msg.sender, rewardAmount);
//         lastAttendance[msg.sender] = block.timestamp; // block.timestamp는 함수를 실행하는 시점의 현재시간을 나타내는 전역 변수
//     }

//     // (선택) 출석 보상량 조절
//     function setRewardAmount(uint256 _amount) public {
//         require(msg.sender == owner, "Only owner can set reward");
//         rewardAmount = _amount;
//     }
// }
