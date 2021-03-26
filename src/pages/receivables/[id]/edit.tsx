import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { Alert, Button, Card, Container, Form } from "react-bootstrap";
import api from "../../../services/api";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Navigation from "../../../components/Navigation";
import { IMaskInput } from "react-imask";
import moment from "moment";

type FormData = {
  company_id: String;
  key: String;
  net_value: String;
  expired_at: Date;
};

interface ICompany {
  id: number;
  name: string;
  document: string;
}

interface CompaniesProps {
  companies: ICompany[];
  receivable: FormData;
}

const New: React.FC<CompaniesProps> = ({ companies, receivable }) => {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <p>Carregando...</p>;
  }
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [messageClass, setMessageClass] = useState("success");
  const [isLoading, setLoading] = useState(false);

  const { register, handleSubmit, errors } = useForm<FormData>({
    defaultValues: {
      company_id: receivable.company_id,
      key: receivable.key,
      net_value: receivable.net_value.replace(".", ","),
      expired_at: receivable.expired_at,
    },
  });

  const onSubmit = handleSubmit(
    async ({ company_id, key, net_value, expired_at }) => {
      moment.locale("pt-br");
      setLoading(true);
      const data = {
        receivable: {
          company_id,
          key,
          net_value: net_value.replace(",", "."),
          expired_at: moment(expired_at, "DD.MM.YYYY").format("YYYY-MM-DD"),
        },
      };

      await api
        .put(`/api/v1/receivables/${receivable.id}`, data)
        .then((response) => {
          setMessageClass("success");
          setMessage("Salvo com êxito");
          return response.data;
        })
        .catch((err) => {
          const { key } = err.response.data;
          setMessageClass("danger");
          if (key) setMessage(`Chave: ${key}`);
        })
        .finally(() => {
          setShow(true);
          setLoading(false);
        });
    }
  );

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
          <Card.Title>Editando o título</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Empresa</Form.Label>
              <Form.Control as="select" name="company_id" ref={register()}>
                {companies &&
                  companies.map((company: ICompany) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formName">
              <Form.Label>Chave</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a chave"
                name="key"
                ref={register({ required: true })}
              />
              {errors.key && (
                <Form.Text className="text-muted">
                  Chave é obrigatório
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Valor líquido</Form.Label>
              <IMaskInput
                value={receivable.net_value}
                name="net_value"
                className="form-control"
                mask={Number}
                radix=","
                unmask={true}
                inputRef={register({ required: true })}
                placeholder="Digite o valor líquido"
              />
              {errors.net_value && (
                <Form.Text className="text-muted">
                  Valor líquido é obrigatório
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Vencimento</Form.Label>
              <IMaskInput
                value={receivable.expired_at}
                name="expired_at"
                className="form-control"
                mask={Date}
                unmask={true}
                inputRef={register({ required: true })}
                placeholder="Digite a data do vencimento"
              />
              {errors.expired_at && (
                <Form.Text className="text-muted">
                  Vencimento é obrigatório
                </Form.Text>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Salvando…" : "Salvar"}
            </Button>
          </Form>
          <Card.Link href="/receivables">Listar</Card.Link>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default New;

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

  const companies: ICompany[] = await api
    .get("/api/v1/companies")
    .then((response) => response.data);

  return {
    props: {
      receivable,
      companies,
    },
    revalidate: 5,
  };
};
