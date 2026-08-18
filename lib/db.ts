import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
// 1. ສ້າງຟງັຊນັ Singleton ສາໍລບັການ Initialize Client
const prismaClientSingleton = () => {
const adapter = new PrismaMariaDb({
host: process.env.DB_HOST || "localhost",
port: Number(process.env.DB_PORT) || 3306,
user: process.env.DB_USER || "root",
password: process.env.DB_PASSWORD || "1234",
database: process.env.DB_NAME || "register_db",
connectionLimit: 5,
});
return new PrismaClient({ adapter });
};
// 2. ປະກາດ Global Type ໃຫ້TypeScript ຮ້ຈູ ກັ
declare global {
var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}
// 3. ເລືອກໃຊ້Instance ເກ່າົທ່ີມຢີູ່ຫຼືສ້າງໃຫມ່ (ປ້ອງກນັ Connection ເຕັມ)
const db = globalThis.prisma ?? prismaClientSingleton();
export default db;
// ຖາ້ບ່ໍແມນ່ Production ໃຫ້ເກບັ Instance ໄວ້ໃນ global ເພ່ືອຮອງຮບັ Hot Reload
if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;