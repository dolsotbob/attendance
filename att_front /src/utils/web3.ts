import Web3 from 'web3';
import combined from './combinedAbis.json';
import axios from 'axios';

const web3 = new Web3('http://127.0.0.1:7545');

export const attendanceContract = new web3.eth.Contract(
    combined.Attendance.abi,
    combined.Attendance.address
);

export const questionlistContract = new web3.eth.Contract(
    combined.Questionlist.abi,
    combined.Questionlist.address
);

export const privateKeyToAccount = (privateKey: string) => {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
        return account;
    } catch (error) {
        return null;
    }
}

