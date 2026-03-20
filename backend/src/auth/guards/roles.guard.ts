import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    // ฟังก์ชันนี้จะรันอัตโนมัติ เพื่อตัดสินใจว่าจะให้ผ่าน (true) หรือเตะกลับ (false)
    canActivate(context: ExecutionContext) {
        // จังหวะสำคัญ: ยามหยิบเครื่องสแกน (reflector) ไปสแกนหาตรายาง (Roles)
        // บนเป้าหมายปลายทางที่ User กำลังจะไป (context.getHandler() คือตัวชี้ไปที่ getAll())
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return roles.includes(user?.role);
    }
    
}