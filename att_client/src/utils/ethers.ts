import { ethers } from 'ethers';
import attendanceTokenJson from '../abis/AttendanceToken.json';
import QuestionList from '../abis/QuestionList.json';

const { abi: tokenAbi, address: tokenAddress } = attendanceTokenJson;
const { abi: questionListAbi, address: questionListAddress } = QuestionList;

const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');

// new ethers.Wallet(privateKey [ ,provider])
// => Create a new Wallet instance for privateKey and optionally connected to the provider
export const relayer = new ethers.Wallet(
    process.env.REACT_APP_RELAYER_PRIVATE_KEY || '',
    provider
);

// new ethers.Contract(address, abi, providerOrSigner)
// => Connecting to a Contract 
// => Creating a new instance of a Contract connects to an existing contract by specifying its address on the blockchain, its abi (used to populate the class' methods) a providerOrSigner.
const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, relayer);
const questionList = new ethers.Contract(
    questionListAddress,
    questionListAbi,
    relayer
);

// ethers.Wallet.createRandom()
// => returns a new Wallet with a random private key 
export const createWallet = async () => {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
};

// new ethers.Wallet(privateKey [ , provider])
// => Create a new Wallet instance for privateKey and optionally connected to the provider
export const importWallet = (privateKey: string) => {
    const wallet = new ethers.Wallet(privateKey);
    return wallet;
}

const symbol = async () => {
    const symbol = await tokenContract.symbol();
    return symbol;
};

export const getTokenBalance = async (address: string, permit: boolean) => {
    const weiBalance = await tokenContract.balanceOf(address);
    const balance = ethers.formatEther(weiBalance);

    if (permit) {
        return weiBalance;
    } else {
        return `${Number(balance)} ${await symbol()}`;
    }
};

// 특정 address에 대해 tokenContract 안의 userCallData를 조회하고, 
// 조회된 데이터의 두 번째 값을 확인해 0이면 true, 아니면 false 반환 
export const dailyLimit = async (address: string) => {
    const userCallData = await tokenContract.userCallData(address);
    return Number(userCallData[1]) === 0 ? true : false;
}

// 이 함수는 사용자가 “출석”을 하면서, 출석에 필요한 값(10 ETH 또는 10 단위 토큰)을 스마트 계약에 보내고, 트랜잭션이 성공했는지 여부를 반환하는 함수입니다
// 특정 address를 받아서 tokenContract의 attendance 함수를 호출하면서 10 ETH 만큼의 값을 함께 전달하고, 
// 트잭이 성공적으로 완료되었는지 확인 후 성공하면 true, 실패하면 false 반환 
export const attendance = async (address: string) => {
    const attendance = await tokenContract.attendance(
        address,
        ethers.parseEther('10') // 수자 10을 이더 단위(wei)로 변환한 값/ 10,000,000,000,000,000,000 wei
    );
    const receipt = await attendance.wait();
    if (receipt.status === 1) {
        return true;
    } else {
        return false;
    }
};

// 사용자의 개인키로 "permit 서명"을 생성하고, 이 서명을 통해 토큰 사용 허가(approve)를 블록체인에 올리는 함수 
// (사용자가 직접 approve 트잭을 보내지 않고, 서명으로 허가만 하고, 스마트 컨트랙트가 이 서명을 이용해 대신 처리하는 방식)
export const permit = async (privateKey: string) => {
    const owner = importWallet(privateKey);
    const ownerBalance = await getTokenBalance(owner.address, true);

    const deadline = Math.floor(Date.now() / 1000) + 3600; // 서명 만료 시간(현재 시간 + 1시간)
    const nonce = await tokenContract.nonces(owner.address); // 현재 지갑의 permit 트잭 번호(중복 서명 방지용)
    const name = await tokenContract.name();  // ERC20 토큰의 이름(Permit 구조에 필요) 


    // EIP-712 표준에 따라 서명할 때 도메인을 정의한다 
    // 도메인은 "이 서명이 어느 체인, 어느 컨트랙트를 위한 것인지" 명시한다 
    const domain = {
        name: name,
        version: '1',
        chainId: (await provider.getNetwork()).chainId,
        verifyingContract: tokenAddress,
    }

    // 	EIP-2612 Permit 구조 정의 
    const types = {
        Permit: [  // name은 필드명, type는 데이터 타입 
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'nonce', type: 'uint256' },
            { name: 'deadline', type: 'uint256' },
        ],
    };

    // 서명할 데이터 
    const message = {
        owner: owner.address,
        spender: questionListAddress,
        value: ownerBalance,
        nonce: nonce,
        deadline: deadline,
    };

    // 타입 데이터 서명
    // 이 메타데이터(domain + types + message)를 EIP-712 형식으로 서명한다 
    const signature = await owner.signTypedData(domain, types, message);

    // 이 서명을 이더리움 트랜젝션에 필요한 v, r, s 형태로 분배한다 
    const { v, r, s } = ethers.Signature.from(signature);

    // permit 트랜젝션 보내기 
    // 위에서 만든 v, r, s 서명을 이용해 스마트 컨트랙트의 permit 함수를 호출한다 
    // (approve처럼 지갑에서 직접 보내지 않고, 서명만 전달)
    const permit = await tokenContract.permit(
        message.owner,
        message.spender,
        message.value,
        message.deadline,
        v,
        r,
        s
    );
    const receipt = await permit.wait();

    // 트랜잭션이 성공이면 true, 실패하면 false 반환 
    if (receipt.status === 1) {
        return true;
    } else {
        return false;
    }
};

export const getStudents = async () => {
    const allStudents = await questionList.getAllStudents();
    return allStudents;
}

// questionList 스마트 컨트랙트의 question(address, _question) 함수 호출 
// 사용자가 질문을 작성하는 기능 
export const question = async (address: string, _question: string) => {
    const question = await questionList.question(address, _question);
    const receipt = await question.wait(); // 호출 후 트잭이 블록에 확정 될때까지 기다린다 
    if (receipt.status === 1) {
        return true;
    } else {
        return false;
    }
};

// 모든 학생들이 작성한 질문들을 모아서 주소별로 정리해서 반환하는 함수 
// 각 학생마다 questionList.getQuestions(student)를 호출해, 그 학생이 쓴 질문들을 가져온다
// Record<string, string[]> 타입의 객체에 학생 주소별로 질문들을 저장하고 결과를 반환한다 
export const getQuestions = async () => {
    const result: Record<string, string[]> = {};
    const students = await getStudents();

    try {
        for (const student of students) {
            const questions: string[] = await questionList.getQuestions(student);
            result[student] = questions;
        }

        return result;
    } catch (error) {
        console.log(error);
        return {};
    }
};


/// 아래부터 수정 

// export const attendanceContract = new web3.eth.Contract(
//     combined.Attendance.abi,
//     combined.Attendance.address
// );

// export const questionlistContract = new web3.eth.Contract(
//     combined.Questionlist.abi,
//     combined.Questionlist.address
// );

// export const privateKeyToAccount = (privateKey: string) => {
//     try {
//         const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
//         return account;
//     } catch (error) {
//         return null;
//     }
// }

