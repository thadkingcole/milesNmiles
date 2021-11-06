import React from "react";
import { Button } from "reactstrap";
import { useAuth0 } from "@auth0/auth0-react";

const Hero = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  return (
    <div className="text-center hero my-5">
      <h1 className="mb-4">Miles N Miles</h1>

      <p className="lead">Track you cars miles with Miles N Miles.</p>
      {isAuthenticated ? (
        // user IS logged in
        <p>Logged in!</p>
      ) : (
        // user NOT logged in
        <p>
          <Button color="primary" onClick={() => loginWithRedirect()}>
            Log in
          </Button>{" "}
          to try it out!
        </p>
      )}
    </div>
  );
};

export default Hero;
