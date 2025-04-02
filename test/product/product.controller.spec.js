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
const product_controller_1 = require("../../src/product/product.controller");
const product_service_1 = require("../../src/product/product.service");
const common_1 = require("@nestjs/common");
const mockProduct = {
    id: 'uuid-123',
    name: 'Product Test',
    price: 10.5,
    stock: 100,
};
describe('ProductController', () => {
    let controller;
    let service;
    const mockProductService = {
        create: jest.fn().mockResolvedValue(mockProduct),
        findAll: jest.fn().mockResolvedValue([mockProduct]),
        findOne: jest.fn().mockResolvedValue(mockProduct),
        update: jest.fn().mockResolvedValue(mockProduct),
        remove: jest.fn().mockResolvedValue(undefined),
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            controllers: [product_controller_1.ProductController],
            providers: [{ provide: product_service_1.ProductService, useValue: mockProductService }],
        }).compile();
        controller = module.get(product_controller_1.ProductController);
        service = module.get(product_service_1.ProductService);
    }));
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('debería estar definido', () => {
        expect(controller).toBeDefined();
    });
    describe('create', () => {
        it('debe llamar a ProductService.create y retornar un producto', () => __awaiter(void 0, void 0, void 0, function* () {
            const dto = { name: 'Product Test', price: 10.5, stock: 100 };
            const product = yield controller.create(dto);
            expect(service.create).toHaveBeenCalledWith(dto);
            expect(product).toEqual(mockProduct);
        }));
    });
    describe('findAll', () => {
        it('debe llamar a ProductService.findAll y retornar un array de productos', () => __awaiter(void 0, void 0, void 0, function* () {
            const products = yield controller.findAll();
            expect(service.findAll).toHaveBeenCalled();
            expect(products).toEqual([mockProduct]);
        }));
    });
    describe('findOne', () => {
        it('debe llamar a ProductService.findOne y retornar un producto', () => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield controller.findOne('uuid-123');
            expect(service.findOne).toHaveBeenCalledWith('uuid-123');
            expect(product).toEqual(mockProduct);
        }));
        it('debe lanzar NotFoundException si el producto no existe', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(service, 'findOne').mockRejectedValue(new common_1.NotFoundException());
            yield expect(controller.findOne('nonexistent')).rejects.toThrow(common_1.NotFoundException);
        }));
    });
    describe('update', () => {
        it('debe llamar a ProductService.update y retornar el producto actualizado', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateDto = { name: 'Product Actualizado' };
            const product = yield controller.update('uuid-123', updateDto);
            expect(service.update).toHaveBeenCalledWith('uuid-123', updateDto);
            expect(product).toEqual(mockProduct);
        }));
    });
    describe('remove', () => {
        it('debe llamar a ProductService.remove y no retornar nada', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield controller.remove('uuid-123');
            expect(service.remove).toHaveBeenCalledWith('uuid-123');
            expect(response).toBeUndefined();
        }));
        it('debe lanzar NotFoundException si el producto no existe', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(service, 'remove').mockRejectedValue(new common_1.NotFoundException());
            yield expect(controller.remove('nonexistent')).rejects.toThrow(common_1.NotFoundException);
        }));
    });
});
