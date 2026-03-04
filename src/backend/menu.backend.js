import express from 'express';
import { existsSync, mkdirSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import multer from 'multer';

const router = express.Router();

// Setup multer for file uploads
const uploadDir = path.resolve(process.cwd(), 'public', 'uploads');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `menu-${timestamp}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

const MENU_ITEMS_FILE_PATH = path.resolve(process.cwd(), 'data', 'menu-items.json');

const ensureMenuFile = async () => {
  if (!existsSync(MENU_ITEMS_FILE_PATH)) {
    await writeFile(MENU_ITEMS_FILE_PATH, '[]', 'utf-8');
  }
};

const readMenuItems = async () => {
  await ensureMenuFile();
  const raw = await readFile(MENU_ITEMS_FILE_PATH, 'utf-8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
};

const writeMenuItems = async (items) => {
  await writeFile(MENU_ITEMS_FILE_PATH, `${JSON.stringify(items, null, 2)}\n`, 'utf-8');
};

router.get('/', async (_req, res) => {
  try {
    const items = await readMenuItems();
    return res.json(items);
  } catch (error) {
    console.error('Read menu items error:', error);
    return res.status(500).json({ message: 'Failed to fetch menu items.' });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /api/menu-items - req.body:', req.body);
    console.log('POST /api/menu-items - req.file:', req.file ? 'file received' : 'no file');
    
    const requesterRole = req.header('X-User-Role');

    if (requesterRole !== 'admin') {
      // Clean up uploaded file if auth fails
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(403).json({ message: 'Only admin can add menu items.' });
    }

    const {
      name = '',
      description = '',
      category = '',
      price
    } = req.body || {};

    const trimmedName = String(name).trim();
    const trimmedDescription = String(description).trim();
    const trimmedCategory = String(category).trim();
    const isPriceMissing = price === '' || price === null || price === undefined;
    const parsedPrice = Number(price);

    if (!trimmedName || !trimmedCategory || isPriceMissing) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({
        message: 'Name, category, and price are required.'
      });
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    }

    const items = await readMenuItems();
    const nextId = items.reduce((maxId, item) => {
      const currentId = Number(item?.id) || 0;
      return currentId > maxId ? currentId : maxId;
    }, 0) + 1;

    // Use uploaded file path or empty string
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newItem = {
      id: nextId,
      name: trimmedName,
      imageUrl,
      description: trimmedDescription,
      category: trimmedCategory,
      price: Number(parsedPrice.toFixed(2))
    };

    items.push(newItem);
    await writeMenuItems(items);

    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Create menu item error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      const fs = await import('node:fs/promises');
      await fs.unlink(req.file.path).catch(() => {});
    }
    return res.status(500).json({ message: error?.message || 'Failed to add menu item.' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const requesterRole = req.header('X-User-Role');

    if (requesterRole !== 'admin') {
      // Clean up uploaded file if auth fails
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(403).json({ message: 'Only admin can edit menu items.' });
    }

    const itemId = Number(req.params.id);
    if (Number.isNaN(itemId)) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({ message: 'Invalid item ID.' });
    }

    const {
      name = '',
      description = '',
      category = '',
      price
    } = req.body || {};

    const trimmedName = String(name).trim();
    const trimmedDescription = String(description).trim();
    const trimmedCategory = String(category).trim();
    const isPriceMissing = price === '' || price === null || price === undefined;
    const parsedPrice = Number(price);

    if (!trimmedName || !trimmedCategory || isPriceMissing) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({
        message: 'Name, category, and price are required.'
      });
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      // Clean up uploaded file if validation fails
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(400).json({ message: 'Price must be a valid non-negative number.' });
    }

    const items = await readMenuItems();
    const itemIndex = items.findIndex((item) => Number(item?.id) === itemId);

    if (itemIndex === -1) {
      // Clean up uploaded file if item not found
      if (req.file) {
        const fs = await import('node:fs/promises');
        await fs.unlink(req.file.path).catch(() => {});
      }
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    // Delete old image if a new one is uploaded
    let imageUrl = items[itemIndex].imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
      
      // Delete old image file if it exists
      const oldImagePath = items[itemIndex].imageUrl;
      if (oldImagePath && oldImagePath.startsWith('/uploads/')) {
        const fs = await import('node:fs/promises');
        const fullPath = path.resolve(process.cwd(), 'public', oldImagePath);
        await fs.unlink(fullPath).catch(() => {});
      }
    }

    items[itemIndex] = {
      id: itemId,
      name: trimmedName,
      imageUrl,
      description: trimmedDescription,
      category: trimmedCategory,
      price: Number(parsedPrice.toFixed(2))
    };

    await writeMenuItems(items);

    return res.json(items[itemIndex]);
  } catch (error) {
    console.error('Update menu item error:', error);
    // Clean up uploaded file on error
    if (req.file) {
      const fs = await import('node:fs/promises');
      await fs.unlink(req.file.path).catch(() => {});
    }
    return res.status(500).json({ message: error?.message || 'Failed to update menu item.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const requesterRole = req.header('X-User-Role');

    if (requesterRole !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete menu items.' });
    }

    const itemId = Number(req.params.id);
    if (Number.isNaN(itemId)) {
      return res.status(400).json({ message: 'Invalid item ID.' });
    }

    const items = await readMenuItems();
    const itemIndex = items.findIndex((item) => Number(item?.id) === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    // Delete associated image file if it exists
    const imageUrl = items[itemIndex].imageUrl;
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
      const fs = await import('node:fs/promises');
      const fullPath = path.resolve(process.cwd(), 'public', imageUrl);
      await fs.unlink(fullPath).catch(() => {});
    }

    items.splice(itemIndex, 1);
    await writeMenuItems(items);

    return res.json({ message: 'Menu item deleted successfully.' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    return res.status(500).json({ message: 'Failed to delete menu item.' });
  }
});

export default router;