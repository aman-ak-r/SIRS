import { Injectable } from '@nestjs/common';
import { Severity } from '@prisma/client';
import { SeverityStrategy } from './severity-strategy.interface';

@Injectable()
export class LowSeverityStrategy implements SeverityStrategy {
  readonly severity = Severity.LOW;

  matches(_text: string): boolean {
    return true;
  }
}
