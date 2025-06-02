import { Link, useNavigate } from "react-router";
import { useLogin } from "../LoginContext";

export default function Header() {
  const { user, logout, loading } = useLogin();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/">Home</Link>

        {!loading && (
          user ? (
            <div>
              <span style={{ marginRight: "1rem" }}>Welcome, {user.username}!</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )
        )}
      </nav>
    </header>
  );
}
