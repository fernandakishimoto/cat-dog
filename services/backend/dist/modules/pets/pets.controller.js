"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetsController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const create_pet_dto_1 = require("./dto/create-pet.dto");
const list_pets_dto_1 = require("./dto/list-pets.dto");
const pets_service_1 = require("./pets.service");
let PetsController = class PetsController {
    constructor(service) {
        this.service = service;
    }
    list(dto) {
        return this.service.list(dto);
    }
    getById(id) {
        return this.service.getById(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
};
exports.PetsController = PetsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_pets_dto_1.ListPetsDto]),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "getById", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pet_dto_1.CreatePetDto]),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "create", null);
exports.PetsController = PetsController = __decorate([
    (0, common_1.Controller)('pets'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [pets_service_1.PetsService])
], PetsController);
//# sourceMappingURL=pets.controller.js.map