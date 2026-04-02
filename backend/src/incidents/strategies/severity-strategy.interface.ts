import { Severity } from '@prisma/client';

export interface SeverityStrategy {
  readonly severity: Severity;
  matches(text: string): boolean;
}
