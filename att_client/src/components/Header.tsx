import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
    const [isAccount, setIsAccount] = useState(
        sessionStorage.getItem('address') || ''
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAccount(sessionStorage.getItem('address') || '');
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    });

    return (
        <header>
            <nav>
                {isAccount ? (
                    <>
                        <Link to="/">홈</Link>
                        <Link to="/wallet">Wallet</Link>
                        <Link to="/question">Question</Link>
                    </>
                ) : (
                    <Link to="/">홈</Link>
                )}
            </nav>
        </header>
    );
}

export default Header; 