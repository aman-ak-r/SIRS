import { Injectable } from '@nestjs/common';
import { Severity } from '@prisma/client';
import { HighSeverityStrategy } from './strategies/high-severity.strategy';
import { MediumSeverityStrategy } from './strategies/medium-severity.strategy';
import { LowSeverityStrategy } from './strategies/low-severity.strategy';
import { SeverityStrategy } from './strategies/severity-strategy.interface';

@Injectable()
export class SeverityAssignerService {
  private readonly strategies: SeverityStrategy[];

  constructor(
    highStrategy: HighSeverityStrategy,
    mediumStrategy: MediumSeverityStrategy,
    lowStrategy: LowSeverityStrategy,
  ) {
    // Order matters: first match wins.
    this.strategies = [highStrategy, mediumStrategy, lowStrategy];
  }

  assignSeverity(title: string, description: string): Severity {
    const text = `${title} ${description}`;
    const strategy = this.strategies.find((item) => item.matches(text));
    return strategy?.severity ?? Severity.LOW;
  }
}
