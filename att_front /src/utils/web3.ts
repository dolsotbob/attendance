import Web3 from 'web3';
import combined from '../abis/combinedAbis.json';
import axios from 'axios';

const web3 = new Web3('http://127.0.0.1:7545');

export const contract = new web3.eth.Contract(
    Attendance.abi, Attendance.address
);

export const privateKeyToAccount = (privateKey: string) => {
    try {
        const account = web3.eth.accounts.privateKeyToAccount(`0x${privateKey}`);
        return account;
    } catch (error) {
        return null;
    }
}

