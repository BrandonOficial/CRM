// contexts/inventory-context.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  price: number;
  supplier: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem, "id" | "lastUpdated" | "status">) => void;
  editItem: (
    id: string,
    item: Omit<InventoryItem, "id" | "lastUpdated" | "status">
  ) => void;
  deleteItem: (id: string) => void;
  getMetrics: () => {
    totalItems: number;
    lowStockItems: number;
    totalValue: number;
    turnoverRate: number;
  };
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

function getStatusColor(
  quantity: number,
  minQuantity: number
): InventoryItem["status"] {
  if (quantity === 0) return "out-of-stock";
  if (quantity <= minQuantity) return "low-stock";
  return "in-stock";
}

const initialItems: InventoryItem[] = [
  {
    id: "1",
    name: "Notebook Dell Inspiron",
    category: "Eletrônicos",
    sku: "DELL-INS-001",
    quantity: 15,
    minQuantity: 5,
    price: 2500.0,
    supplier: "Dell Brasil",
    lastUpdated: "26/09/2025",
    status: "in-stock",
  },
  {
    id: "2",
    name: "Mouse Logitech MX3",
    category: "Periféricos",
    sku: "LOG-MX3-002",
    quantity: 3,
    minQuantity: 10,
    price: 299.9,
    supplier: "Logitech",
    lastUpdated: "25/09/2025",
    status: "low-stock",
  },
  {
    id: "3",
    name: "Teclado Mecânico Razer",
    category: "Periféricos",
    sku: "RAZ-KB-003",
    quantity: 0,
    minQuantity: 8,
    price: 450.0,
    supplier: "Razer",
    lastUpdated: "24/09/2025",
    status: "out-of-stock",
  },
  {
    id: "4",
    name: 'Monitor Samsung 24"',
    category: "Eletrônicos",
    sku: "SAM-M24-004",
    quantity: 8,
    minQuantity: 3,
    price: 899.9,
    supplier: "Samsung",
    lastUpdated: "26/09/2025",
    status: "in-stock",
  },
  {
    id: "5",
    name: "Cabo HDMI 2.1",
    category: "Cabo e Conectores",
    sku: "CAB-HDMI-005",
    quantity: 2,
    minQuantity: 15,
    price: 45.0,
    supplier: "TechCables",
    lastUpdated: "23/09/2025",
    status: "low-stock",
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);

  const addItem = (
    newItem: Omit<InventoryItem, "id" | "lastUpdated" | "status">
  ) => {
    const item: InventoryItem = {
      ...newItem,
      id: Date.now().toString(),
      lastUpdated: new Date().toLocaleDateString("pt-BR"),
      status: getStatusColor(newItem.quantity, newItem.minQuantity),
    };
    setItems((prev) => [...prev, item]);
  };

  const editItem = (
    id: string,
    updatedItem: Omit<InventoryItem, "id" | "lastUpdated" | "status">
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...updatedItem,
              id,
              lastUpdated: new Date().toLocaleDateString("pt-BR"),
              status: getStatusColor(
                updatedItem.quantity,
                updatedItem.minQuantity
              ),
            }
          : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getMetrics = () => {
    const totalItems = items.length;
    const lowStockItems = items.filter(
      (item) => item.quantity <= item.minQuantity && item.quantity > 0
    ).length;
    const totalValue = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Cálculo simplificado da taxa de rotatividade
    // Baseado na proporção de itens que têm movimento (não estão em estoque baixo ou zerado)
    const activeItems = items.filter(
      (item) => item.quantity > item.minQuantity
    ).length;
    const turnoverRate =
      totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0;

    return {
      totalItems,
      lowStockItems,
      totalValue,
      turnoverRate,
    };
  };

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        editItem,
        deleteItem,
        getMetrics,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
