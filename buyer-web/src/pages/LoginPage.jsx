import { useState } from "react";
import { useNavigate } from "react-router";
import { useLogin } from "../LoginContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function updateUsername(e) {
    setUsername(e.target.value);
  }

  function updatePassword(e) {
    setPassword(e.target.value);
  }

  async function doLogin(e) {
    e.preventDefault();
    try {
      console.log("Logging in with", username);
      await login(username, password);
      navigate("/buyers");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  }

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={doLogin}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={updateUsername}
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={updatePassword}
            autoComplete="current-password"
          />
        </div>

        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
