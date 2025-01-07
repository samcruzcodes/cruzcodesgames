import { useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const location = useLocation();

  const menuItems = [
    { name: "GAMES", href: "/" },
    { name: "DEVLOGS", href: "/devlogs" },
    { name: "PROFILE", href: "/profile" },
  ];

  return (
    <header style={styles.header}>
      <nav style={styles.navbar}>
        <div style={styles.logoContainer}>
          <a href="/">
            <img style={styles.logo} src={logo} alt="Logo" />
          </a>
        </div>

        <ul style={styles.links}>
          {menuItems.map((item) => (
            <li key={item.name} style={styles.linkItem}>
              <a
                style={{
                  ...styles.link,
                  color: location.pathname === item.href ? "var(--highlight-color)" : styles.link.color,
                }}
                href={item.href}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

const styles = {
  header: {
    top: 0,
    left:0,
    right:0,
    padding: "0 4rem",
    backgroundColor: "var(--background-primary-mix)",
    borderBottom: "2px solid var(--subtle-accent)",
    zIndex: 100,
    fontFamily: "'SpaceMono', sans-serif",
  },
  navbar: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "60px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    objectFit: "cover" as const,
    height: "2.5rem",
    width: "2.5rem",
  },
  links: {
    display: "flex",
    gap: "2rem",
  },
  linkItem: {
    listStyle: "none",
  },
  link: {
    textDecoration: "none",
    fontSize: "1rem",
    color: "var(--text-color)",
    transition: "color 0.2s ease",
  },
};

