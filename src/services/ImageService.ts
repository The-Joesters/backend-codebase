import prisma from "../prisma/prismaClient";
import firebaseService from "./firebaseService";
import FirebaseService from './firebaseService';


class ImageService {
    async addBookCoverImage(bookId:number, imgUrl:string) {
        try {
            const updatedBook = await prisma.books.update({
                where: { id: bookId },
                data: { cover_image: imgUrl }
            });
            if (!updatedBook) return null;
            return updatedBook;
        } catch (err) {
            console.error(err);
            throw new Error("Error while adding the book cover image");
        }
    }

    

    async addBadgeImage(badgeId:number, imgUrl:string) {
        try {
            const updatedBadge = await prisma.badges.update({
                where: { id: badgeId },
                data: { badge_image: imgUrl }
            });
            if (!updatedBadge) return null;
            return updatedBadge;
        } catch (err) {
            console.error(err);
            throw new Error("Error while adding the badge image");
        }
    }

    async addCharacterImage(characterId:number, imgUrl:string) {
        try {
            const updatedCharacter = await prisma.character.update({
                where: { id: characterId },
                data: { character_image: imgUrl }
            });
            if (!updatedCharacter) return null;
            return updatedCharacter;
        } catch (err) {
            console.error(err);
            throw new Error("Error while adding the character image");
        }
    }

    async addCustomizationItemImage(itemId:number, imgUrl:string) {
        try {
            const updatedItem = await prisma.customization_items.update({
                where: { id: itemId },
                data: { item_image: imgUrl }
            });
            if (!updatedItem) return null;
            return updatedItem;
        } catch (err) {
            console.error(err);
            throw new Error("Error while adding the customization item image");
        }
    }

    //logic for deleteion but needs a lof of changes! 


    // async deleteImage(imageUrl:string, modelName:string) {
    //     try {
    //         await firebaseService.deleteImageByUrl(imageUrl);
            
    //         let updatedRecord;
    //         switch(modelName) {
    //             case 'books':
    //                 updatedRecord = await prisma.books.update({
    //                     where: { cover_image: imageUrl },
    //                     data: { cover_image: null }
    //                 });
    //                 break;
    //             case 'users':
    //                 updatedRecord = await prisma.users.update({
    //                     where: { profile_image: imageUrl },
    //                     data: { profile_image: null }
    //                 });
    //                 break;
    //             case 'badges':
    //                 updatedRecord = await prisma.badges.update({
    //                     where: { badge_image: imageUrl },
    //                     data: { badge_image: null }
    //                 });
    //                 break;
    //             case 'character':
    //                 updatedRecord = await prisma.character.update({
    //                     where: { character_image: imageUrl },
    //                     data: { character_image: null }
    //                 });
    //                 break;
    //             case 'customization_items':
    //                 updatedRecord = await prisma.customization_items.update({
    //                     where: { item_image: imageUrl },
    //                     data: { item_image: null }
    //                 });
    //                 break;
    //             default:
    //                 throw new Error("Invalid model name");
    //         }
            
    //         if (!updatedRecord) return null;
    //         return updatedRecord;
    //     } catch (err) {
    //         console.error(err);
    //         throw new Error(`Error while deleting the image for ${modelName}`);
    //     }
    // }
}

export default new ImageService();