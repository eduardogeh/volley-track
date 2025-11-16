import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger, MultiSelectValue } from "@/components/ui/multi-select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type {PlayerProps} from "@/types/TeamPlayersTypes.ts";
import type {Category, Subcategory} from "@/types/ScoutTypes.ts";

interface FilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onApplyFilters: (filters: {
        players: string[];
        categories: string[];
        resultSubCategories: string[];
        zoneSubCategories: string[];
    }) => void;
    players: PlayerProps[];
    categories: Category[];
}

export function FilterDialog({
                                 isOpen,
                                 onClose,
                                 onApplyFilters,
                                 players,
                                 categories
                             }: FilterDialogProps) {
    const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedResultSubCategories, setSelectedResultSubCategories] = useState<string[]>([]);
    const [selectedZoneSubCategories, setSelectedZoneSubCategories] = useState<string[]>([]);

    const [filteredResultSubCategories, setFilteredResultSubCategories] = useState<Subcategory[]>([]);
    const [filteredZoneSubCategories, setFilteredZoneSubCategories] = useState<Subcategory[]>([]);

    useEffect(() => {
        const selectedCategoryObjects = categories.filter(category => selectedCategories.includes(category.name));

        const resultSubCategories: Subcategory[] = [];
        const zoneSubCategories: Subcategory[] = [];

        selectedCategoryObjects.forEach(category => {
            category.subcategories.forEach(subCategory => {
                if (subCategory.type === "resultado") {
                    resultSubCategories.push(subCategory);
                } else if (subCategory.type === "zona") {
                    zoneSubCategories.push(subCategory);
                }
            });
        });

        setFilteredResultSubCategories(resultSubCategories);
        setFilteredZoneSubCategories(zoneSubCategories);

    }, [selectedCategories, categories]);

    const handleApply = () => {
        onApplyFilters({
            players: selectedPlayers,
            categories: selectedCategories,
            resultSubCategories: selectedResultSubCategories,
            zoneSubCategories: selectedZoneSubCategories
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogTitle>Filtrar Ações</DialogTitle>
                <DialogDescription>
                    Selecione os filtros abaixo:
                </DialogDescription>

                {/* Filtro de Jogadores */}
                <MultiSelect values={selectedPlayers} onValuesChange={setSelectedPlayers}>
                    <MultiSelectTrigger className="w-full max-w-[400px]">
                        <MultiSelectValue placeholder="Selecionar Jogadores" />
                    </MultiSelectTrigger>
                    <MultiSelectContent>
                        <MultiSelectGroup>
                            {players.map(player => (
                                <MultiSelectItem key={player.id} value={player.name}>{player.name}</MultiSelectItem>
                            ))}
                        </MultiSelectGroup>
                    </MultiSelectContent>
                </MultiSelect>

                {/* Filtro de Categorias */}
                <MultiSelect
                    values={selectedCategories}
                    onValuesChange={(newValues: string[]) => {
                        setSelectedCategories(newValues);
                        if(newValues.length === 0) {
                            setSelectedResultSubCategories([]);
                            setSelectedZoneSubCategories([]);
                        }
                    }}>
                        <MultiSelectTrigger className="w-full max-w-[400px]">
                        <MultiSelectValue placeholder="Selecionar Categorias" />
                        </MultiSelectTrigger>
                        <MultiSelectContent>
                        <MultiSelectGroup>
                    {categories.map(category => (
                        <MultiSelectItem key={category.id} value={category.name}>
                    {category.name}
                </MultiSelectItem>
                ))}
            </MultiSelectGroup>
        </MultiSelectContent>
</MultiSelect>

{/* Filtro de Sub-Categorias de Resultado */}
{selectedCategories.length > 0 && (
        <MultiSelect values={selectedResultSubCategories} onValuesChange={setSelectedResultSubCategories}>
            <MultiSelectTrigger className="w-full max-w-[400px]">
                <MultiSelectValue placeholder="Selecionar Sub-Categorias de Resultado" />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {filteredResultSubCategories.map(subCategory => (
                        <MultiSelectItem key={subCategory.id} value={subCategory.name}>
                            {subCategory.name}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    )}

{/* Filtro de Sub-Categorias de Zona */}
{selectedCategories.length > 0 && (
        <MultiSelect values={selectedZoneSubCategories} onValuesChange={setSelectedZoneSubCategories}>
            <MultiSelectTrigger className="w-full max-w-[400px]">
                <MultiSelectValue placeholder="Selecionar Sub-Categorias de Zona" />
            </MultiSelectTrigger>
            <MultiSelectContent>
                <MultiSelectGroup>
                    {filteredZoneSubCategories.map(subCategory => (
                        <MultiSelectItem key={subCategory.id} value={subCategory.name}>
                            {subCategory.name}
                        </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
            </MultiSelectContent>
        </MultiSelect>
    )}

    <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleApply}>Aplicar Filtros</Button>
    </DialogFooter>
</DialogContent>
</Dialog>
);
}
