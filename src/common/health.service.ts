import { Injectable } from "@nestjs/common";
import { HealthCheckService, HttpHealthIndicator } from "@nestjs/terminus";
import { ParameterService } from "./parameter.service";
import { Parameters } from "./tools/parameters";

@Injectable()
export class HealthService {
    
    constructor(private parameterService:ParameterService, private health: HealthCheckService, private http: HttpHealthIndicator,) {
    
      }
    

      async isConnectionOnLine():Promise<boolean>{
        try
        {
            const c = await this.health.check([ () => this.http.pingCheck('Internet', Parameters.urlPingInternet ) ]);
            if(c.info['Internet'].status == 'up')
                return true;
        }catch(err) {
          console.log(err);
        }
        return false;
      
      }

      async isConnectionOnLineSin():Promise<boolean>{
        try
        {
            const c = await this.health.check([  () => this.http.pingCheck('SIN', Parameters.urlPingSin) ]);
            if(c.info['SIN'].status == 'up')
                return true;
        }catch(err) {
          console.log(err);
        }
        return false;
      
      }
}