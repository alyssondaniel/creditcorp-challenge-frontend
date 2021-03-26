import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const Navigation: React.FC = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">CreditCorp</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/companies">Empresas</Nav.Link>
          <Nav.Link href="/receivables">Títulos</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
