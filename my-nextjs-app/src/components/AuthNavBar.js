// components/Navbar.js

import Link from 'next/link';
import styles from './navbar.css';



const Navbar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <Link href="/">
                        <p>Home</p>
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard">
                        <p>Dashboard</p>
                    </Link>
                </li>
                <li>
                    <Link href="/grants">
                        <p>Grants</p>
                    </Link>
                </li>
                <li>
                    <Link href="/application">
                        <p>Application</p>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
