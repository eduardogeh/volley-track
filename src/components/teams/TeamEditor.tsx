import React, { useState, useEffect, useRef } from 'react';
// Importe os componentes do shadcn/ui
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield } from "lucide-react"; // Um ícone para o fallback da logo

import type { Team } from "../../types/TeamPlayersTypes.ts";

export function TeamEditor({ team, onSave }: { team: Team | null, onSave?: (team: Team) => void }) {
  const [editedTeam, setEditedTeam] = useState<Team | null>(team);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTeam(team);
  }, [team]);

  // As lógicas de estado e manipulação de eventos permanecem as mesmas
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTeam(prevTeam => prevTeam ? { ...prevTeam, [name]: value } : null);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setEditedTeam(prevTeam => prevTeam ? { ...prevTeam, logo: reader.result as string } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editedTeam) {
      onSave?.(editedTeam);
    }
  };

  if (!editedTeam) return null;

  return (
    // Container principal com Tailwind CSS
    <div className="flex items-center gap-6 border-b p-4">
      {/* Seção da Logo clicável */}
      <div onClick={() => logoInputRef.current?.click()} className="cursor-pointer">
        <Avatar className="h-20 w-20 rounded-md">
          <AvatarImage src={editedTeam.logo} alt={`${editedTeam.name} logo`} />
          <AvatarFallback className="rounded-md">
            <Shield className="h-10 w-10" />
          </AvatarFallback>
        </Avatar>
        <input
          type="file"
          ref={logoInputRef}
          onChange={handleLogoChange}
          accept="image/*"
          className="hidden" // Classe do Tailwind para esconder o input
        />
      </div>

      {/* Seção do Nome do Time */}
      <div className="flex-grow space-y-2">
        <Label htmlFor="team-name">Nome do Time</Label>
        <Input
          id="team-name"
          name="name"
          value={editedTeam.name || ''}
          onChange={handleChange}
          placeholder="Digite o nome do time"
        />
      </div>

      {/* Seção do Seletor de Cor */}
      <div className="flex flex-col items-center">
        <Label className="text-sm text-muted-foreground mb-2">Cor</Label>
        <input
          type="color"
          name="color"
          value={editedTeam.color}
          onChange={handleChange}
          // Estilização do seletor de cor com Tailwind
          className="h-12 w-12 cursor-pointer rounded-md border-0 bg-transparent p-0"
        />
      </div>

      {/* Botão de Salvar */}
      <Button onClick={handleSave}>Salvar</Button>
    </div>
  );
}