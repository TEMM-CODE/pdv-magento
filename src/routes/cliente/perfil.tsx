import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const Route = createFileRoute("/cliente/perfil")({
  component: Profile,
});

const userFormSchema = z.object({
  firstName: z
    .string()
    .nonempty("Obrigatório")
    .regex(/^[A-Za-z]+$/i, "Somente letras são permitidas"),
  lastName: z
    .string()
    .nonempty("Obrigatório")
    .regex(/^[A-Za-z]+$/i, "Somente letras são permitidas"),
  email: z.string().email("Email inválido"),
  phone: z
    .string()
    .regex(/[0-9]+$/, "Somente números são permitidos")
    .min(11, "Telefone inválido")
    .max(11, "Telefone inválido"),
  postcode: z
    .string()
    .regex(/[0-9]+$/, "Somente números são permitidos")
    .optional(),
  taxvat: z
    .string()
    .regex(/[0-9]+$/, "Somente números são permitidos")
    .min(11, "CPF inválido")
    .max(11, "CPF inválido")
    .nonempty("Obrigatório"),
  addresses: z.array(z.string()).optional(),
});

export default function Profile() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.getUser(),
  });

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof userFormSchema>>({
    defaultValues: {
      firstName: user?.firstname || "",
      lastName: user?.lastname || "",
      email: user?.email || "",
      phone: user?.phone || "",
      taxvat: user?.taxvat || "",
      postcode: user?.addresses?.[0]?.postcode || "",
      addresses: user?.addresses?.[0]?.street || [""],
    },
    resolver: zodResolver(userFormSchema),
  });

  // Atualiza o formulário quando `user` mudar
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstname || "",
        lastName: user.lastname || "",
        email: user.email || "",
        phone: user.phone || "",
        taxvat: user.taxvat || "",
        postcode: user.addresses?.[0]?.postcode || "",
        addresses: user.addresses?.[0]?.street
          ? user.addresses[0].street
          : [""],
      });
    }
  }, [user, reset]); // Dispara sempre que `user` mudar

  const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
    setIsLoading(true);
    console.log(data);
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input {...field} id="firstName" />
                    {errors.firstName && (
                      <small className="text-xs font-medium leading-none text-red-700">
                        {errors.firstName.message}
                      </small>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input {...field} id="lastName" />
                    {errors.lastName && (
                      <small className="text-xs font-medium leading-none text-red-700">
                        {errors.lastName.message}
                      </small>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input {...field} id="email" />
                    {errors.email && (
                      <small className="text-xs font-medium leading-none text-red-700">
                        {errors.email.message}
                      </small>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" {...field} />
                    {errors.phone && (
                      <small className="text-xs font-medium leading-none text-red-700">
                        {errors.phone.message}
                      </small>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="taxvat"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="taxvat">CPF</Label>
                    <Input id="taxvat" {...field} />
                    {errors.taxvat && (
                      <small className="text-sm font-medium leading-none text-red-700">
                        {errors.taxvat.message}
                      </small>
                    )}
                  </div>
                )}
              />

              <Controller
                control={control}
                name="postcode"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="postcode">CEP</Label>
                    <Input id="postcode" {...field} />
                    {errors.postcode && (
                      <small className="text-xs font-medium leading-none text-red-700">
                        {errors.postcode.message}
                      </small>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="addresses"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="addresses">Endereço</Label>
                    <Input
                      {...field}
                      id="addresses"
                      onChange={(e) => {
                        const newValue = [e.target.value];
                        field.onChange(newValue);
                      }}
                    />
                    {errors.addresses && (
                      <small className="text-xs font-medium leading-none text-red-700">
                        {errors.addresses.message}
                      </small>
                    )}
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
