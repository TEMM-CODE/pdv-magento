import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MaskedInput } from "@/components/ui/masked-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/cliente/perfil")({
  component: Profile,
});

export default function Profile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getUser(),
  });

  const { control } = useForm({
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      taxvat: user?.taxvat || "",
      postcode: user?.addresses?.[0]?.postcode || "",
      addresses: user?.addresses?.[0]?.street || "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Perfil atualizado",
        description: "Seus dados foram atualizados com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seus dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout role="customer">
      <div className="container max-w-2xl py-6">
        <Card>
          <CardHeader>
            <CardTitle>Meus dados</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <div {...field} className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" value={user?.firstname} />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <div {...field} className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" value={user?.lastname} />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <div {...field} className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user?.email} />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <div {...field} className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" value={user?.phone} />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="taxvat"
                render={({ field }) => (
                  <div {...field} className="space-y-2">
                    <Label htmlFor="taxvat">CPF</Label>
                    <Input id="taxvat" value={user?.taxvat} />
                  </div>
                )}
              />

              <Controller
                control={control}
                name="postcode"
                render={({ field }) => (
                  <div {...field} className="space-y-2">
                    <Label htmlFor="postcode">CEP</Label>
                    <Input
                      id="postcode"
                      value={user?.addresses?.[0]?.postcode}
                    />
                  </div>
                )}
              />
              <Controller
                control={control}
                name="addresses"
                render={({ field }) => (
                  <div {...field} className="space-y-2">
                    <Label htmlFor="addresses">Endereço</Label>
                    <Input
                      id="addresses"
                      value={user?.addresses?.[0]?.street}
                    />
                  </div>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
