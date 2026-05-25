// Importa el tipo Routes de Angular Router.
// Se utiliza para definir las rutas de navegación del módulo.
import { Routes } from '@angular/router';

// Lazy loading del componente principal del módulo.
// Este componente funciona como contenedor o shell de navegación.
const shell = () =>
  import('./inventory-shell/inventory-shell').then((m) => m.InventoryShellComponent);

// Lazy loading de la vista principal de inventario.
const inventoryView = () =>
  import('./inventory-view-component/inventory-view-component').then(
    (m) => m.InventoryViewComponent,
  );

// Lazy loading del formulario de registro de inventario.
const inventoryForm = () =>
  import('./inventory-form-component/inventory-form-component').then(
    (m) => m.InventoryFormComponent,
  );

// Lazy loading de la lista de inventarios.
const inventoryList = () =>
  import('./inventory-list-component/inventory-list-component').then(
    (m) => m.InventoryListComponent,
  );

// Lazy loading del formulario de proveedores.
const supplierForm = () =>
  import('./supplier-form-component/supplier-form-component').then((m) => m.SupplierFormComponent);

// Lazy loading de la vista de contacto de proveedores.
const supplierContact = () =>
  import('./supplier-contact-view-component/supplier-contact-view-component').then(
    (m) => m.SupplierContactViewComponent,
  );

// Lazy loading del formulario de pedidos de insumos.
const orderInputForm = () =>
  import('./order-input-form-component/order-input-form-component').then(
    (m) => m.OrderInputFormComponent,
  );

// Lazy loading del dashboard de control de stock.
const stockDashboard = () =>
  import('./stock-dashboard-component/stock-dashboard-component').then(
    (m) => m.StockDashboardComponent,
  );

// Configuración de rutas del módulo Inventory Management.
//
// Define todas las vistas accesibles dentro del módulo,
// así como sus rutas hijas y navegación interna.
export const INVENTORY_MANAGEMENT_ROUTES: Routes = [
  // Ruta raíz del módulo.
  {
    path: '',

    // Carga el componente shell principal.
    loadComponent: shell,

    // Rutas hijas del módulo.
    children: [
      // Redirección inicial.
      // Cuando el usuario entra al módulo sin ruta específica,
      // se redirige automáticamente a "inventario".
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'inventario',
      },

      // Vista principal de inventarios.
      {
        path: 'inventario',
        loadComponent: inventoryView,
      },

      // Lista detallada de inventarios.
      {
        path: 'inventario/lista',
        loadComponent: inventoryList,
      },

      // Formulario para registrar nuevos inventarios.
      {
        path: 'inventario/registro',
        loadComponent: inventoryForm,
      },

      // Formulario para registrar nuevos proveedores.
      {
        path: 'proveedores/nuevo',
        loadComponent: supplierForm,
      },

      // Vista de contacto de proveedor específico.
      // ":id" representa un parámetro dinámico de ruta.
      {
        path: 'proveedores/:id/contacto',
        loadComponent: supplierContact,
      },

      // Vista para realizar pedidos de insumos.
      {
        path: 'pedidos',
        loadComponent: orderInputForm,
      },

      // Dashboard de monitoreo y estado de stock.
      {
        path: 'panel',
        loadComponent: stockDashboard,
      },
    ],
  },
];
