import Link from "next/link";
import styles from "@/styles/Navbar/authNavBar.css";

const Navbar = () => {
  return (
    <nav class="auth-navbar shadow-md ms-auto dark:d-custom-dark-grey-background">
      <ul>
        <li>
          <Link href="/">
            <p>Logo</p>
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
      <ul class="ms-auto">
        <li>
          <div class="dropdown">
            <button class="dropbtn">Profile</button>
            <ul class="dropdown-content">
              <li>Edit Profile</li>
              <li>Sign Out</li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
