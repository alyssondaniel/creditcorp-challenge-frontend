import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Navigation from "../../../components/Navigation";
import api from "../../../services/api";

interface ICompany {
  id: number;
  name: string;
  document: string;
}
interface CompanyProps {
  company: ICompany;
}

const Show: React.FC<CompanyProps> = ({ company }: CompanyProps) => {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <p>Carregando...</p>;
  }
  return (
    <Container className="md-container">
      <Head>
        <title>Company</title>
      </Head>
      <Navigation />
      <Card>
        <Card.Body>
          <Card.Title>Detalhando</Card.Title>
          <Row>
            <Col>ID</Col>
            <Col>{company.id}</Col>
          </Row>
          <Row>
            <Col>Razão Social</Col>
            <Col>{company.name}</Col>
          </Row>
          <Row>
            <Col>CNPJ</Col>
            <Col>{company.document}</Col>
          </Row>
          <Card.Link href="/companies">Listar</Card.Link>
          <Card.Link href={`/companies/${company.id}/edit`}>Editar</Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Show;

export const getStaticPaths: GetStaticPaths = async () => {
  const companies = await api
    .get("/api/v1/companies")
    .then((response) => response.data);

  const paths = companies.map((company) => ({
    params: { id: company.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;
  const company = await api.get(`/api/v1/companies/${id}`).then((response) => {
    const { data } = response;
    return data;
  });

  return {
    props: {
      company,
    },
    revalidate: 5,
  };
};
