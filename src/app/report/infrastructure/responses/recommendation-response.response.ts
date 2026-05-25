export class RecommendationResponse {
  id!: number;
  priority!: string;
  status!: string;
  createdAt!: Date;
  implementedAt!: Date | null;
  reportsId!: number;
}

export class RecommendationResource {
  reportsId!: number;
  priority!: string;
}
