import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Navigation from "../../../components/Navigation";
import api from "../../../services/api";

interface IReceivable {
  id: String;
  company_name: Number;
  key: String;
  net_value: String;
  expired_at: Date;
}
interface ReceivableProps {
  receivable: IReceivable;
}

const Show: React.FC<ReceivableProps> = ({ receivable }: ReceivableProps) => {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <p>Carregando...</p>;
  }
  return (
    <Container className="md-container">
      <Head>
        <title>Receivable</title>
      </Head>
      <Navigation />
      <Card>
        <Card.Body>
          <Card.Title>Detalhando título</Card.Title>
          <Row>
            <Col>ID</Col>
            <Col>{receivable.id}</Col>
          </Row>
          <Row>
            <Col>Empresa</Col>
            <Col>{receivable.company_name}</Col>
          </Row>
          <Row>
            <Col>Valor Líquido</Col>
            <Col>{receivable.net_value}</Col>
          </Row>
          <Row>
            <Col>Vencimento</Col>
            <Col>{receivable.expired_at}</Col>
          </Row>
          <Card.Link href="/receivables">Listar</Card.Link>
          <Card.Link href={`/receivables/${receivable.id}/edit`}>
            Editar
          </Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Show;

export const getStaticPaths: GetStaticPaths = async () => {
  const receivables = await api
    .get("/api/v1/receivables")
    .then((response) => response.data);

  const paths = receivables.map((receivable) => ({
    params: { id: receivable.id.toString() },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params;
  const receivable = await api
    .get(`/api/v1/receivables/${id}`)
    .then((response) => {
      const { data } = response;
      return data;
    });

  return {
    props: {
      receivable,
    },
    revalidate: 5,
  };
};
