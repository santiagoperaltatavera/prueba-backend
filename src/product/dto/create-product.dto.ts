import {IsString, IsNotEmpty, IsNumber, Min, IsInt} from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNumber()
    @Min(0)
    price!: number;

    @IsNumber()
    @IsInt()
    @Min(0)
    stock!: number;
}
