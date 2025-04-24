import React, { useState } from 'react'

const Wallet = () => {



    return (
        <div>
            <h2>출석용 지갑</h2>
            <p><strong>주소:</strong>{wallet.address}</p>
            <p><strong>잔액:</strong>{wallet.balance}</p>
            <button>로그아웃</button>
        </div>
    )
}

export default Wallet