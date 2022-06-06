import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";

export class TransformInterceptor implements NestInterceptor{
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any>{
        return next.handle().pipe(map(user => {
           if(user){
            const {id, username, token} = user
            return {
                id,
                username,
                token
            }
           }
        }))
    }
}