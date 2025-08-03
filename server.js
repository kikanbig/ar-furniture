const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com", "https://aframe.io", "https://raw.githack.com", "https://cdn.jsdelivr.net"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            mediaSrc: ["'self'", "camera:", "microphone:"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    }
}));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// База данных мебели (в реальном проекте это будет база данных)
const furnitureDatabase = {
    'cannoli': {
        id: 'cannoli',
        name: 'Диван Cannoli',
        description: 'Элегантный диван в стиле модерн с мягкими линиями',
        price: '150,000 ₽',
        model: '/models/cannoli-sofa.glb',
        qrCode: null
    },
    'bellagio': {
        id: 'bellagio',
        name: 'Диван Bellagio',
        description: 'Современный диван с геометрическими формами',
        price: '180,000 ₽',
        model: '/models/bellagio-sofa.glb',
        qrCode: null
    }
};

// API маршруты
app.get('/api/furniture', (req, res) => {
    res.json(Object.values(furnitureDatabase));
});

app.get('/api/furniture/:id', (req, res) => {
    const furniture = furnitureDatabase[req.params.id];
    if (furniture) {
        res.json(furniture);
    } else {
        res.status(404).json({ error: 'Мебель не найдена' });
    }
});

// Генерация QR-кода для конкретной мебели
app.get('/api/qr/:furnitureId', async (req, res) => {
    try {
        const furniture = furnitureDatabase[req.params.furnitureId];
        if (!furniture) {
            return res.status(404).json({ error: 'Мебель не найдена' });
        }

        const url = `${req.protocol}://${req.get('host')}/ar/${req.params.furnitureId}`;
        const qrCodeDataURL = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        res.json({
            furnitureId: req.params.furnitureId,
            url: url,
            qrCode: qrCodeDataURL
        });
    } catch (error) {
        console.error('Ошибка генерации QR-кода:', error);
        res.status(500).json({ error: 'Ошибка генерации QR-кода' });
    }
});

// AR страница для конкретной мебели
app.get('/ar/:furnitureId', (req, res) => {
    const furniture = furnitureDatabase[req.params.furnitureId];
    if (furniture) {
        res.sendFile(path.join(__dirname, 'public', 'ar.html'));
    } else {
        res.status(404).json({ error: 'Мебель не найдена' });
    }
});

// 🔥 ПРОФЕССИОНАЛЬНЫЙ WebXR AR для конкретной мебели
app.get('/webxr/:furnitureId', (req, res) => {
    const furniture = furnitureDatabase[req.params.furnitureId];
    if (furniture) {
        res.sendFile(path.join(__dirname, 'public', 'webxr-ar.html'));
    } else {
        res.status(404).json({ error: 'Мебель не найдена' });
    }
});

// 🚀 WebXR AR v2.0 (исправленная версия)
app.get('/webxr-v2/:furnitureId', (req, res) => {
    const furniture = furnitureDatabase[req.params.furnitureId];
    if (furniture) {
        res.sendFile(path.join(__dirname, 'public', 'webxr-ar-v2.html'));
    } else {
        res.status(404).json({ error: 'Мебель не найдена' });
    }
});

// 🏢 PROFESSIONAL WebXR AR (лучшие практики)
app.get('/pro/:furnitureId', (req, res) => {
    const furniture = furnitureDatabase[req.params.furnitureId];
    if (furniture) {
        res.sendFile(path.join(__dirname, 'public', 'webxr-professional.html'));
    } else {
        res.status(404).json({ error: 'Мебель не найдена' });
    }
});

// API для генерации WebXR QR-кодов
app.get('/api/webxr-qr/:furnitureId', async (req, res) => {
    try {
        const furniture = furnitureDatabase[req.params.furnitureId];
        if (!furniture) {
            return res.status(404).json({ error: 'Мебель не найдена' });
        }

        const url = `${req.protocol}://${req.get('host')}/webxr/${req.params.furnitureId}`;
        const qrCodeDataURL = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        res.json({
            furnitureId: req.params.furnitureId,
            url: url,
            qrCode: qrCodeDataURL,
            type: 'WebXR'
        });
    } catch (error) {
        console.error('Ошибка генерации WebXR QR-кода:', error);
        res.status(500).json({ error: 'Ошибка генерации QR-кода' });
    }
});

// API для генерации WebXR v2 QR-кодов (исправленная версия)
app.get('/api/webxr-v2-qr/:furnitureId', async (req, res) => {
    try {
        const furniture = furnitureDatabase[req.params.furnitureId];
        if (!furniture) {
            return res.status(404).json({ error: 'Мебель не найдена' });
        }

        const url = `${req.protocol}://${req.get('host')}/webxr-v2/${req.params.furnitureId}`;
        const qrCodeDataURL = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#FF6B35',
                light: '#FFFFFF'
            }
        });

        res.json({
            furnitureId: req.params.furnitureId,
            url: url,
            qrCode: qrCodeDataURL,
            type: 'WebXR v2.0'
        });
    } catch (error) {
        console.error('Ошибка генерации WebXR v2 QR-кода:', error);
        res.status(500).json({ error: 'Ошибка генерации QR-кода' });
    }
});

// API для генерации Professional WebXR QR-кодов
app.get('/api/pro-qr/:furnitureId', async (req, res) => {
    try {
        const furniture = furnitureDatabase[req.params.furnitureId];
        if (!furniture) {
            return res.status(404).json({ error: 'Мебель не найдена' });
        }

        const url = `${req.protocol}://${req.get('host')}/pro/${req.params.furnitureId}`;
        const qrCodeDataURL = await QRCode.toDataURL(url, {
            width: 300,
            margin: 2,
            color: {
                dark: '#2196F3',
                light: '#FFFFFF'
            }
        });

        res.json({
            furnitureId: req.params.furnitureId,
            url: url,
            qrCode: qrCodeDataURL,
            type: 'Professional WebXR'
        });
    } catch (error) {
        console.error('Ошибка генерации Professional QR-кода:', error);
        res.status(500).json({ error: 'Ошибка генерации QR-кода' });
    }
});

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Страница с QR-кодами
app.get('/qr-codes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qr-codes.html'));
});

// Страница с WebXR QR-кодами
app.get('/webxr-qr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'webxr-qr.html'));
});

// Страница с исправленными QR-кодами
app.get('/fixed-qr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'fixed-qr.html'));
});

// Страница со всеми версиями
app.get('/all-versions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'all-versions.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Что-то пошло не так!' });
});

// 404 обработчик
app.use((req, res) => {
    res.status(404).json({ error: 'Страница не найдена' });
});

app.listen(PORT, () => {
    console.log(`🚀 AR Furniture Server запущен на порту ${PORT}`);
    console.log(`📱 AR сцена доступна по адресу: http://localhost:${PORT}`);
    console.log(`🔗 QR-коды доступны по адресу: http://localhost:${PORT}/qr-codes`);
}); 