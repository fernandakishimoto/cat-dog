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
exports.SolicitacoesController = void 0;
const common_1 = require("@nestjs/common");
const admin_guard_1 = require("../../common/guards/admin.guard");
const list_solicitacoes_dto_1 = require("./dto/list-solicitacoes.dto");
const update_status_dto_1 = require("./dto/update-status.dto");
const solicitacoes_service_1 = require("./solicitacoes.service");
let SolicitacoesController = class SolicitacoesController {
    constructor(service) {
        this.service = service;
    }
    list(dto) {
        return this.service.list(dto);
    }
    getById(id) {
        return this.service.getById(id);
    }
    updateStatus(id, dto) {
        return this.service.updateStatus(id, dto);
    }
};
exports.SolicitacoesController = SolicitacoesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [list_solicitacoes_dto_1.ListSolicitacoesDto]),
    __metadata("design:returntype", void 0)
], SolicitacoesController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SolicitacoesController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_status_dto_1.UpdateStatusDto]),
    __metadata("design:returntype", void 0)
], SolicitacoesController.prototype, "updateStatus", null);
exports.SolicitacoesController = SolicitacoesController = __decorate([
    (0, common_1.Controller)('adoption-requests'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [solicitacoes_service_1.SolicitacoesService])
], SolicitacoesController);
//# sourceMappingURL=solicitacoes.controller.js.map