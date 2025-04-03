import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/types";
import { X } from "lucide-react";

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: User;
  onClose?: () => void;
}

export function EmployeeDialog({
  open,
  onOpenChange,
  employee,
  onClose,
}: EmployeeDialogProps) {
  const { toast } = useToast();
  const address = employee?.addresses?.[0];

  const [formData, setFormData] = useState({
    name: employee?.firstname || "",
    email: employee?.email || "",
    role: employee?.role || "EMPLOYEE",
    phone: address?.telephone || "",
    userCode: address?.postcode || "",
    password: employee?.lastname || "",
  });

  useEffect(() => {
    if (employee) {
      const address = employee.addresses?.[0];
      setFormData({
        name: employee.firstname || "",
        email: employee.email || "",
        role: employee.role || "EMPLOYEE",
        phone: address?.telephone || "",
        userCode: address?.postcode || "",
        password: employee.lastname || "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "EMPLOYEE",
        phone: "",
        userCode: "",
        password: "",
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (employee) {
        await fetch(`/api/employees/${employee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      toast({
        title: employee ? "Funcionário atualizado" : "Funcionário cadastrado",
        description: employee
          ? "As informações do funcionário foram atualizadas com sucesso."
          : "O novo funcionário foi cadastrado com sucesso.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível salvar as informações do funcionário.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    onClose?.();
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader className="flex-row justify-between items-center">
          <DialogTitle>
            {employee ? "Editar Funcionário" : "Novo Funcionário"}
          </DialogTitle>
          <div
            className="flex items-center justify-center cursor-pointer absolute right-4 top-4"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              className="text-slate-500"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="text-slate-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger className="text-slate-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="SUPERVISOR">Supervisor</SelectItem>
                <SelectItem value="CASHIER">Caixa</SelectItem>
                <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userCode">Código de Usuário</Label>
            <Input
              id="userCode"
              type="number"
              className="text-slate-500"
              value={formData.userCode}
              onChange={(e) =>
                setFormData({ ...formData, userCode: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              className="text-slate-500"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              className="text-slate-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
          <DialogFooter>
            <Button type="submit">{employee ? "Salvar" : "Cadastrar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
