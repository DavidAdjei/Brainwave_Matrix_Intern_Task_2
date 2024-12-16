import React from "react";
import { Atom } from "react-loading-indicators";
import "./features.css";

const Loader = ({text}) => {
  return (
    <div className="loader_container">
      <Atom color="#0adbea" size={50} text={text} textColor="#0adbea" />
    </div>
  );
};

export default Loader;