import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";

export const ProfileComponent = () => {
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [trips, setTrips] = useState([]);

  const { getAccessTokenSilently } = useAuth0();

  /* 
  Note: the empty deps array [] means this useEffect will run once similar to 
  componentDidMount()
  */
  useEffect(() => {
    const { apiOrigin = "http://localhost:3001" } = getConfig();
    async function fetchData() {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${apiOrigin}/api/cars/trips`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responseData = await response.json();
        setCars(responseData.cars);
        setTrips(responseData.trips);
      } catch (err) {
        setError({ err });
        console.log(err);
      }
    }
    fetchData();
  }, [getAccessTokenSilently]);
  const { user } = useAuth0();

  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={2}>
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
        {/* car columns */}
        {cars ? (
          cars.map((car) => {
            return (
              <Col className="text-capitalize" key={car.id}>
                {car.year} {car.color} {car.make} {car.model}
              </Col>
            );
          })
        ) : (
          <>there are no cars</>
        )}
        {/* car info below each car */}
        {/* trip graph below the car info */}
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
