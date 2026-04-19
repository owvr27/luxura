import { Router } from 'express';
import { writeFile, mkdir, readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { adminOnly, authRequired } from '../middleware.js';
const router = Router();
// Directory for storing uploaded images
const PHOTOS_DIR = join(process.cwd(), 'photos');
// Ensure photos directory exists
async function ensurePhotosDir() {
    if (!existsSync(PHOTOS_DIR)) {
        await mkdir(PHOTOS_DIR, { recursive: true });
    }
}
// Initialize photos directory on startup
ensurePhotosDir().catch(console.error);
// Upload image from ESP32 camera
router.post('/api/images/upload', async (req, res) => {
    try {
        await ensurePhotosDir();
        // Get image data from request body (raw binary)
        const imageBuffer = Buffer.isBuffer(req.body)
            ? req.body
            : Buffer.from(req.body);
        if (imageBuffer.length === 0) {
            return res.status(400).json({ error: 'No image data provided' });
        }
        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `photo_${timestamp}.jpg`;
        const filepath = join(PHOTOS_DIR, filename);
        // Save image to disk
        await writeFile(filepath, imageBuffer);
        console.log(`✅ Image saved: ${filename} (${imageBuffer.length} bytes)`);
        res.json({
            status: 'OK',
            file: filename,
            size: imageBuffer.length,
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        console.error('❌ Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
// Get list of all uploaded images
router.get('/api/images', authRequired, async (_req, res) => {
    try {
        await ensurePhotosDir();
        const files = await readdir(PHOTOS_DIR);
        const imageFiles = files
            .filter((file) => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
            .map((file) => ({
            filename: file,
            url: `/api/images/${file}`,
            uploadedAt: file.replace('photo_', '').replace('.jpg', '').replace(/-/g, ':'),
        }))
            .sort((a, b) => b.filename.localeCompare(a.filename)); // Newest first
        res.json({
            images: imageFiles,
            count: imageFiles.length,
        });
    }
    catch (error) {
        console.error('❌ Error listing images:', error);
        res.status(500).json({ error: 'Failed to list images' });
    }
});
// Get specific image by filename
router.get('/api/images/:filename', authRequired, async (req, res) => {
    try {
        const { filename } = req.params;
        // Security: prevent directory traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        const filepath = join(PHOTOS_DIR, filename);
        if (!existsSync(filepath)) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const imageBuffer = await readFile(filepath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', imageBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.send(imageBuffer);
    }
    catch (error) {
        console.error('❌ Error serving image:', error);
        res.status(500).json({ error: 'Failed to serve image' });
    }
});
// Get latest uploaded image
router.get('/api/images/latest', authRequired, async (_req, res) => {
    try {
        await ensurePhotosDir();
        const files = await readdir(PHOTOS_DIR);
        const imageFiles = files
            .filter((file) => file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
            .sort()
            .reverse(); // Newest first
        if (imageFiles.length === 0) {
            return res.status(404).json({ error: 'No images found' });
        }
        const latestFile = imageFiles[0];
        const filepath = join(PHOTOS_DIR, latestFile);
        const imageBuffer = await readFile(filepath);
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', imageBuffer.length);
        res.send(imageBuffer);
    }
    catch (error) {
        console.error('❌ Error serving latest image:', error);
        res.status(500).json({ error: 'Failed to serve latest image' });
    }
});
// Delete image (admin only)
router.delete('/api/images/:filename', authRequired, adminOnly, async (req, res) => {
    try {
        const { filename } = req.params;
        // Security: prevent directory traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }
        const filepath = join(PHOTOS_DIR, filename);
        if (!existsSync(filepath)) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const { unlink } = await import('fs/promises');
        await unlink(filepath);
        res.json({ success: true, message: 'Image deleted' });
    }
    catch (error) {
        console.error('❌ Error deleting image:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});
export default router;
