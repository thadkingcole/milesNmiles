import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => (
  <footer className="bg-light p-3 text-center">
    <FontAwesomeIcon icon="road" size="10x" />
    <FontAwesomeIcon icon="car" size="5x" />
    <p>
      ©<a href="https://thadkingcole.github.io">Thaddeus Cole</a>
    </p>
  </footer>
);

export default Footer;
