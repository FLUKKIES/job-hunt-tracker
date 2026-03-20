import { Reflector } from '@nestjs/core';
import { Role } from 'src/users/schemas/user.schema';
/**
 * เมื่อฟลุ๊คสั่งรันเซิร์ฟเวอร์ (ตอนกำลังบูตเครื่อง npm run start:dev):
    1. Node.js จะอ่านไฟล์ UsersController และสร้างฟังก์ชัน getAll() ขึ้นมาเก็บไว้ในหน่วยความจำ (RAM)
    2. ทันทีที่มันเห็นว่าฟลุ๊คพิมพ์ @Roles([Role.ADMIN]) วางไว้บนหัวฟังก์ชัน getAll()
    3. ตัว Decorator จะทำการเรียกใช้คำสั่งระดับลึกของ TypeScript คล้ายๆ แบบนี้ครับ:
        Reflect.defineMetadata('รหัสลับของRoles', [Role.ADMIN], ฟังก์ชัน_getAll)
    4. ความหมายคือ: มันเอาอาร์เรย์ [Role.ADMIN] เขียนใส่กระดาษโพสต์อิท แล้วเอาไป "แปะกาวซ่อนไว้ข้างหลัง" ตัวฟังก์ชัน getAll() ในหน่วยความจำครับ!

 *  สรุปตอนเก็บ: ข้อมูล Role ไม่ได้ถูกเซฟลง Database และไม่ได้ถูกส่งไปหน้าเว็บ แต่มันถูกฝังติดอยู่กับตัวแปรฟังก์ชันใน RAM ของเซิร์ฟเวอร์ตั้งแต่ตอนที่เซิร์ฟเวอร์เปิดขึ้นมาเลยครับ 
 */
export const Roles = Reflector.createDecorator<Role[]>();
