import { useState } from "react";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Signup Data:", form);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-80 space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center">Signup</h2>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Create Account
        </button>
      </form>
    </div>
  );
}

export default Signup;
