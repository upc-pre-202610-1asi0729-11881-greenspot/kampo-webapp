// Importa herramientas reactivas y de inyección de dependencias de Angular.
// - inject: permite inyectar servicios.
// - Injectable: registra la clase como servicio global.
// - signal: manejo reactivo de estado.
import { inject, Injectable, signal } from '@angular/core';

// Importa operadores y utilidades de RxJS.
// - finalize: ejecuta lógica al finalizar un Observable.
// - forkJoin: ejecuta múltiples Observables en paralelo.
import { finalize, forkJoin } from 'rxjs';

// Importa entidades del dominio del módulo de inventario.
import { Inventory } from '../domain/model/entities/inventory.entity';
import { OrderInput } from '../domain/model/entities/order-input.entity';
import { Supplier } from '../domain/model/entities/supplier.entity';

// Servicio de infraestructura encargado de consumir endpoints HTTP.
import { InventoryApi } from '../infrastructure/inventory-api';

// Store reactivo del módulo de inventario.
// Centraliza el estado y coordinación de operaciones relacionadas
// con inventarios, proveedores y pedidos de insumos.
@Injectable({ providedIn: 'root' })
export class InventoryStore {
  // Inyección del servicio API encargado de comunicarse con el backend.
  private readonly api = inject(InventoryApi);

  // Signal que almacena la lista de inventarios disponibles.
  readonly inventories = signal<Inventory[]>([]);

  // Signal que almacena la lista de proveedores registrados.
  readonly suppliers = signal<Supplier[]>([]);

  // Signal que almacena los pedidos de insumos realizados.
  readonly orders = signal<OrderInput[]>([]);

  // Signal que mantiene el inventario actualmente seleccionado.
  readonly selectedInventory = signal<Inventory | null>(null);

  // Signal utilizado para controlar estados de carga en la interfaz.
  readonly isLoading = signal(false);

  // Obtiene todos los inventarios desde el backend.
  getInventories(): void {
    // Activa el estado de carga.
    this.isLoading.set(true);

    // Solicita los inventarios al API.
    this.api
      .getInventories()

      // Finaliza el loading al terminar la operación.
      .pipe(finalize(() => this.isLoading.set(false)))

      // Maneja la respuesta.
      .subscribe({
        // Caso exitoso.
        next: (list) => this.inventories.set(list),

        // Caso de error.
        error: () => this.inventories.set([]),
      });
  }

  // Obtiene todos los proveedores registrados.
  getSuppliers(): void {
    this.isLoading.set(true);

    this.api
      .getSuppliers()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        // Actualiza el estado con los proveedores recibidos.
        next: (list) => this.suppliers.set(list),

        // Limpia la lista en caso de error.
        error: () => this.suppliers.set([]),
      });
  }

  // Obtiene todos los pedidos de insumos realizados.
  getOrders(): void {
    this.isLoading.set(true);

    this.api
      .getOrders()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        // Guarda los pedidos obtenidos.
        next: (list) => this.orders.set(list),

        // Limpia la colección en caso de error.
        error: () => this.orders.set([]),
      });
  }

  // Actualiza el stock disponible de un inventario específico.
  updateStock(inventoryId: number, quantity: number): void {
    this.isLoading.set(true);

    this.api
      .updateStock(inventoryId, quantity)
      .pipe(finalize(() => this.isLoading.set(false)))

      // Recibe el inventario actualizado desde el backend.
      .subscribe((updated) => {
        // Actualiza la lista reactiva de inventarios.
        this.inventories.update((list) =>
          list.map((i) => (i.getId() === updated.getId() ? updated : i)),
        );

        // Actualiza también el inventario seleccionado si coincide.
        this.selectedInventory.update((sel) => (sel?.getId() === updated.getId() ? updated : sel));
      });
  }

  // Registra un nuevo proveedor dentro del sistema.
  addSupplier(supplier: Supplier): void {
    this.isLoading.set(true);

    this.api
      .addSupplier(supplier)
      .pipe(finalize(() => this.isLoading.set(false)))

      // Agrega el proveedor creado a la lista reactiva.
      .subscribe((created) => {
        this.suppliers.update((list) => [...list, created]);
      });
  }

  // Realiza un pedido de insumos a un proveedor.
  orderInput(inventoryId: number, supplierId: number, quantity: number): void {
    this.isLoading.set(true);

    this.api
      .orderInput(inventoryId, supplierId, quantity)
      .pipe(finalize(() => this.isLoading.set(false)))

      // Agrega el nuevo pedido registrado.
      .subscribe((order) => {
        this.orders.update((list) => [...list, order]);
      });
  }

  // Registra la recepción de insumos previamente pedidos.
  receiveInput(orderId: number, quantity: number): void {
    this.isLoading.set(true);

    this.api
      .receiveInput(orderId, quantity)
      .pipe(finalize(() => this.isLoading.set(false)))

      // Actualiza el pedido recibido.
      .subscribe((updated) => {
        this.orders.update((list) =>
          list.map((o) => (o.getId() === updated.getId() ? updated : o)),
        );
      });
  }

  // Registra un nuevo insumo o inventario en el sistema.
  registerInput(inventory: Inventory): void {
    this.isLoading.set(true);

    this.api
      .registerInput(inventory)
      .pipe(finalize(() => this.isLoading.set(false)))

      // Agrega el inventario creado.
      .subscribe((created) => {
        this.inventories.update((list) => [...list, created]);
      });
  }

  // Selecciona un inventario específico dentro del estado reactivo.
  selectInventory(inventoryId: number): void {
    // Busca el inventario dentro de la lista actual.
    const found = this.inventories().find((i) => i.getId() === inventoryId) ?? null;

    // Actualiza el estado seleccionado.
    this.selectedInventory.set(found);
  }

  // Carga toda la información principal del módulo en paralelo.
  // Obtiene:
  // - inventarios,
  // - proveedores,
  // - pedidos.
  //
  // Es el método típico ejecutado al ingresar al módulo.
  loadAll(): void {
    this.isLoading.set(true);

    // Ejecuta múltiples requests simultáneamente.
    forkJoin({
      // Obtención de inventarios.
      inv: this.api.getInventories(),

      // Obtención de proveedores.
      sup: this.api.getSuppliers(),

      // Obtención de pedidos.
      ord: this.api.getOrders(),
    })
      // Finaliza el estado loading.
      .pipe(finalize(() => this.isLoading.set(false)))

      // Maneja la respuesta conjunta.
      .subscribe({
        // Caso exitoso.
        next: ({ inv, sup, ord }) => {
          // Actualiza todos los estados reactivos.
          this.inventories.set(inv);
          this.suppliers.set(sup);
          this.orders.set(ord);
        },

        // Caso de error.
        error: () => {
          // Limpia todas las colecciones.
          this.inventories.set([]);
          this.suppliers.set([]);
          this.orders.set([]);
        },
      });
  }
}
