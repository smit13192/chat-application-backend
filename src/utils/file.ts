import fs from 'fs';

export function deleteFile(file: string) {
    if (file == 'uploads/kakashi.jpeg') return;
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}