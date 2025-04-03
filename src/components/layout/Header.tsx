import { Bell, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
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
    <header className="h-16 bg-primary dark:bg-background shadow-md flex items-center justify-end px-6 fixed top-0 right-0 left-0 lg:left-64 z-30">
      <div className="flex items-center justify-center">
        <div className="items-center space-x-4 hidden lg:flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationClick}
            className="group hover:bg-secondary/70"
          >
            <Bell className="h-5 w-5 text-white group-hover:text-primary" />
          </Button>
          {role === "customer" && (
            <Button variant="ghost" size="icon" asChild className="">
              <Link
                to="/cliente/carrinho"
                className="group hover:bg-secondary/70"
              >
                <ShoppingCart className="h-5 w-5 text-white group-hover:text-primary" />
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
                <User className="h-5 w-5 text-white group-hover:text-primary" />
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
        <h1 className="text-2xl font-heading font-bold text-primary lg:hidden">
          TEMM CODE
        </h1>
      </div>
    </header>
  );
}
