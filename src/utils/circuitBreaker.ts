export type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold?: number; // consecutive failures to open circuit
  successThreshold?: number; // consecutive successes to close from half-open
  cooldownPeriodMs?: number; // time to stay open before trying half-open
}

export default class CircuitBreaker {
  private failureThreshold: number;
  private successThreshold: number;
  private cooldownPeriodMs: number;

  private state: BreakerState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextTry = 0; // timestamp in ms

  constructor(opts?: CircuitBreakerOptions) {
    this.failureThreshold = opts?.failureThreshold ?? 5;
    this.successThreshold = opts?.successThreshold ?? 2;
    this.cooldownPeriodMs = opts?.cooldownPeriodMs ?? 30_000;
  }

  public allowRequest(): boolean {
    const now = Date.now();
    if (this.state === 'OPEN') {
      if (now >= this.nextTry) {
        this.state = 'HALF_OPEN';
        return true; // allow a trial request
      }
      return false;
    }
    return true;
  }

  public recordSuccess(): void {
    if (this.state === 'HALF_OPEN') {
      this.successCount += 1;
      if (this.successCount >= this.successThreshold) {
        this.close();
      }
    } else {
      this.resetCounts();
    }
  }

  public recordFailure(): void {
    this.failureCount += 1;
    if (this.state === 'HALF_OPEN' || this.failureCount >= this.failureThreshold) {
      this.open();
    }
  }

  private open(): void {
    this.state = 'OPEN';
    this.nextTry = Date.now() + this.cooldownPeriodMs;
    this.resetCounts();
  }

  private close(): void {
    this.state = 'CLOSED';
    this.resetCounts();
  }

  private resetCounts(): void {
    this.failureCount = 0;
    this.successCount = 0;
  }
}
