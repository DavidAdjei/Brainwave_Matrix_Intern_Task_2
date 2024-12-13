import React, { useState } from "react";
import "./SignUp.css";
import { InputField } from "../features/InputField";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthError } from "../Redux/auth/actions";
import { login } from "../Redux/auth/thunks";


const Login = () => {
  const [formData, setFormData] = useState({
    identity: "",
    password: "",
  });
  const dispatch = useDispatch();
  const {error} = useSelector(state => state.auth);

  const handleInputChange = (e) => {
    dispatch(setAuthError(null));
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clearFields = () => {
    setFormData({
        identity: "",
        password: "",
      })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.password || !formData.identity){
        dispatch(setAuthError("All fields are required"));
    }else{
        console.log(formData);
        dispatch(login(formData));
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>Create your account</h1>
        {error && (<p className="auth-error">{error}</p>)}
        <InputField
            name="identity"
            label="Email or Username"
            type="email"
            required={true}
            placeholder="Enter your email or username"
            value={formData.identity}
            onChange={handleInputChange}
        />
        <InputField
            name="password"
            label="Password"
            type="password"
            required={true}
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
        />
        <button type="submit" className="submit-button">
          Login
        </button>
        <p className="member">Not a member? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;
