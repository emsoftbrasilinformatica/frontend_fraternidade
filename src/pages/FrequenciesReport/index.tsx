/* eslint-disable array-callback-return */
import React from 'react';

import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import {
  DataTableCell,
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from '@david.kucsai/react-pdf-table';
import { Frequency } from '../Frequencies';

const styles = StyleSheet.create({
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
  left: {
    textAlign: 'left',
  },
  sumTable: {
    marginTop: 25,
  },
});

interface FrequencyReportProps {
  frequenciesSummary: Frequency[];
  referenceDate: Date;
  monthsGroup: string;
  inadimplentes: number[];
  inadimplentesPeriodo: number;
}

const getDegreeName = (
  degree = '',
): 'companheiro' | 'mestre' | 'mestreInstalado' | 'aprendiz' => {
  if (degree.toUpperCase() === 'C') {
    return 'companheiro';
  }
  if (degree.toUpperCase() === 'M') {
    return 'mestre';
  }
  if (degree.toUpperCase() === 'MI') {
    return 'mestreInstalado';
  }
  return 'aprendiz';
};

const FrequenciesReport: React.FC<FrequencyReportProps> = ({
  frequenciesSummary,
  referenceDate,
  monthsGroup,
  inadimplentes,
  inadimplentesPeriodo,
}) => {
  const month = format(referenceDate, 'MMMM').toLowerCase();
  const groupSummary =
    monthsGroup === '12_months' ? 'percentLast12Months' : 'percentLast24Months';
  const inadPeriodo = `${inadimplentesPeriodo} ${
    inadimplentesPeriodo === 1 ? 'mês' : 'meses'
  }`;
  const totalSummary = frequenciesSummary.reduce(
    (acc, cv) => {
      return {
        ...acc,
        [getDegreeName(cv.degree)]: acc[getDegreeName(cv.degree)] + 1,
        geral: acc.geral + 1,
      };
    },
    {
      aprendiz: 0,
      companheiro: 0,
      mestre: 0,
      mestreInstalado: 0,
      geral: 0,
    },
  );

  return (
    <Document>
      <Page size="A4" orientation="portrait" wrap style={styles.body}>
        <View>
          <Text style={{ textAlign: 'center' }}>
            Fraternidade, Caminho e Luz
          </Text>
          <Text style={{ fontSize: 14, textAlign: 'center' }}>
            Relatório de Frequências
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ fontSize: 10 }}>
              Data de referência:{' '}
              {`${referenceDate.getMonth() + 1}`.padStart(2, '0')}/
              {referenceDate.getFullYear()}
            </Text>
            <Text
              style={{
                fontSize: 10,
                textAlign: 'center',
                marginLeft: '165px',
              }}
            >
              Período de inadimplência: {inadPeriodo}
            </Text>
          </View>
        </View>
        <View>
          <Table data={frequenciesSummary}>
            <TableHeader>
              <TableCell style={[styles.cell, styles.left]} weighting={0.5}>
                Nome
              </TableCell>
              <TableCell style={styles.cell} weighting={0.1}>
                CIM
              </TableCell>
              <TableCell style={styles.cell} weighting={0.1}>
                Grau
              </TableCell>
              <TableCell style={styles.cell} weighting={0.2}>
                % Presença
              </TableCell>
              <TableCell style={styles.cell} weighting={0.1}>
                I
              </TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell
                style={[styles.cell, styles.left]}
                weighting={0.5}
                getContent={(r: Frequency) => r.name}
              />
              <DataTableCell
                style={styles.cell}
                weighting={0.1}
                getContent={(r: Frequency) => r.cim}
              />
              <DataTableCell
                style={styles.cell}
                weighting={0.1}
                getContent={(r: any) => r?.degree}
              />
              <DataTableCell
                style={styles.cell}
                weighting={0.2}
                getContent={(r: any) => r?.[month]?.[groupSummary]}
              />
              <DataTableCell
                style={styles.cell}
                weighting={0.1}
                getContent={(r: Frequency) => {
                  if (inadimplentes.includes(r.cim)) {
                    return 'S';
                  }
                  return 'N';
                }}
              />
            </TableBody>
          </Table>
          {/* {tables} */}
          <View style={styles.sumTable}>
            <Table data={[totalSummary]}>
              <TableHeader>
                <TableCell style={styles.cell} weighting={0.125}>
                  {' '}
                </TableCell>
                <TableCell style={styles.cell} weighting={0.15}>
                  Aprendiz
                </TableCell>
                <TableCell style={styles.cell} weighting={0.2}>
                  Companheiro
                </TableCell>
                <TableCell style={styles.cell} weighting={0.15}>
                  Mestre
                </TableCell>
                <TableCell style={styles.cell} weighting={0.225}>
                  Mestre Instalado
                </TableCell>
                <TableCell style={styles.cell} weighting={0.125}>
                  Geral
                </TableCell>
              </TableHeader>
              <TableBody>
                <DataTableCell
                  style={styles.cell}
                  weighting={0.125}
                  getContent={r => 'Somatória'}
                />
                <DataTableCell
                  style={styles.cell}
                  weighting={0.15}
                  getContent={r => r.aprendiz}
                />
                <DataTableCell
                  style={styles.cell}
                  weighting={0.2}
                  getContent={r => r.companheiro}
                />
                <DataTableCell
                  style={styles.cell}
                  weighting={0.15}
                  getContent={r => r.mestre}
                />
                <DataTableCell
                  style={styles.cell}
                  weighting={0.225}
                  getContent={r => r.mestreInstalado}
                />
                <DataTableCell
                  style={styles.cell}
                  weighting={0.125}
                  getContent={r => r.geral}
                />
              </TableBody>
            </Table>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default FrequenciesReport;
