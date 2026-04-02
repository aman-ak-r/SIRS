import { Injectable } from '@nestjs/common';
import { Severity } from '@prisma/client';
import { SeverityStrategy } from './severity-strategy.interface';

@Injectable()
export class HighSeverityStrategy implements SeverityStrategy {
  readonly severity = Severity.HIGH;
  private readonly keywords = ['crash', 'down', 'failure'];

  matches(text: string): boolean {
    const normalized = text.toLowerCase();
    return this.keywords.some((keyword) => normalized.includes(keyword));
  }
}
