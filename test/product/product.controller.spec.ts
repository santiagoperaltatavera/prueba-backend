import {Test, TestingModule} from '@nestjs/testing';
import {ProductController} from '../../src/product/product.controller';
import {ProductService} from '../../src/product/product.service';
import {CreateProductDto} from '../../src/product/dto/create-product.dto';
import {UpdateProductDto} from '../../src/product/dto/update-product.dto';
import {BadRequestException, NotFoundException, ValidationPipe} from '@nestjs/common';

const mockProduct = {
    id: 'uuid-123',
    name: 'Product Test',
    price: 10.5,
    stock: 100,
};

describe('ProductController', () => {
    let controller: ProductController;
    let service: ProductService;
    let validationPipe: ValidationPipe;

    const mockProductService = {
        create: jest.fn().mockResolvedValue(mockProduct),
        findAll: jest.fn().mockResolvedValue([mockProduct]),
        findOne: jest.fn().mockResolvedValue(mockProduct),
        update: jest.fn().mockResolvedValue(mockProduct),
        remove: jest.fn().mockResolvedValue(undefined),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [{provide: ProductService, useValue: mockProductService}],
        }).compile();

        controller = module.get<ProductController>(ProductController);
        service = module.get<ProductService>(ProductService);
        validationPipe = new ValidationPipe();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call ProductService.create and return a product', async () => {
            const dto: CreateProductDto = {name: 'Product Test', price: 10.5, stock: 100};
            const product = await controller.create(dto);
            expect(service.create).toHaveBeenCalledWith(dto);
            expect(product).toEqual(mockProduct);
        });

        it('should throw BadRequestException if name is empty', async () => {
            const dto: CreateProductDto = {name: '', price: 10.5, stock: 10};

            await expect(validationPipe.transform(dto, {
                metatype: CreateProductDto,
                type: 'body'
            })).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if price is negative', async () => {
            const dto: CreateProductDto = {name: 'Product X', price: -5, stock: 10};
            await expect(validationPipe.transform(dto, {
                metatype: CreateProductDto,
                type: 'body'
            })).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if stock is decimal', async () => {
            const dto: CreateProductDto = {name: 'Product Y', price: 15.99, stock: 2.5};
            await expect(validationPipe.transform(dto, {
                metatype: CreateProductDto,
                type: 'body'
            })).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if required fields are missing', async () => {
            const dto = {}
            await expect(validationPipe.transform(dto, {
                metatype: CreateProductDto,
                type: 'body'
            })).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should call ProductService.findAll and return an array of products', async () => {
            const products = await controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
            expect(products).toEqual([mockProduct]);
        });
    });

    describe('findOne', () => {
        it('should call ProductService.findOne and return a product', async () => {
            const product = await controller.findOne('uuid-123');
            expect(service.findOne).toHaveBeenCalledWith('uuid-123');
            expect(product).toEqual(mockProduct);
        });

        it('should throw NotFoundException if product does not exist', async () => {
            jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());
            await expect(controller.findOne('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should call ProductService.update and return updated product', async () => {
            const updateDto: UpdateProductDto = {name: 'Updated Product'};
            const product = await controller.update('uuid-123', updateDto);
            expect(service.update).toHaveBeenCalledWith('uuid-123', updateDto);
            expect(product).toEqual(mockProduct);
        });

        it('should throw BadRequestException if price is negative in update', async () => {
            const updateDto: UpdateProductDto = {price: -10};

            await expect(
                validationPipe.transform(updateDto, {metatype: UpdateProductDto, type: 'body'})
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('remove', () => {
        it('should call ProductService.remove and return undefined', async () => {
            const response = await controller.remove('uuid-123');
            expect(service.remove).toHaveBeenCalledWith('uuid-123');
            expect(response).toBeUndefined();
        });

        it('should throw NotFoundException if product does not exist', async () => {
            jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());
            await expect(controller.remove('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });
});