import { Request, Response ,NextFunction} from 'express';
import ImageService from '../services/ImageService';
import firebaseService from '../services/firebaseService';

export const addBookCoverImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let { bookId }: any = req.params;
        const { file } = req;
        bookId = parseInt(bookId);

        const photoName = await firebaseService.uploadImage(bookId, file!.path, file!.originalname, 'book-covers');
        const publicUrl = await firebaseService.getPublicUrl(photoName);
        console.log(photoName);
        console.log(publicUrl);
        const updatedBook = await ImageService.addBookCoverImage(bookId, publicUrl);

        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add book cover image' });
    }
}