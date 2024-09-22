import ApiError from "../middlewares/ApiError";
import prisma from "../prisma/prismaClient";

class Service{

    async func(){
        try{

        }catch(err){
            console.error(err);
            throw new ApiError("Error while fetching from database ",501);
        }
    }    
}

export default new Service();

