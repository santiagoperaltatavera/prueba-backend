"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const product_service_1 = require("../../src/product/product.service");
const typeorm_1 = require("@nestjs/typeorm");
const product_entity_1 = require("../../src/product/entities/product.entity");
const common_1 = require("@nestjs/common");
describe('ProductService', () => {
    let service;
    let repository;
    const mockProduct = {
        id: 'uuid-1',
        name: 'Product Test',
        price: 3.14,
        stock: 100,
    };
    const mockRepository = {
        create: jest.fn().mockImplementation(dto => (Object.assign(Object.assign({}, dto), { id: 'uuid-123' }))),
        save: jest.fn().mockResolvedValue(mockProduct),
        find: jest.fn().mockResolvedValue([mockProduct]),
        findOneBy: jest.fn().mockResolvedValue(mockProduct),
        delete: jest.fn().mockResolvedValue({ affected: 1, raw: [] }), // ✅ Agregado raw
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            providers: [
                product_service_1.ProductService,
                { provide: (0, typeorm_1.getRepositoryToken)(product_entity_1.Product), useValue: mockRepository },
            ],
        }).compile();
        service = module.get(product_service_1.ProductService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(product_entity_1.Product));
        // Resetear los mocks antes de cada prueba
        jest.restoreAllMocks();
    }));
    it('debería estar definido', () => {
        expect(service).toBeDefined();
    });
    it('create() debe guardar un producto', () => __awaiter(void 0, void 0, void 0, function* () {
        const dto = { name: 'Product Test', price: 3.14, stock: 100 };
        const product = yield service.create(dto);
        expect(repository.create).toHaveBeenCalledWith(dto);
        expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(dto));
        expect(product).toEqual(mockProduct);
    }));
    it('findAll() debe retornar un arreglo de productos', () => __awaiter(void 0, void 0, void 0, function* () {
        const products = yield service.findAll();
        expect(repository.find).toHaveBeenCalled();
        expect(products).toEqual([mockProduct]);
    }));
    it('findOne() debe retornar un producto por ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield service.findOne('uuid-123');
        expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-123' });
        expect(product).toEqual(mockProduct);
    }));
    it('findOne() debe lanzar NotFoundException si el producto no existe', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
        yield expect(service.findOne('nonexistent')).rejects.toThrow(common_1.NotFoundException);
    }));
    it('update() debe actualizar y retornar un producto', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateDto = { name: 'Product Actualizado' };
        const updatedProduct = Object.assign(Object.assign({}, mockProduct), updateDto);
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(mockProduct);
        jest.spyOn(repository, 'save').mockResolvedValue(updatedProduct);
        const product = yield service.update('uuid-123', updateDto);
        expect(repository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-123' });
        expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updatedProduct));
        expect(product).toEqual(updatedProduct);
    }));
    it('update() debe lanzar NotFoundException si el producto no existe', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
        yield expect(service.update('nonexistent', { name: 'Nuevo' })).rejects.toThrow(common_1.NotFoundException);
    }));
    it('remove() debe eliminar un producto', () => __awaiter(void 0, void 0, void 0, function* () {
        yield service.remove('uuid-123');
        expect(repository.delete).toHaveBeenCalledWith('uuid-123');
    }));
    it('remove() debe lanzar NotFoundException si falla la eliminación', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0, raw: [] });
        yield expect(service.remove('nonexistent')).rejects.toThrow(common_1.NotFoundException);
    }));
});
