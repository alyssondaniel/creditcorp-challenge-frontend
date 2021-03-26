import React from "react";
import Head from "next/head";
import { Container, Row, Card, Button } from "react-bootstrap";

const Home: React.FC<JSX.Element> = () => {
  return (
    <Container className="md-container">
      <Head>
        <title>ReactJS with react-bootstrap</title>
      </Head>
      <Container>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p>
          Get started by editing <code>pages/index.js</code>
        </p>
        <Container>
          <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>Documentation</Card.Title>
                <Card.Text>
                  Find in-depth information about Next.js features and API.
                </Card.Text>
                <Button variant="primary" href="https://nextjs.org/docs">
                  More &rarr;
                </Button>
              </Card.Body>
            </Card>
          </Row>
        </Container>
      </Container>

      <footer className="cntr-footer">CreditCorp</footer>
    </Container>
  );
};

export default Home;
