import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import api from "../../../services/api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Navigation from "../../../components/Navigation";

interface ICompany {
  id: number;
  name: string;
  document: string;
}
interface CompanyProps {
  company: ICompany;
}

type FormData = {
  name: string;
  document: string;
};

const Edit: React.FC<CompanyProps> = ({ company }: CompanyProps) => {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <p>Carregando...</p>;
  }
  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("success");

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues: {
      name: company.name,
      document: company.document,
    },
  });

  const onSubmit = handleSubmit(async ({ name, document }) => {
    setLoading(true);
    const data = { company: { name, document } };
    await api
      .put(`/api/v1/companies/${company.id}`, data)
      .then((response) => {
        setShow(true);
        setLoading(false);
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
          <Card.Title>Editar</Card.Title>
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
          <Card.Link href={`/companies/${company.id}/show`}>Detalhar</Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Edit;

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
    revalidate: 20,
  };
};
