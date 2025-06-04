import { useState } from "react";
import { Link, useNavigate } from "react-router";

import './Page.css'
import { createListing } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function updateTitle(e) {
    setTitle(e.target.value);
  }

  function updateDescription(e) {
    setDescription(e.target.value);
  }

  async function doCreateNewListing(e) {
    e.preventDefault();
    try {
      console.log("Creating", title, description);
      await createListing({ title, description })
      navigate("/");
    } catch (err) {
      alert("Create failed: " + err.message);
    }
  }

  return (
    <div className="page h-centered v-centered gapped">
      <h1>New Listing</h1>

      <form className="h-centered-column gapped" onSubmit={doCreateNewListing}>
          <input
            placeholder="Title"
            value={title}
            onChange={updateTitle}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={updateDescription}
          />

        <button type="submit">CREATE</button>
      </form>
      <Link to="/">Cancel</Link>
    </div>
  );
}
