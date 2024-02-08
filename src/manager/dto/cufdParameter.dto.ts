import { ApiProperty } from "@nestjs/swagger";
import { GeneralSystemParameterDto } from "./generalSystemParameter.dto";

export class CufdParameterDto extends GeneralSystemParameterDto {
    @ApiProperty({ type: String, examples: [ { "Example 1": {"value": "Y" } }]})
    force:string
}