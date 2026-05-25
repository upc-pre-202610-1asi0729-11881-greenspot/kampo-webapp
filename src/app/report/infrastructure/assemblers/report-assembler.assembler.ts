import { ReportResource, ReportResponse } from '../responses/report-response.response';
import { Report } from '../../domain/model/entities/report.entity';
import { ReportType } from '../../domain/model/enums/report-type.enum';
import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ReportAssembler {
  toEntityFromResponse(response:ReportResponse):Report{
    return new Report(
      response.id,
      response.type as ReportType,
      response.fileUrl,
      response.usersId,
      response.seasonsId
    )
  }
  toEntityFromResource(entity:Report):ReportResource{
    const resource = new ReportResource();
    resource.type = entity.getType();
    resource.usersId = entity.getUsersId();
    resource.seasonsId = entity.getSeasonsId();
    return resource;
  }
}
