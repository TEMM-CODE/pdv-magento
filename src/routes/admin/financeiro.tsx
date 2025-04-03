import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Sale } from "@/types";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/financeiro")({
  component: Finance,
});

export default function Finance() {
  const { data: sales } = useQuery<Sale[]>({
    queryKey: ["sales"],
    queryFn: api.getSales,
  });

  const totalRevenue = sales?.reduce((acc, sale) => acc + sale.total, 0) || 0;
  const totalSales = sales?.length || 0;
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  const recentTransactions = sales?.slice(0, 5) || [];

  return (
    <Layout role="admin">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-heading font-heading">
          Financeiro
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">
                Receita Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalRevenue)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">
                Total de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{totalSales}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold">
                Ticket Médio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(averageTicket)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>#{transaction.id}</TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{transaction.employeeName}</TableCell>
                    <TableCell>
                      {transaction.paymentMethod === "CREDIT" && "Crédito"}
                      {transaction.paymentMethod === "DEBIT" && "Débito"}
                      {transaction.paymentMethod === "CASH" && "Dinheiro"}
                      {transaction.paymentMethod === "PIX" && "PIX"}
                    </TableCell>
                    <TableCell className="text-right">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(transaction.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
