import Link from "next/link";

const NavBar = () => {
  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        marginBottom: "1rem",
      }}
    >
      <Link href="/" style={{ marginRight: "1rem" }}>
        home
      </Link>
      <Link href="/blogs">blogs</Link>
    </nav>
  );
};

export default NavBar;
