import { inject, Injectable, signal, computed } from '@angular/core';
import { Organization } from '../domain/model/organization.entity';
import { Fundo } from '../domain/model/fundo.entity';
import { Field } from '../domain/model/field.entity';
import { Crop } from '../domain/model/crop.entity';
import { OrganizationService } from '../infrastructure/services/organization.service';
import { OrganizationResponse } from '../infrastructure/responses/organization.response';
import { OrganizationAssembler } from '../infrastructure/assemblers/organization.assembler';

@Injectable({ providedIn: 'root' })
export class OrganizationStore {
  private readonly organizationService = inject(OrganizationService);

  readonly organizations = signal<Organization[]>([]);
  readonly fundos = signal<Fundo[]>([]);
  readonly fields = signal<Field[]>([]);
  readonly crops = signal<Crop[]>([]);
  readonly isLoading = signal<boolean>(false);

  readonly organizationTableData = computed(() =>
    this.organizations().map(o => ({
      id: o.getId(),
      name: o.getName(),
      ruc: o.getRuc(),
      address: o.getAddress(),
      phone: o.getPhone(),
      email: o.getEmail()
    }))
  );

  constructor() {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.isLoading.set(true);
    this.organizationService.getAll().subscribe({
      next: (responses: OrganizationResponse[]) => {
        const entities = responses.map(res => OrganizationAssembler.toEntityFromResponse(res));
        this.organizations.set(entities);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      },
      complete: () => this.isLoading.set(false)
    });
  }

  getOrganizationById(id: number) {
    return computed(() => this.organizations().find(o => o.getId() === id));
  }

  addOrganization(org: Organization): void {
    this.organizations.update(list => [...list, org]);
  }

  updateOrganization(org: Organization): void {
    this.organizations.update(list =>
      list.map(o => o.getId() === org.getId() ? org : o)
    );
  }
  deleteOrganization(id: number): void {
    this.organizationService.delete(id).subscribe({
      next: () => {
        this.organizations.update(list => list.filter(o => o.getId() !== id));
      }
    });
  }
}
