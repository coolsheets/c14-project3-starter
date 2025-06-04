import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../LoginContext";

import './Page.css'

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
      navigate("/");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  }

  return (
    <div className="page h-centered v-centered gapped">
      <h1>Login</h1>

      <form className="h-centered-column gapped" onSubmit={doLogin}>
        <div>
          <input
            id="username"
            placeholder="User Name"
            value={username}
            onChange={updateUsername}
            autoComplete="username"
          />
        </div>

        <div>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={updatePassword}
            autoComplete="current-password"
          />
        </div>

        <button type="submit">LOG IN</button>
      </form>
      <Link to="/">Back</Link>
    </div>
  );
}
