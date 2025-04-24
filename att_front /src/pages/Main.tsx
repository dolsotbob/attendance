import React, { useState } from 'react';
import Web3 from 'web3';
import { Web3Account } from 'web3';

const web3 = new Web3('http://127.0.0.1:7545');

const Main = () => {
    const [wallet, setWallet] = useState<Web3Account | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState("");

    const createWallet = () => {
        const newWallet = web3.eth.accounts.create();
        setWallet(newWallet);
        setBalance(null);
    };

    const getBalance = async () => {
        if (!wallet) return;
        const balanceWei = await web3.eth.getBalance(wallet.address);
        setBalance(web3.utils.fromWei(balanceWei, 'ether'));
    };

    const handleSubmit = () => {
        const accountInfo = privateKeyToAccount(inputValue);

        if (accountInfo) {
            const account = {
                address: accountInfo?.address,
                privatekey: inputValue,
            };

            sessionStorage.setItem('privateKey', account.privateKey);
            sessionStorage.setItem('address', account.address);

            window.dispatchEvent(new Event('storage'));
        } else {
            alert('Private Key를 입력하거나 새 지갑을 만드세요!');
        }
    };

    return (
        <div>
            <p>출석용 지갑</p>
            <button onClick={createWallet}>
                새 지갑 생성
            </button>
            <p>or</p>
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder='Private Key를 입력하세요.'
            ></textarea>
            <button onClick={handleSubmit}>

            </button>
        </div>
    )
};

export default Main