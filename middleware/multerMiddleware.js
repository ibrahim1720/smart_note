import multer from "multer";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";
import { nanoid } from "nanoid";

export const multerMiddleware = ({
                                     filePath = "general",
                                     allowedExtensions = [
                                         "image/jpeg",
                                         "image/png",
                                         "image/jpg",
                                         "image/webp",
                                         "image/bmp",
                                         "image/jpg"
                                     ],
                                 }) => {
    const destinationPath = path.resolve(`./uploads/${filePath}`);
    // check if the folder exists
    if (!fs.existsSync(destinationPath)) {

        fs.mkdirSync(destinationPath, { recursive: true });
    }
    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, destinationPath);
        },

        filename: (req, file, cb) => {
            const now = DateTime.now().toFormat("yyyy-MM-dd");
            const uniqueString = nanoid(4);
            let baseName = `${now}_${uniqueString}_${file.originalname}`;
            let finalName = baseName;
            let counter = 1;

            while (fs.existsSync(path.join(destinationPath, finalName))) {
                finalName = `${now}_${uniqueString}_${counter}_${file.originalname}`;
                counter++;
            }

            cb(null, finalName);
        },
    });
    const fileFilter = (req, file, cb) => {
        //to string function
        if (allowedExtensions.includes(file.mimetype)) {
            return cb(null, true);
        }

        cb(
            null,
            false
        );
    };

    return multer({ fileFilter, storage });
};

export const multerHost = ({ allowedExtensions = extensions.Images }) => {
    const storage = multer.diskStorage({});

    // fileFilter
    const fileFilter = (req, file, cb) => {
        if (allowedExtensions.includes(file.mimetype)) {
            return cb(null, true);
        }

        cb(
            null,
            false
        );
    };

    return multer({ fileFilter, storage });
};