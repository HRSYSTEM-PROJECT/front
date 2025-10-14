export interface Departmento {
  id?: string;
  nombre: string;
  descripcion: string;
}

export interface Posicion {
  id?: string;
  name: string;
  description: string;
  DepartamentoId: string;
}

export type TabType = "departamentos" | "posiciones";
