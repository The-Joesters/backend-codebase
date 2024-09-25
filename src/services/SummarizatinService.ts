import ApiError from "../middlewares/ApiError";
import fs from 'fs';
import axios from "axios";
import path from "path";
import { configDotenv } from "dotenv";

class Service {
    async ArticleSummarize(FilePath: string): Promise<string> {
        try {
            const filePath = path.join("./Articles", FilePath);

            const fileContent = await new Promise<string>((resolve, reject) => {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        return reject(new Error("Error reading the file"));
                    }
                    resolve(data);
                });
            });
            /*
               const response = await axios.post('https://localhost:3001/submitt', {
                   fileData: fileContent
               });
               console.log('Server response:', response.data);

               */
            // console.log('File content:', fileContent);

            // Return the first 20 characters of the file content
            return fileContent;
        } catch (err) {
            console.error(err);
            throw new ApiError("Error while fetching from database ", 501);
        }
    }
}

export default new Service();
