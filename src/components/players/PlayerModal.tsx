import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { User } from "lucide-react";

import type { PlayerProps } from "@/types/TeamPlayersTypes.ts";

export type PlayerModalProps = {
  open: boolean;
  onClose: () => void;
  player?: PlayerProps | null;
  onSave: (playerData: PlayerProps) => void;
}

const defaultPlayerState: PlayerProps = { name: '', number: 0, height: '', position: '', photo: '' };
const positions = ["Levantador", "Oposto", "Ponteiro", "Central", "Líbero"];

export function PlayerModal({ open, onClose, player, onSave }: PlayerModalProps) {
  const [formData, setFormData] = useState<PlayerProps>(defaultPlayerState);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (player) {
      setFormData(player);
    } else {
      setFormData(defaultPlayerState);
    }
  }, [player, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (value: string) => {
    setFormData(prev => ({ ...prev, position: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{player ? 'Editar Jogador' : 'Cadastrar Novo Jogador'}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2 pt-4">
          <Avatar className="h-24 w-24 rounded-md">
            <AvatarImage src={formData.photo} alt={formData.name} />
            <AvatarFallback className="rounded-md">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            Alterar Foto
          </Button>
          <input type="file" ref={fileInputRef} onChange={handlePhotoChange} accept="image/*" className="hidden"/>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nome</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="number" className="text-right">Número</Label>
            <Input id="number" name="number" type="number" value={formData.number || ''} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">Altura</Label>
            <Input id="height" name="height" placeholder="ex: 1.85" value={formData.height} onChange={handleChange} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="position" className="text-right">Posição</Label>
            <Select value={formData.position} onValueChange={handlePositionChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma posição" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}