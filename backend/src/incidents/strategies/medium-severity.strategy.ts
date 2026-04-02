import { Injectable } from '@nestjs/common';
import { Severity } from '@prisma/client';
import { SeverityStrategy } from './severity-strategy.interface';

@Injectable()
export class MediumSeverityStrategy implements SeverityStrategy {
  readonly severity = Severity.MEDIUM;
  private readonly keywords = ['slow', 'delay'];

  matches(text: string): boolean {
    const normalized = text.toLowerCase();
    return this.keywords.some((keyword) => normalized.includes(keyword));
  }
}
