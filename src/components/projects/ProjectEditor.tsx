import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Project } from '../../types/ProjectTypes';
import type { Team } from '../../types/TeamPlayersTypes';
import type {ScoutModel} from "@/types/ScoutTypes.ts";
import {FolderSearch, PlayCircle} from "lucide-react";


interface ProjectEditorProps {
  project: Project;
  onSave: (project: Project) => void;
  onPlayProject: (project: Project) => void;
}

export function ProjectEditor({ project, onSave, onPlayProject }: ProjectEditorProps) {
  const [editedProject, setEditedProject] = useState(project);
  const [teams, setTeams] = useState<Team[]>([]);
  const [scoutModels, setScoutModels] = useState<ScoutModel[]>([]);

  useEffect(() => {
    setEditedProject(project);
  }, [project]);

  useEffect(() => {
    const fetchData = async () => {
      const allTeams = await window.api.team.getAll();
      setTeams(allTeams);
      const allModels = await window.api.scout.getAll();
      setScoutModels(allModels);
    };
    fetchData();
  }, []);

  const handleSave = () => {
    onSave(editedProject);
  };

  const handleChange = (field: keyof Project, value: string | number) => {
    setEditedProject(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectVideo = async () => {
    const filePath = await window.api.dialog.openFile();
    if (filePath) {
      handleChange('video_path', filePath);
    }
  };

  const handlePlayClick = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    onPlayProject(project);
  };

  return (
    <div className="p-4 border-b">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="season">Temporada</Label>
            <Input id="season" value={editedProject.season} onChange={(e) => handleChange('season', e.target.value)} />
          </div>
          <div>
            <Label htmlFor="tournament">Campeonato</Label>
            <Input id="tournament" value={editedProject.tournament} onChange={(e) => handleChange('tournament', e.target.value)} />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Input id="description" value={editedProject.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
        </div>

        <div>
          <Label htmlFor="video-path">Caminho do Vídeo</Label>
          <div className="flex items-center gap-2">
            <Input
              id="video-path"
              readOnly
              value={editedProject.video_path || 'Nenhum vídeo selecionado'}
              className="flex-grow"
            />
            <Button variant="outline" onClick={handleSelectVideo} className="shrink-0">
              <FolderSearch className="mr-2 h-4 w-4" />
              Selecionar...
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Time</Label>
            <Select
              value={String(editedProject.id_team)}
              onValueChange={(value) => handleChange('id_team', Number(value))}
            >
              <SelectTrigger><SelectValue placeholder="Selecione um time..." /></SelectTrigger>
              <SelectContent>
                {teams.map(team => <SelectItem key={team.id} value={String(team.id)}>{team.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Modelo de Scout</Label>
            <Select
              value={String(editedProject.id_scout_model)}
              onValueChange={(value) => handleChange('id_scout_model', Number(value))}
            >
              <SelectTrigger><SelectValue placeholder="Selecione um modelo..." /></SelectTrigger>
              <SelectContent>
                {scoutModels.map(model => <SelectItem key={model.id} value={String(model.id)}>{model.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            onClick={(e) => handlePlayClick(e, project)}
            title="Iniciar análise do projeto"
            className="h-9 shrink-0 bg-green-600 px-3 text-sm text-white hover:bg-green-700"
          >
            <PlayCircle className="mr-2 h-4 w-4" />
            Iniciar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
        </div>
      </div>
    </div>
  );
}