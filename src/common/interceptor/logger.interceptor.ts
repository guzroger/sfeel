import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Scope } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable({ scope: Scope.REQUEST })
export class LoggerInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    console.log('Before..');

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    console.log('AAAAA');

    console.log(req.value);
    console.log(res);

    return handler
      .handle()
      .pipe(tap(() => console.log(context.switchToHttp().getRequest().body)));
  }
}
