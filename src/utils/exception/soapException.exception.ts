export class SoapException extends Error {
  constructor(message: string, status: number) {
    super(message);
  }
}
