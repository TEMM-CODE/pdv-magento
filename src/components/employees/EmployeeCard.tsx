import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Mail, Phone, Trash2 } from "lucide-react";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface EmployeeCardProps {
  employee: User;
  onEdit: (employee: User) => void;
  onDelete: (employeeId: number) => void;
}

export function EmployeeCard({
  employee,
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const { toast } = useToast();
  const address = employee.addresses?.[0];

  const handleDelete = () => {
    onDelete(employee.id);
    toast({
      title: "Funcionário excluído",
      description: "O funcionário foi excluído com sucesso",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-1 text-2xl">
          {employee.firstname}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.email}</span>
          </div>
          {address?.postcode && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{address.telephone}</span>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(employee)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
