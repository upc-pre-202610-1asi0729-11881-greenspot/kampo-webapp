// Importa HttpClient de Angular.
// Se utiliza para realizar peticiones HTTP al backend.
import { HttpClient } from '@angular/common/http';

// Importa Injectable para registrar el servicio dentro
// del sistema de inyección de dependencias de Angular.
import { inject, Injectable } from '@angular/core';

// Importa herramientas RxJS.
// - Observable: representa flujos de datos asíncronos.
// - map: transforma respuestas recibidas.
import { map, Observable } from 'rxjs';

// Importa entidades del dominio del módulo de inventario.
import { Inventory } from '../domain/model/entities/inventory.entity';
import { OrderInput } from '../domain/model/entities/order-input.entity';
import { Supplier } from '../domain/model/entities/supplier.entity';

// Importa assemblers encargados de convertir:
// - respuestas HTTP,
// - recursos,
// - y entidades del dominio.
import { InventoryAssembler } from './assemblers/inventory-assembler.assembler';
import { OrderInputAssembler } from './assemblers/order-input-assembler.assembler';
import { SupplierAssembler } from './assemblers/supplier-assembler.assembler';

// Importa DTOs utilizados para respuestas HTTP.
import { InventoryResponse } from './responses/inventory-response.response';
import { OrderInputResponse } from './responses/order-input-response.response';
import { SupplierResponse } from './responses/supplier-response.response';
import { environment } from '../../../environments/environment';

// Servicio de infraestructura encargado de comunicarse
// con los endpoints REST relacionados al módulo de inventario.
//
// Implementa operaciones CRUD y transformación de datos
// entre backend y dominio.
@Injectable({ providedIn: 'root' })
export class InventoryApi {
  // Assembler utilizado para transformar inventarios.
  private readonly inventoryAssembler = new InventoryAssembler();

  // Assembler utilizado para transformar proveedores.
  private readonly supplierAssembler = new SupplierAssembler();

  // Assembler utilizado para transformar pedidos de insumos.
  private readonly orderAssembler = new OrderInputAssembler();
  //private readonly http = inject(HttpClient);

  // Endpoint principal de inventarios.
  private readonly inventoriesEndpoint =`${environment.apiBaseUrl}/inventories`;

  // Endpoint principal de proveedores.
  private readonly suppliersEndpoint =`${environment.apiBaseUrl}/suppliers`;

  // Endpoint principal de pedidos de insumos.
  private readonly ordersEndpoint =`${environment.apiBaseUrl}/orders`;

  // Constructor del servicio.
  // Inyecta HttpClient para realizar peticiones HTTP.
  constructor(private readonly http: HttpClient) {}

  // Obtiene todos los inventarios registrados.
  getInventories(): Observable<Inventory[]> {
    return (
      this.http

        // Realiza petición GET al endpoint de inventarios.
        .get<InventoryResponse[]>(this.inventoriesEndpoint)

        // Convierte DTOs del backend en entidades del dominio.
        .pipe(map((list) => list.map((dto) => this.inventoryAssembler.toEntityFromResponse(dto))))
    );
  }

  // Obtiene todos los proveedores registrados.
  getSuppliers(): Observable<Supplier[]> {
    return (
      this.http
        .get<SupplierResponse[]>(this.suppliersEndpoint)

        // Convierte respuestas HTTP en entidades Supplier.
        .pipe(map((list) => list.map((dto) => this.supplierAssembler.toEntityFromResponse(dto))))
    );
  }

  // Obtiene todos los pedidos de insumos realizados.
  getOrders(): Observable<OrderInput[]> {
    return (
      this.http
        .get<OrderInputResponse[]>(this.ordersEndpoint)

        // Convierte DTOs en entidades del dominio.
        .pipe(map((list) => list.map((dto) => this.orderAssembler.toEntityFromResponse(dto))))
    );
  }

  // Actualiza el stock de un inventario específico.
  updateStock(inventoryId: number, quantity: number): Observable<Inventory> {
    return (
      this.http

        // Realiza petición PATCH para actualizar stock.
        .patch<InventoryResponse>(`${this.inventoriesEndpoint}/${inventoryId}/stock`, { quantity })

        // Convierte la respuesta actualizada a entidad Inventory.
        .pipe(map((dto) => this.inventoryAssembler.toEntityFromResponse(dto)))
    );
  }

  // Registra un nuevo proveedor en el sistema.
  addSupplier(supplier: Supplier): Observable<Supplier> {
    // Convierte la entidad del dominio a recurso HTTP.
    const body = this.supplierAssembler.toResourceFromEntity(supplier);

    return (
      this.http

        // Realiza petición POST al endpoint de proveedores.
        .post<SupplierResponse>(this.suppliersEndpoint, body)

        // Convierte la respuesta en entidad Supplier.
        .pipe(map((dto) => this.supplierAssembler.toEntityFromResponse(dto)))
    );
  }

  // Realiza un nuevo pedido de insumos.
  orderInput(inventoryId: number, supplierId: number, quantity: number): Observable<OrderInput> {
    // Cuerpo de la petición HTTP.
    const body: {
      inventoryId: number;
      supplierId: number;
      quantity: number;
    } = {
      inventoryId,
      supplierId,
      quantity,
    };

    return (
      this.http

        // Realiza petición POST para registrar el pedido.
        .post<OrderInputResponse>(this.ordersEndpoint, body)

        // Convierte la respuesta en entidad OrderInput.
        .pipe(map((dto) => this.orderAssembler.toEntityFromResponse(dto)))
    );
  }

  // Registra la recepción parcial o total de un pedido.
  receiveInput(orderId: number, quantity: number): Observable<OrderInput> {
    const patchData = {
      status: 'RECEIVED'
    };

    return this.http.patch<OrderInputResponse>(`${environment.apiBaseUrl}/orders/${orderId}`, patchData)
      .pipe(
        // CAMBIO AQUÍ: this.orderAssembler
        map(response => this.orderAssembler.toEntityFromResponse(response))
      );
  }

  // Registra un nuevo inventario o insumo.
  registerInput(inventory: Inventory): Observable<Inventory> {
    // Convierte la entidad Inventory en un recurso serializable.
    const body = this.inventoryAssembler.toResourceFromEntity(inventory);

    return (
      this.http

        // Realiza petición POST para registrar inventario.
        .post<InventoryResponse>(this.inventoriesEndpoint, body)

        // Convierte la respuesta HTTP en entidad Inventory.
        .pipe(map((dto) => this.inventoryAssembler.toEntityFromResponse(dto)))
    );
  }

  deleteOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.ordersEndpoint}/${orderId}`);
  }

}
