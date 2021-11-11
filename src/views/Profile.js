import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import Loading from "../components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TripForm from "../components/TripForm";
import CarForm from "../components/CarForm";

export const ProfileComponent = () => {
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [trips, setTrips] = useState([]);
  const [forms, setForms] = useState({
    trip: false,
    car: false,
  });

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

  const showTripForm = () => setForms({ trip: true, car: false });
  const showCarForm = () => setForms({ trip: false, car: true });
  const removeForms = () => setForms({ trip: false, car: false });

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
          <h2>{user.name}'s Garage</h2>
          <p className="lead text-muted">Welcome!</p>
        </Col>
        <Col md="auto">
          <Button color="success" onClick={showTripForm}>
            <FontAwesomeIcon icon="gas-pump" /> Log Trip
          </Button>
        </Col>
        <Col md="auto">
          <Button color="warning" onClick={showCarForm}>
            <FontAwesomeIcon icon="car" /> New Car
          </Button>
        </Col>
      </Row>
      {/* either show the trip form or car form if user has clicked */}
      {(forms.trip && (
        <Row>
          <TripForm />
          <Button close onClick={removeForms} />
        </Row>
      )) ||
        (forms.car && (
          <Row>
            <CarForm />
            <Button close onClick={removeForms} />
          </Row>
        ))}
      <Row>
        {/* car columns */}
        {cars ? (
          cars.map((car) => {
            return (
              <Col className="text-capitalize" key={car.id}>
                <Row>
                  {car.year} {car.color} {car.make} {car.model}
                </Row>
                {trips
                  .filter((trip) => trip.CarId === car.id)
                  .map((trip) => (
                    <Row key={trip.id}>
                      {trip.fillDay} {trip.odoMiles} {trip.gallons}{" "}
                      {trip.comments}
                    </Row>
                  ))}
              </Col>
            );
          })
        ) : (
          <> no cars</>
        )}
      </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
