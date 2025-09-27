// components/inventory-table.tsx
"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { InventoryForm } from "@/components/inventory-form";
import { useInventory, type InventoryItem } from "@/contexts/inventory-context";

function getStatusBadge(status: InventoryItem["status"]) {
  switch (status) {
    case "in-stock":
      return (
        <Badge className="bg-green-500/10 text-green-500">Em Estoque</Badge>
      );
    case "low-stock":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-500">
          Estoque Baixo
        </Badge>
      );
    case "out-of-stock":
      return <Badge className="bg-red-500/10 text-red-500">Sem Estoque</Badge>;
  }
}

function getStatusColor(
  quantity: number,
  minQuantity: number
): InventoryItem["status"] {
  if (quantity === 0) return "out-of-stock";
  if (quantity <= minQuantity) return "low-stock";
  return "in-stock";
}

export function InventoryTable() {
  const { items, addItem, editItem, deleteItem } = useInventory();
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleAddItem = (
    newItem: Omit<InventoryItem, "id" | "lastUpdated" | "status">
  ) => {
    addItem(newItem);
  };

  const handleEditItem = (
    id: string,
    updatedItem: Omit<InventoryItem, "id" | "lastUpdated" | "status">
  ) => {
    editItem(id, updatedItem);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    deleteItem(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Itens do Estoque</h2>
        <InventoryForm onAddItem={handleAddItem} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-xs font-medium">
                      {item.name.charAt(0)}
                    </div>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      Mín: {item.minQuantity}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="font-mono text-sm">{item.sku}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      item.quantity <= item.minQuantity
                        ? "text-yellow-500 font-medium"
                        : ""
                    }
                  >
                    {item.quantity}
                  </span>
                  {item.quantity <= item.minQuantity && (
                    <span className="text-xs text-yellow-500">⚠️</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                R${" "}
                {item.price.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>{item.supplier}</TableCell>
              <TableCell>
                {getStatusBadge(
                  getStatusColor(item.quantity, item.minQuantity)
                )}
              </TableCell>
              <TableCell>{item.lastUpdated}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingItem(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingItem && (
        <InventoryForm editItem={editingItem} onEditItem={handleEditItem} />
      )}
    </div>
  );
}
