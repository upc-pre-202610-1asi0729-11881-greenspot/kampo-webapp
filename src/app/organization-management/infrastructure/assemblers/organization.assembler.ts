import { OrganizationResponse } from '../responses/organization.response';
import { Organization } from '../../domain/model/organization.entity';

export class OrganizationAssembler {
  public static toEntityFromResponse(response: OrganizationResponse): Organization {
    return new Organization(
      response.id,
      response.name,
      response.ruc ?? '',
      response.address,
      response.phone ?? '',
      response.email ?? '',
    );
  }
}
