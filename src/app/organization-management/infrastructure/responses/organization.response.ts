import { BaseResponse } from '../../../shared/infrastructure/base-response';

/**
 * The real backend (OrganizationResource) only returns { id, name, address }.
 * ruc, phone, email are kept here for frontend forward-compatibility but
 * default to empty string since the backend never sends them.
 */
export class OrganizationResponse extends BaseResponse {
  name: string;
  ruc: string;
  address: string;
  phone: string;
  email: string;

  constructor() {
    super(0);
    this.name = '';
    this.ruc = '';
    this.address = '';
    this.phone = '';
    this.email = '';
  }
}
