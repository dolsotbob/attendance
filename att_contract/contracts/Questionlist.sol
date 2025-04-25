// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// IERC20 인터페이스를 가져온다
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Questionlist.sol는 실제 토큰을 만들지 않기 때문에 ERC20 상속필 필요는 없다
// 대신 IERC20 인터페이스를 이용해 외부 ATT 토큰과 상호작용해야 한다
contract Questionlist {
    IERC20 public attToken; // 외부 ATT 토큰 주소를 받음; attToken은 Attendance에서 발행한 ATT 토큰을 제어하기 위한 핸들
    address public owner; // 이 컨트트를 배포한 계정 주소 저장

    constructor(address _attTokenAddress) {
        attToken = IERC20(_attTokenAddress); // 배포된 ATT 토큰 컨트랙트 주소를 받음
        owner = msg.sender; // 배포한 사람은 오너로 설정
    }

    // 질문 정보를 담기 위한 구조체
    struct Question {
        address asker;
        string content;
        uint256 timestamp;
    }

    // questions 배열은 질문을 모두 저장하고 있고,
    // public 이므로 자동 getter가 생성되어 프론트앤드에서 인덱스로 접근 가능
    Question[] public questions;

    // askQuestion()호출 시 발생하하는 이벤트
    // 프론트앤드에서 누가 어떤 질문을 언제 했는지 추적 가능
    event QuestionAsked(
        address indexed asker,
        string content,
        uint256 timestamp
    );

    function askQuestion(string calldata _content) public {
        uint256 cost = 1 * 10 ** 18; // 1 ATT
        require(
            attToken.transferFrom(msg.sender, address(this), cost),
            "ATT payment failed"
        );

        // 질문 내용, 작성자 주소, 시간 정보를 구조체에 저장 >> questions 배열에 저장
        questions.push(
            Question({
                asker: msg.sender,
                content: _content,
                timestamp: block.timestamp
            })
        );

        // QuestionAsked 이벤트 발생 -> 프론트엔드에서 쉽게 추적 가능
        emit QuestionAsked(msg.sender, _content, block.timestamp);
    }

    // (선택) 컨트랙트에 쌓인 ATT를 오너가 회수 가능
    function withdrawTokens(address to, uint256 amount) public {
        require(msg.sender == owner, "Only owner can withdraw"); // owner만 호출 가능
        require(attToken.transfer(to, amount), "Transfer failed"); // 컨트랙트에 쌓인 ATT를 지정한 주소로 보냄
    }

    // 질문 개수 반환
    function getQuestionCount() public view returns (uint256) {
        return questions.length;
    }

    // 특정 질문 보기
    function getQuestion(
        uint256 index
    ) public view returns (address, string memory, uint256) {
        require(index < questions.length, "Invalid index");
        Question storage q = questions[index];
        return (q.asker, q.content, q.timestamp);
    }
}
