export class ValidationError extends Error {
  public status: number;
  public details: any;
  constructor(message: string, details: any) {
    super(message);
    this.name = 'ValidationError';
    this.status = 400;
    this.details = details;
  }
}
