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
        <Container>
          <Row className="justify-content-md-between">
            <Card className="sml-card">
              <Card.Body>
                <Card.Title>CreditCorp Challenge</Card.Title>
                <Card.Text>Seja bem vindo.</Card.Text>
                <p>Esolha um dos botões para começar</p>
                <Button variant="primary" href="/companies">
                  Empresas &rarr;
                </Button>{" "}
                or{" "}
                <Button variant="secondary" href="/receivables">
                  Título recebíveis &rarr;
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
