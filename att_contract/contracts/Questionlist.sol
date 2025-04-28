// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// IERC20 인터페이스를 가져온다
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// QuestionList.sol는 실제 토큰을 만들지 않기 때문에 ERC20 상속필 필요는 없다
// 대신 IERC20 인터페이스를 이용해 외부 ATT 토큰과 상호작용해야 한다
contract QuestionList is Ownable {
    address public attendanceToken; // 질문할 때 사용할 토큰의 주소
    uint256 public constant QUESTION_FEE = 1 ether; // 질문당 고정 요금;  여기서 ehter는 단위를 나타냄

    address[] public allStudents; // 질문한 학생의 주소 리스트
    mapping(address => string[]) public questions; // 학생 별로 질문을 저장하는 매핑

    // 질문:
    // (1) 배포할 때 왜 attendanceToken 주소를 지정해야 하지? >
    // => (1) 답: QuestionList는 ERC20 토큰을 만들지 않고 외부에서 이미 존쟇는 토큰(여기선 AttendnaceToken)을 사용하기 때문에 어떤 토큰과 연결될지 알려줘야 하기 때문
    // (2) 배포하는 사람이 owner로 하는 이유는 Gasless 로 만들기 위함인가?/
    // (2) 부모 생성자는 설정 안함?? 부모 생성자 확인
    constructor(address _attendanceToken) Ownable(msg.sender) {
        attendanceToken = _attendanceToken;
    }

    event Question(address student, string _question);
    event WithDraw(uint256 amount);

    function question(
        address student,
        string memory _question
    ) public onlyOwner {
        require(student != address(0), "Zero address not allowed");
        require(bytes(_question).length > 0, "No questions available.");

        // 질문:
        // (1) 어떻게 아래 과정이 이루어지는지??
        // attendanceToken 주소를 가지고 IERC20 인터페이스를 통해 token 이라는 객체를 만든다
        // 이걸로 이제 token.transferFrom 같은 표준 ERC20 기능을 쓸 수 있음
        IERC20 token = IERC20(attendanceToken);
        // 질문: transferFrom을 쓰려면 student가 미리 approve()를 호출해 이 컨트랙트한테 토큰을 쓸 수 있도록 해야 한다. 그런데 왜 이 컨트랙트에는 없나?
        // 답: student가 미리 따라 approve를 해놔야 한다. 즉 AttendanceToken 컨트랙트에 대해 approve(QuestionList.address, 1 ether) 같은 걸 미리 호출해야 한다
        bool success = token.transferFrom(student, address(this), QUESTION_FEE);
        require(success, "Token transfer failed");

        if (questions[student].length == 0) {
            allStudents.push(student);
        }

        questions[student].push(_question);
        emit Question(student, _question);
    }

    function getQuestions(
        address student
    ) public view returns (string[] memory) {
        return questions[student];
    }

    function getAllStudents() public view returns (address[] memory) {
        return allStudents;
    }

    function withdrawTokens() public onlyOwner {
        // attendanceToken 주소를 가지고 IERC20 인터페이스를 통해 token 이라는 객체를 만든다
        // attendanceToken 주소에 있는 토큰을 IERC20 처럼 다루겠다는 뜻
        IERC20 token = IERC20(attendanceToken);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "Insufficient balance.");

        bool success = token.transfer(owner(), balance);
        require(success, "Token transfer failed");

        emit WithDraw(balance);
    }
}

// 처음 내가 만든 컨트랙트

// // IERC20 인터페이스를 가져온다
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// // Questionlist.sol는 실제 토큰을 만들지 않기 때문에 ERC20 상속필 필요는 없다
// // 대신 IERC20 인터페이스를 이용해 외부 ATT 토큰과 상호작용해야 한다
// contract Questionlist {
//     IERC20 public attToken; // 외부 ATT 토큰 주소를 받음; attToken은 Attendance에서 발행한 ATT 토큰을 제어하기 위한 핸들
//     address public owner; // 이 컨트트를 배포한 계정 주소 저장

//     constructor(address _attTokenAddress) {
//         attToken = IERC20(_attTokenAddress); // 배포된 ATT 토큰 컨트랙트 주소를 받음
//         owner = msg.sender; // 배포한 사람은 오너로 설정
//     }

//     // 질문 정보를 담기 위한 구조체
//     struct Question {
//         address asker;
//         string content;
//         uint256 timestamp;
//     }

//     // questions 배열은 질문을 모두 저장하고 있고,
//     // public 이므로 자동 getter가 생성되어 프론트앤드에서 인덱스로 접근 가능
//     Question[] public questions;

//     // askQuestion()호출 시 발생하하는 이벤트
//     // 프론트앤드에서 누가 어떤 질문을 언제 했는지 추적 가능
//     event QuestionAsked(
//         address indexed asker,
//         string content,
//         uint256 timestamp
//     );

//     function askQuestion(string calldata _content) public {
//         uint256 cost = 1 * 10 ** 18; // 1 ATT
//         require(
//             attToken.transferFrom(msg.sender, address(this), cost),
//             "ATT payment failed"
//         );

//         // 질문 내용, 작성자 주소, 시간 정보를 구조체에 저장 >> questions 배열에 저장
//         questions.push(
//             Question({
//                 asker: msg.sender,
//                 content: _content,
//                 timestamp: block.timestamp
//             })
//         );

//         // QuestionAsked 이벤트 발생 -> 프론트엔드에서 쉽게 추적 가능
//         emit QuestionAsked(msg.sender, _content, block.timestamp);
//     }

//     // (선택) 컨트랙트에 쌓인 ATT를 오너가 회수 가능
//     function withdrawTokens(address to, uint256 amount) public {
//         require(msg.sender == owner, "Only owner can withdraw"); // owner만 호출 가능
//         require(attToken.transfer(to, amount), "Transfer failed"); // 컨트랙트에 쌓인 ATT를 지정한 주소로 보냄
//     }

//     // 질문 개수 반환
//     function getQuestionCount() public view returns (uint256) {
//         return questions.length;
//     }

//     // 특정 질문 보기
//     function getQuestion(
//         uint256 index
//     ) public view returns (address, string memory, uint256) {
//         require(index < questions.length, "Invalid index");
//         Question storage q = questions[index];
//         return (q.asker, q.content, q.timestamp);
//     }
// }
