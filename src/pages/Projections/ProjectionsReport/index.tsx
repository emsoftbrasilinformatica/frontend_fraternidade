/* eslint-disable array-callback-return */
import React from 'react';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import {
  DataTableCell,
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from '@david.kucsai/react-pdf-table';
import { Balance, Projection } from '..';

const styles = StyleSheet.create({
  head: {
    backgroundColor: '#b0bec5',
  },
  body: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 15,
  },
  cell: {
    paddingLeft: 5,
    paddingRight: 5,
    textAlign: 'center',
  },
  totalMonth: {
    backgroundColor: '#eceff1',
  },
  totalAcumulated: {
    backgroundColor: '#cfd8dc',
  },
  left: {
    textAlign: 'left',
  },
  rigth: {
    textAlign: 'right',
  },
  sumTable: {
    marginTop: 25,
  },
});

interface FrequencyReportProps {
  tableData: Projection[];
  lastBalance: Balance;
  openCred: number;
  openDeb: number;
  startDate: Date;
  endDate: Date;
  months: string[];
}

const ProjectionsReport: React.FC<FrequencyReportProps> = ({
  tableData,
  lastBalance,
  openCred,
  openDeb,
  startDate,
  endDate,
  months,
}) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" wrap style={styles.body}>
        <View style={{ marginBottom: '20px' }}>
          <Text style={{ textAlign: 'center' }}>
            Fraternidade, Caminho e Luz
          </Text>
          <Text
            style={{ fontSize: 16, textAlign: 'center', marginTop: '10px' }}
          >
            Projeção Financeira
          </Text>
        </View>
        <View style={{ marginBottom: '20px' }}>
          <Table
            data={[{ lastBalance, openCred, openDeb, startDate, endDate }]}
          >
            <TableHeader>
              <TableCell style={[styles.cell, styles.head]}>Período</TableCell>
              <TableCell style={[styles.cell, styles.head]}>
                Fechamento
              </TableCell>
              <TableCell style={[styles.cell, styles.head]}>
                Valor Aberto (Créditos)
              </TableCell>
              <TableCell style={[styles.cell, styles.head]}>
                Valor Aberto (Débitos)
              </TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell
                style={[styles.cell]}
                getContent={(r: any) => {
                  return `${r.startDate.toLocaleDateString(
                    'pt-br',
                  )} a ${r.endDate.toLocaleDateString('pt-br')}`;
                }}
              />
              <DataTableCell
                style={[styles.cell]}
                getContent={(r: any) => {
                  return (r.lastBalance.date ?? new Date()).toLocaleDateString(
                    'pt-br',
                  );
                }}
              />
              <DataTableCell
                style={[styles.cell]}
                getContent={(r: any) => {
                  return new Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(r.openCred);
                }}
              />
              <DataTableCell
                style={[styles.cell]}
                getContent={(r: any) => {
                  return new Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(r.openDeb);
                }}
              />
            </TableBody>
          </Table>
        </View>
        <View>
          {/*  */}
          <Table data={tableData.slice(0, -2)}>
            <TableHeader>
              <TableCell style={[styles.cell, styles.left, styles.head]}>
                Descrição
              </TableCell>
              <TableCell style={[styles.cell, styles.head]} weighting={0.3}>
                Mov.
              </TableCell>
              {months.map(cv => {
                return (
                  <TableCell
                    key={`header_month_${cv}`}
                    style={[styles.cell, styles.rigth, styles.head]}
                  >
                    {`${cv.slice(4)}/${cv.slice(0, 4)}`}
                  </TableCell>
                );
              })}
              <TableCell style={[styles.cell, styles.rigth, styles.head]}>
                Total
              </TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell
                style={[styles.cell, styles.left]}
                getContent={(r: Projection) => r.description}
              />
              <DataTableCell
                style={styles.cell}
                weighting={0.3}
                getContent={(r: Projection) => {
                  // eslint-disable-next-line no-nested-ternary
                  const simb = r.mov === '' ? '' : r.mov === 'D' ? '+' : '-';
                  return simb;
                }}
              />
              {months.map(cv => {
                return (
                  <DataTableCell
                    key={`cell_month_${cv}`}
                    style={[styles.cell, styles.rigth]}
                    getContent={(r: any) => {
                      return new Intl.NumberFormat('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(r[cv]);
                    }}
                  />
                );
              })}
              <DataTableCell
                style={[styles.cell, styles.rigth]}
                getContent={(r: any) => {
                  return new Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(r.total);
                }}
              />
            </TableBody>
          </Table>
          {/* Total Mensal */}
          <Table data={tableData.slice(-2, -1)}>
            <TableBody>
              <DataTableCell
                style={[styles.cell, styles.left, styles.totalMonth]}
                getContent={(r: Projection) => r.description}
              />
              <DataTableCell
                style={[styles.cell, styles.totalMonth]}
                weighting={0.3}
                getContent={(r: Projection) => {
                  // eslint-disable-next-line no-nested-ternary
                  const simb = r.mov === '' ? '' : r.mov === 'D' ? '+' : '-';
                  return simb;
                }}
              />
              {months.map(cv => {
                return (
                  <DataTableCell
                    key={`cell_month_${cv}`}
                    style={[styles.cell, styles.rigth, styles.totalMonth]}
                    getContent={(r: any) => {
                      return new Intl.NumberFormat('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(r[cv]);
                    }}
                  />
                );
              })}
              <DataTableCell
                style={[styles.cell, styles.rigth, styles.totalMonth]}
                getContent={(r: any) => {
                  return new Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(r.total);
                }}
              />
            </TableBody>
          </Table>
          {/* Total Acumulado */}
          <Table data={tableData.slice(-1)}>
            <TableBody>
              <DataTableCell
                style={[styles.cell, styles.left, styles.totalAcumulated]}
                getContent={(r: Projection) => r.description}
              />
              <DataTableCell
                style={[styles.cell, styles.totalAcumulated]}
                weighting={0.3}
                getContent={(r: Projection) => {
                  // eslint-disable-next-line no-nested-ternary
                  const simb = r.mov === '' ? '' : r.mov === 'D' ? '+' : '-';
                  return simb;
                }}
              />
              {months.map(cv => {
                return (
                  <DataTableCell
                    key={`cell_month_${cv}`}
                    style={[styles.cell, styles.rigth, styles.totalAcumulated]}
                    getContent={(r: any) => {
                      return new Intl.NumberFormat('pt-br', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(r[cv]);
                    }}
                  />
                );
              })}
              <DataTableCell
                style={[styles.cell, styles.rigth, styles.totalAcumulated]}
                getContent={(r: any) => {
                  return new Intl.NumberFormat('pt-br', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(r.total);
                }}
              />
            </TableBody>
          </Table>
        </View>
      </Page>
    </Document>
  );
};

export default ProjectionsReport;
