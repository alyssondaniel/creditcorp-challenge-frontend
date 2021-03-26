import React, { useEffect, useState } from "react";
import { GetStaticProps } from "next";
import api from "../../services/api";
import { Button, Card, Container, Table } from "react-bootstrap";
import Head from "next/head";
import Navigation from "../../components/Navigation";

interface ICompany {
  id: number;
  name: string;
  document: string;
}

interface CompaniesProps {
  data: ICompany[];
}

const Company: React.FC<CompaniesProps> = ({ data }) => {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  useEffect(() => {
    setCompanies(data);
  }, [companies]);
  const deleteCompany = async (company: ICompany) => {
    await api.delete(`/api/v1/companies/${company.id}`).then(() => {
      const id = companies.indexOf(company);
      setCompanies(companies.splice(id, 1));
    });
  };
  return (
    <Container className="lg-container">
      <Head>
        <title>Company</title>
      </Head>
      <Navigation />
      <Card>
        <Card.Body>
          <Card.Title>
            Listando empresas{" "}
            <Button variant="outline-success" href={`/companies/new`}>
              Novo
            </Button>
          </Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Razão Social</th>
                <th>CNPJ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {companies &&
                companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.id}</td>
                    <td>{company.name}</td>
                    <td>{company.document}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        href={`/companies/${company.id}/show`}
                        size="sm"
                      >
                        Detalhes
                      </Button>{" "}
                      <Button
                        variant="outline-warning"
                        href={`/companies/${company.id}/edit`}
                        size="sm"
                      >
                        Editar
                      </Button>{" "}
                      <Button
                        variant="outline-danger"
                        onClick={() => deleteCompany(company)}
                        size="sm"
                      >
                        Apagar
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Company;

export const getStaticProps: GetStaticProps = async () => {
  const data: CompaniesProps = await api
    .get("/api/v1/companies")
    .then((response) => response.data);

  return {
    props: {
      data,
    },
    revalidate: 5,
  };
};
