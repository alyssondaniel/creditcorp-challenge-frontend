import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import api from "../../services/api";
import { IMaskInput } from "react-imask";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import Head from "next/head";
import Navigation from "../../components/Navigation";
import { useForm } from "react-hook-form";

interface IReceivable {
  id: number;
  company_name: string;
  key: string;
  net_value: string;
  expired_at: string;
  value_antecipation: string;
}

interface ReceivablesProps {
  data: IReceivable[];
  companies: ICompany[];
}

interface ICompany {
  id: number;
  name: string;
  document: string;
}

type FormData = {
  tax: string;
  company_id: string;
};

const Receivable: React.FC<ReceivablesProps> = ({ data, companies }) => {
  const [isLoading, setLoading] = useState(false);
  const [receivables, setReceivables] = useState<IReceivable[]>([]);
  const [netValueTotal, setNetValueTotal] = useState<number>(0);
  const [valueAntecipationTotal, setValueAntecipationTotal] = useState<number>(
    0
  );

  useEffect(() => {
    setReceivables(data);
  }, []);

  const deleteReceivable = async (receivable: IReceivable) => {
    await api.delete(`/api/v1/receivables/${receivable.id}`).then(() => {
      const id = receivables.indexOf(receivable);
      setReceivables(receivables.splice(id, 1));
    });
  };

  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = handleSubmit(async ({ tax, company_id }) => {
    if (tax || company_id) {
      setLoading(true);
      let url = "/api/v1/receivables?";

      if (tax) {
        url += `&tax=${tax.replace(",", ".")}`;
      }
      if (company_id) {
        url += `&company_id=${company_id}`;
      }

      await api
        .get(url)
        .then((response) => {
          setLoading(false);
          setReceivables(response.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });
  let net_value_total: number = 0;
  let antecipation_total: number = 0;

  const handleCheck = (e) => {
    const { checked, value } = e.target;
    const [net_value, value_antecipation] = value.split("-");

    const net_value_total = checked
      ? netValueTotal + parseFloat(net_value)
      : netValueTotal - parseFloat(net_value);
    setNetValueTotal(net_value_total);
    const value_antecipation_total = checked
      ? valueAntecipationTotal + parseFloat(value_antecipation)
      : valueAntecipationTotal - parseFloat(value_antecipation);
    setValueAntecipationTotal(value_antecipation_total);
  };
  return (
    <Container className="lg-container" fluid>
      <Head>
        <title>Receivable</title>
      </Head>
      <Navigation />
      <Card>
        <Card.Body>
          <Card.Title>Filtar e/ou Calcular</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm>
                <Form.Group controlId="formName">
                  <Form.Label>Taxa</Form.Label>
                  <IMaskInput
                    name="tax"
                    className="form-control"
                    mask={Number}
                    radix=","
                    unmask={true}
                    inputRef={register()}
                    placeholder="Digite a taxa para calcular a antecipação"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>Empresa</Form.Label>
                  <Form.Control as="select" name="company_id" ref={register()}>
                    <option value="">Todas</option>;
                    {companies &&
                      companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? "Filtrando…" : "Filtrar"}
            </Button>{" "}
            <Button variant="link" href="/receivables">
              Limpar
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <hr />
      <Card>
        <Card.Body>
          <Card.Title>
            Listando títulos{" "}
            <Button variant="outline-success" href={`/receivables/new`}>
              Novo
            </Button>
          </Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th></th>
                <th>#</th>
                <th>Empresa</th>
                <th>Chave</th>
                <th>Valor líquido</th>
                <th>Vencimento</th>
                <th>Antecipação</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {receivables &&
                receivables.map((receivable) => {
                  net_value_total += parseFloat(receivable.net_value);
                  antecipation_total += parseFloat(
                    receivable.value_antecipation
                  );
                  return (
                    <tr key={receivable.id}>
                      <td>
                        <Form.Check
                          className="ck-net-value"
                          type="checkbox"
                          label={false}
                          value={`${receivable.net_value}-${receivable.value_antecipation}`}
                          onChange={(e) => handleCheck(e)}
                        />
                      </td>
                      <td>{receivable.id}</td>
                      <td>{receivable.company_name}</td>
                      <td>{receivable.key}</td>
                      <td>{receivable.net_value}</td>
                      <td>{receivable.expired_at}</td>
                      <td>{receivable.value_antecipation}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          href={`/receivables/${receivable.id}/show`}
                          size="sm"
                        >
                          Detalhes
                        </Button>{" "}
                        <Button
                          variant="outline-warning"
                          href={`/receivables/${receivable.id}/edit`}
                          size="sm"
                        >
                          Editar
                        </Button>{" "}
                        <Button
                          variant="outline-danger"
                          onClick={() => deleteReceivable(receivable)}
                          size="sm"
                        >
                          Apagar
                        </Button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} align="right">
                  Totais
                </td>
                <td>
                  <span id="netValueTotal">
                    {netValueTotal > 0
                      ? netValueTotal.toFixed(2)
                      : net_value_total.toFixed(2)}
                  </span>
                </td>
                <td></td>
                <td>
                  {valueAntecipationTotal > 0
                    ? valueAntecipationTotal.toFixed(2)
                    : antecipation_total.toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Receivable;

export const getStaticProps: GetStaticProps = async () => {
  const data: ReceivablesProps = await api
    .get("/api/v1/receivables")
    .then((response) => response.data);

  const companies: ICompany[] = await api
    .get("/api/v1/companies")
    .then((response) => response.data);

  return {
    props: {
      data,
      companies,
    },
    revalidate: 5,
  };
};
