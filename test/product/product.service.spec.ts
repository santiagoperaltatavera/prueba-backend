import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../src/product/product.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../../src/product/entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { DeleteResult } from 'typeorm';

describe('ProductService', () => {
    let service: ProductService;
    let repository: Repository<Product>;

    const mockProduct: Product = {
        id: 'uuid-1',
        name: 'Product Test',
        price: 3.14,
        stock: 100,
    };

    const mockRepository = {
        create: jest.fn().mockImplementation(dto => ({ ...dto, id: 'uuid-123' })),
        save: jest.fn().mockResolvedValue(mockProduct),
        find: jest.fn().mockResolvedValue([mockProduct]),
        findOneBy: jest.fn().mockResolvedValue(mockProduct),
        delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] } as DeleteResult),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                { provide: getRepositoryToken(Product), useValue: mockRepository },
            ],
        }).compile();

        service = module.get<ProductService>(ProductService);
        repository = module.get<Repository<Product>>(getRepositoryToken(Product));
        jest.restoreAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create()', () => {
        it('should create and return a product', async () => {
            const dto = { name: 'Product Test', price: 3.14, stock: 100 };
            const product = await service.create(dto);

            expect(repository.create).toHaveBeenCalledWith(dto);
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(dto));
            expect(product).toEqual(mockProduct);
        });
    });

    describe('findAll()', () => {
        it('should return an array of products', async () => {
            const products = await service.findAll();

            expect(repository.find).toHaveBeenCalled();
            expect(products).toEqual([mockProduct]);
        });
    });

    describe('findOne()', () => {
        it('should return a product by ID', async () => {
            const product = await service.findOne('uuid-123');

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-123' });
            expect(product).toEqual(mockProduct);
        });

        it('should throw NotFoundException if the product does not exist', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update()', () => {
        it('should update and return a product', async () => {
            const updateDto = { name: 'Updated Product' };
            const updatedProduct = { ...mockProduct, ...updateDto };

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockProduct);
            jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct);

            const product = await service.update('uuid-123', updateDto);

            expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-123' });
            expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updatedProduct));
            expect(product).toEqual(updatedProduct);
        });

        it('should throw NotFoundException if the product does not exist', async () => {
            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

            await expect(service.update('nonexistent', { name: 'New' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove()', () => {
        it('should delete a product', async () => {
            await service.remove('uuid-123');

            expect(repository.delete).toHaveBeenCalledWith('uuid-123');
        });

        it('should throw NotFoundException if deletion fails', async () => {
            jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });

            await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
        });
    });
});