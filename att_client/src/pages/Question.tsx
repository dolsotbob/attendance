import React from 'react'

const Question = () => {
    return (
        <div>
            <h2>무엇이든 물어보세요.</h2>
            <div>
                <p><strong>주소:</strong>{wallet.address}</p>
                <p><strong>잔액:</strong>{wallet.balance}</p>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='질문을 입력하세요.'
                ></textarea>
                <button>질문 등록</button>
            </div>
            <div>
                <p>질문 리스트</p>

            </div>
        </div>
    )
}

export default Question