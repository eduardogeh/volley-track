// src/HomePage.tsx
import 'react';
// 1. Importe o Button do shadcn/ui
import { Button } from "@/components/ui/button";

// 2. Importe os ícones equivalentes da biblioteca lucide-react
import {
  PlusCircle,
  Folder,
  Users,
  LineChart,
  BarChart3
} from 'lucide-react';

// 3. Importe o Link do react-router-dom
import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
  return (
    // Container principal com classes do Tailwind CSS
    <main className="flex h-screen flex-col items-center justify-center bg-slate-100 text-center text-slate-800">
      <div className="mb-8">
        <img src="/logo.png" alt="Logo do Projeto" style={{ maxHeight: '150px' }} />
      </div>

      {/* Grid de botões com Tailwind CSS para responsividade */}
      <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <Button size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Projeto
        </Button>

        <Button size="lg">
          <Folder className="mr-2 h-5 w-5" />
          Projetos
        </Button>

        {/* Botões que são links usando a prop 'asChild' */}
        <Button asChild size="lg">
          <RouterLink to="/teams">
            <Users className="mr-2 h-5 w-5" />
            Times
          </RouterLink>
        </Button>

        <Button asChild size="lg">
          <RouterLink to="/scouts">
            <LineChart className="mr-2 h-5 w-5" />
            Scouts
          </RouterLink>
        </Button>

        <Button size="lg">
          <BarChart3 className="mr-2 h-5 w-5" />
          Dashboards
        </Button>
      </div>
    </main>
  );
}