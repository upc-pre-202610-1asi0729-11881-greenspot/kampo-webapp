import { environment } from '../../../environments/environment';

export class BaseApiEndpoint {
  protected buildPath(...segments: string[]): string {
    const base = environment.apiBaseUrl;
    const cleanSegments = segments.map(s => s.replace(/^\/|\/$/g, ''));
    return [base, ...cleanSegments].join('/');
  }
}
