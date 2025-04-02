import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {DeleteResult, Repository} from 'typeorm';
import {Product} from './entities/product.entity';
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {
    }

    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        const products: Product[] = await this.productRepository.find();
        return products ?? [];
    }


    async findOne(id: string): Promise<Product> {
        const product: Product | null = await this.productRepository.findOneBy({id});
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
        const product: Product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }

    async remove(id: string): Promise<void> {
        const result: DeleteResult = await this.productRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
    }
}
