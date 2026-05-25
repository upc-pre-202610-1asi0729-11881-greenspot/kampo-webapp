import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { environment } from '../../../environments/environment';
import { Alert } from '../domain/model/alert.entity';
import { AlertRule } from '../domain/model/alert-rule.entity';
import { AlertAssembler } from './assemblers/alert.assembler';
import { AlertRuleAssembler } from './assemblers/alert-rule.assembler';
import { AlertResponse } from './responses/alert.response';
import { AlertRuleResponse } from './responses/alert-rule.response';
import { AlertResource } from './responses/alert.resource';

@Injectable({ providedIn: 'root' })
export class AlertApi extends BaseApi {
  private readonly alertsEndpoint = `${environment.apiBaseUrl}/alerts`;
  private readonly alertRulesEndpoint = `${environment.apiBaseUrl}/alerts_rules`;

  constructor(
    private alertAssembler: AlertAssembler,
    private alertRuleAssembler: AlertRuleAssembler,
  ) { super(); }

  getAlerts(): Observable<Alert[]> {
    return this.get<AlertResponse[]>(this.alertsEndpoint).pipe(
      map(responses => this.alertAssembler.toEntitiesFromResponse(responses))
    );
  }

  getAlertRules(): Observable<AlertRule[]> {
    return this.get<AlertRuleResponse[]>(this.alertRulesEndpoint).pipe(
      map(responses => this.alertRuleAssembler.toEntitiesFromResponse(responses))
    );
  }

  sendAlert(resource: AlertResource): Observable<Alert> {
    return this.post<AlertResponse>(this.alertsEndpoint, resource).pipe(
      map(r => this.alertAssembler.toEntityFromResponse(r))
    );
  }

  markAlertRead(alertId: number): Observable<Alert> {
    return this.put<AlertResponse>(`${this.alertsEndpoint}/${alertId}`, { isRead: true }).pipe(
      map(r => this.alertAssembler.toEntityFromResponse(r))
    );
  }
}
