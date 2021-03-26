import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import Navigation from "../../components/Navigation";

type FormData = {
  name: string;
  document: string;
};

const New: React.FC = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("success");
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm<FormData>();

  const onSubmit = handleSubmit(async ({ name, document }) => {
    setLoading(true);
    const data = { company: { name, document } };
    await api
      .post(`/api/v1/companies`, data)
      .then((response) => {
        setMessageClass("success");
        setMessage("Salvo com êxito");
        return response.data;
      })
      .catch((err) => {
        const { document } = err.response.data;
        setMessageClass("danger");
        setMessage(`CNPJ: ${document}`);
      })
      .finally(() => {
        setShow(true);
        setLoading(false);
      });
  });

  return (
    <Container className="md-container">
      <Head>
        <title>Company</title>
      </Head>
      <Navigation />
      {show && (
        <Alert
          variant={messageClass}
          onClose={() => setShow(false)}
          dismissible
        >
          {message}
        </Alert>
      )}
      <Card>
        <Card.Body>
          <Card.Title>Novo</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formName">
              <Form.Label>Razão Social</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome da Razão Social"
                name="name"
                ref={register({ required: true })}
              />
              {errors.name && (
                <Form.Text className="text-muted">
                  Razão Social é obrigatório
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>CNPJ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o CNPJ"
                name="document"
                ref={register({ required: true })}
              />
              {errors.document && (
                <Form.Text className="text-muted">CNPJ é obrigatório</Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Salvando…" : "Salvar"}
            </Button>
          </Form>
          <Card.Link href="/companies">Listar</Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default New;
