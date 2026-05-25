import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OrganizationStore } from '../../../application/organization.store';
import { Organization } from '../../../domain/model/organization.entity';
import { MatIconModule } from '@angular/material/icon';
import { OrganizationService } from '../../../infrastructure/services/organization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organization-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './organization-form.html',
  styleUrl: './organization-form.css'
})
export class OrganizationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  public store = inject(OrganizationStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private organizationService = inject(OrganizationService); // Inyección vital

  form: FormGroup = this.fb.group({
    id: [0],
    name: ['', Validators.required],
    ruc: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],
    address: [''],
    phone: [''],
    email: ['', Validators.email]
  });

  isEdit = false;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      const org = this.store.organizations().find(o => o.getId() === +id);
      if (org) {
        this.form.patchValue({
          id: org.getId(),
          name: org.getName(),
          ruc: org.getRuc(),
          address: org.getAddress(),
          phone: org.getPhone(),
          email: org.getEmail()
        });
      }
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const val = this.form.value;
    const entity = new Organization(val.id, val.name, val.ruc, val.address, val.phone, val.email);

    if (this.isEdit) {
      this.organizationService.update(val.id, val).subscribe({
        next: () => {
          this.store.updateOrganization(entity);
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      const { id, ...newOrg } = val;
      this.organizationService.create(newOrg).subscribe({
        next: (response: any) => {
          const entityWithId = new Organization(response.id, val.name, val.ruc, val.address, val.phone, val.email);
          this.store.addOrganization(entityWithId);
          this.router.navigate(['/']);
        },
        error: (err) => console.error('Error al guardar:', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}
