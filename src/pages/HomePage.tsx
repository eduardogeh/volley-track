import 'react';
import { Button } from "@/components/ui/button";

import {
  Folder,
  Users,
  LineChart,
  BarChart3
} from 'lucide-react';

import { Link as RouterLink } from 'react-router-dom';

export function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center justify-center bg-slate-100 text-center text-slate-800">
      <div className="mb-8">
        <img src="/logo.png" alt="Logo do Projeto" style={{ maxHeight: '150px' }} />
      </div>

      {/* Grid de botões */}
      <div className="grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

        <Button asChild size="lg">
          <RouterLink to='/projects' >
            <Folder className="mr-2 h-5 w-5" />
            Projetos
          </RouterLink>
        </Button>

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

        <Button size="lg" disabled>
          <BarChart3 className="mr-2 h-5 w-5" />
          Dashboards
        </Button>
      </div>
    </main>
  );
}