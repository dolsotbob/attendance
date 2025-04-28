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

