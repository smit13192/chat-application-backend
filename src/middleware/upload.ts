import fs from 'fs';
import multer, { diskStorage } from 'multer';
import { ApiError } from '../utils/api.error';

const fileFilter = (_req: any, file: any, callback: any) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {
        callback(null, true);
    } else {
        callback(new ApiError(400, "Image uploaded is not of type jpg/jpeg or png"), false);
    }
}

const storage = diskStorage({
    destination(req, _file, callback) {
        const path = `./uploads/${(req as any).user._id}`;
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
        callback(null, path);
    },
    filename(_req, file, callback) {
        callback(null, `${Date.now()}-${file.originalname}`);
    },
});

export default multer({ storage, fileFilter });