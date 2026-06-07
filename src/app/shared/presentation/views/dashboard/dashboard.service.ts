import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface Metric {
  title: string;
  value: string;
  icon: string;
  indicator: string;
  indicatorColor: string;
  route: string;
}
export interface Activity {
  time: string;
  action: string;
  operator: string;
  status: string;
}
export interface SystemAlert {
  type: string;
  title: string;
  description: string;
  time: string;
}
export interface QuickAccess {
  label: string;
  icon: string;
  route: string;
  color: string;
}
export interface DashboardData {
  metrics: Metric[];
  recentActivity: Activity[];
  systemAlerts: SystemAlert[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<any>('http://localhost:3000/db').pipe(
      map((data) => this.parseData(data)),
      catchError(() => {
        const fallback = {
          organizations: [{}, {}],
          seasons: [{ status: 'ACTIVE' }],
          employees: [{}, {}],
          fieldOperations: [
            {
              purpose: 'Revisión de plagas',
              technician: 'Carlos Ruiz',
              visitDate: '2026-06-04T09:30:00Z',
            },
            {
              purpose: 'Ciclo de Riego #12',
              technician: 'R. Henderson',
              visitDate: '2026-06-04T08:42:00Z',
            },
          ],
          alerts: [
            { id: 1, title: 'Bajo nivel de humedad en Parcela A1', severity: 'HIGH' },
            { id: 2, title: 'Mantenimiento requerido en Cosechadora #108', severity: 'MEDIUM' },
          ],
        };
        return of(this.parseData(fallback));
      }),
    );
  }

  private parseData(data: any): DashboardData {
    const metrics: Metric[] = [
      {
        title: 'Organizaciones',
        value: (data.organizations?.length || 0).toString(),
        icon: 'corporate_fare',
        indicator: 'Registradas',
        indicatorColor: '#2e7d32',
        route: '/organization-management',
      },
      {
        title: 'Temporadas Activas',
        value: (data.seasons?.filter((s: any) => s.status === 'ACTIVE').length || 0).toString(),
        icon: 'eco',
        indicator: 'En curso',
        indicatorColor: '#1565c0',
        route: '/season-management',
      },
      {
        title: 'Alertas',
        value: (data.alerts?.length || 0).toString(),
        icon: 'notifications_active',
        indicator: 'Pendientes',
        indicatorColor: '#d32f2f',
        route: '/alert-management',
      },
      {
        title: 'Empleados',
        value: (data.employees?.length || 0).toString(),
        icon: 'people',
        indicator: 'En campo',
        indicatorColor: '#6a1b9a',
        route: '/employee-management',
      },
    ];

    const recentActivity: Activity[] = (data.fieldOperations || []).map((op: any) => {
      const dateObj = new Date(op.visitDate);
      const formattedDate = isNaN(dateObj.getTime())
        ? 'Reciente'
        : dateObj.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          });
      return {
        time: formattedDate,
        action: op.purpose,
        operator: op.technician,
        status: 'Completado',
      };
    });

    const systemAlerts: SystemAlert[] = (data.alerts || []).map((alert: any) => ({
      type:
        alert.severity === 'HIGH' ? 'critical' : alert.severity === 'MEDIUM' ? 'warning' : 'info',
      title: alert.title,
      description: 'Revisión técnica requerida según reglas del sistema.',
      time: 'Reciente',
    }));

    return { metrics, recentActivity, systemAlerts };
  }
}
