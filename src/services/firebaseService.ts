import admin from 'firebase-admin';
import path from 'path';
import url from 'url';
import serviceAccount from '../config/reading-shpere-firebase-adminsdk-nczwt-c2639686d3.json'
const bucketParam = 'gs://reading-shpere.appspot.com';

const serviceAccountTypes =serviceAccount as admin.ServiceAccount;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountTypes),
    storageBucket: bucketParam
});

function addVariableToFileName(filePath:string, variable:any, originalName:string) {
    const dir = path.dirname(filePath);
    const ext = path.extname(originalName);
    const baseName = path.basename(filePath, ext);
    const newFileName = `${baseName}-${variable}${ext}`;
    return path.join(dir, newFileName);
}

function getFilenameFromUrl(fullUrl:string) {
    const parsedUrl = new URL(fullUrl);
    const pathname = parsedUrl.pathname;
    const filePath = pathname.substring(pathname.indexOf('/', 1) + 1);
    return filePath;
}

class FirebaseService {
    async uploadImage(id:number, photoPath:string, originalName:string, folder = '') {
        const bucket = admin.storage().bucket();
        console.log("Uploading to Firebase Storage...");

        let photoName = addVariableToFileName(path.join(folder, path.basename(photoPath)), id, originalName);
        console.log("Final photo name: ", photoName);

        const destination = photoName;
        await bucket.upload(photoPath, {
            destination: destination,
        });
        
        return photoName;
    }

    async getPublicUrl(photoName:string) {
        try {
            const bucket = admin.storage().bucket();
            const file = bucket.file(photoName);

            await file.makePublic();

            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${photoName}`;
            console.log(publicUrl);
            return publicUrl;
        } catch (error) {
            console.error('Error getting public URL:', error);
            throw error;
        }
    }

    async deleteImageByUrl(publicUrl:string) {
        try {
            console.log("Deleting image from Firebase Storage: ", publicUrl);
            const filePath = getFilenameFromUrl(publicUrl);
            const bucket = admin.storage().bucket();
            const file = bucket.file(filePath);

            await file.delete();
            console.log(`Image at ${publicUrl} deleted successfully.`);
            return { message: `Image at ${publicUrl} deleted successfully.` };
        } catch (error) {
            console.error('Error deleting image:', error);
            throw new Error('Error deleting image from Firebase Storage');
        }
    }
}

export default new FirebaseService();
