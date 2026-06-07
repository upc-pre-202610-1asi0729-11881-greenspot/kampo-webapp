export interface EmployeeResource {
  name: string;
  email: string;
  role: string;
  status: string; // <--- ¡SOLO TIENES QUE AGREGAR ESTA LÍNEA!
  fieldId: number;
}
