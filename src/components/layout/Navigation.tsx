import { Bell, ShoppingCart, User } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link, useNavigate } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const Navigation = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Notificações",
      description: "Você não tem novas notificações.",
    });
  };
  return (
    <div className="h-16 bg-primary dark:bg-background shadow-md flex items-center justify-center px-16 fixed bottom-0 right-0 left-0 lg:left-64 z-30 lg:hidden">
      <div className="items-center justify-center gap-10 space-x-4 flex w-full">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNotificationClick}
          className="group hover:bg-secondary/70"
        >
          <Bell className="!h-5 !w-5 text-white group-hover:text-primary" />
        </Button>
        {role === "customer" && (
          <Button variant="ghost" size="icon" asChild className="">
            <Link
              to="/cliente/carrinho"
              className="group hover:bg-secondary/70"
            >
              <ShoppingCart className="!h-5 !w-5 text-white group-hover:text-primary" />
            </Link>
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group hover:bg-secondary/70"
            >
              <User className="!h-5 !w-5 text-white group-hover:text-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {role === "customer" && (
              <DropdownMenuItem
                onClick={() => navigate({ to: `/${role}/perfil` })}
              >
                Meu Perfil
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => navigate({ to: `/${role}/configuracoes` })}
            >
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => {
                localStorage.removeItem("token");
                navigate({ to: "/login" });
              }}
            >
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navigation;
