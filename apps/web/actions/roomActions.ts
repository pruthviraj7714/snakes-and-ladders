
import prisma from "@repo/db/client";


export const fetchActiveRooms = async () => {
    try {
        const rooms = await prisma.game.findMany({
            where : {
                status : "WAITING"
            }
        })

        return rooms;
    } catch (error : any) {
        throw new Error(error.message);
    }

}