import { error } from "console";
import ApiError from "../middlewares/ApiError";
import prisma from "../prisma/prismaClient";

class articlesService {
    isMediumWebsite(link: string) {
        try {
            const re = /medium.com/i;
            if (link.search(re) != -1) {
                return true;
            } else {
                throw (error);
            }
        } catch (err) {
            throw new ApiError("Link provided is not Medium website", 501);
        }
    }

}

export default new articlesService();