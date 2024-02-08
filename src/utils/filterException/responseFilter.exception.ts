import { HttpException } from '@nestjs/common';

export class ResponseFilterException extends HttpException {
  constructor(message: string, status: number) {
    super(message, status);
  }
}
