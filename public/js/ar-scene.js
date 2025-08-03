// AR Scene Management
class ARFurnitureScene {
    constructor() {
        this.currentModel = null;
        this.models = {
            'cannoli': {
                name: 'Диван Cannoli',
                description: 'Элегантный диван в стиле модерн с мягкими линиями',
                price: '150,000 ₽',
                model: '/models/cannoli-sofa.glb',
                scale: '1 1 1',
                position: '0 0 0'
            },
            'bellagio': {
                name: 'Диван Bellagio',
                description: 'Современный диван с геометрическими формами',
                price: '180,000 ₽',
                model: '/models/bellagio-sofa.glb',
                scale: '1 1 1',
                position: '0 0 0'
            }
        };
        
        this.init();
    }
    
    init() {
        // Скрыть загрузку после инициализации
        setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
        }, 2000);
        
        // Загрузить первую модель по умолчанию
        this.loadModel('cannoli');
        
        // Добавить обработчики событий
        this.addEventListeners();
    }
    
    loadModel(modelKey) {
        const modelData = this.models[modelKey];
        if (!modelData) return;
        
        this.currentModel = modelKey;
        
        // Обновить информацию о мебели
        document.getElementById('furniture-name').textContent = modelData.name;
        document.getElementById('furniture-description').textContent = modelData.description;
        document.getElementById('furniture-price').textContent = `Цена: ${modelData.price}`;
        
        // Загрузить 3D модель
        const furnitureEntity = document.getElementById('furniture-model');
        furnitureEntity.setAttribute('gltf-model', modelData.model);
        furnitureEntity.setAttribute('scale', modelData.scale);
        furnitureEntity.setAttribute('position', modelData.position);
        
        console.log(`Загружена модель: ${modelData.name}`);
    }
    
    resetFurniture() {
        const furnitureEntity = document.getElementById('furniture-model');
        furnitureEntity.setAttribute('position', '0 0 0');
        furnitureEntity.setAttribute('rotation', '0 0 0');
        furnitureEntity.setAttribute('scale', '1 1 1');
        
        console.log('Позиция мебели сброшена');
    }
    
    changeFurniture() {
        const modelKeys = Object.keys(this.models);
        const currentIndex = modelKeys.indexOf(this.currentModel);
        const nextIndex = (currentIndex + 1) % modelKeys.length;
        const nextModel = modelKeys[nextIndex];
        
        this.loadModel(nextModel);
    }
    
    toggleInfo() {
        const infoPanel = document.getElementById('info-panel');
        const isVisible = infoPanel.style.display !== 'none';
        infoPanel.style.display = isVisible ? 'none' : 'block';
    }
    
    addEventListeners() {
        // Обработка жестов для изменения размера
        let initialDistance = 0;
        let initialScale = 1;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                initialDistance = this.getDistance(e.touches[0], e.touches[1]);
                const furnitureEntity = document.getElementById('furniture-model');
                initialScale = furnitureEntity.getAttribute('scale').x;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scale = (currentDistance / initialDistance) * initialScale;
                
                const furnitureEntity = document.getElementById('furniture-model');
                furnitureEntity.setAttribute('scale', `${scale} ${scale} ${scale}`);
            }
        });
        
        // Обработка поворота мебели
        let lastTouchX = 0;
        let lastTouchY = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - lastTouchX;
                const deltaY = e.touches[0].clientY - lastTouchY;
                
                const furnitureEntity = document.getElementById('furniture-model');
                const currentRotation = furnitureEntity.getAttribute('rotation');
                
                furnitureEntity.setAttribute('rotation', 
                    `${currentRotation.x - deltaY * 0.5} ${currentRotation.y + deltaX * 0.5} ${currentRotation.z}`
                );
                
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        });
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Инициализация AR сцены
let arScene;

document.addEventListener('DOMContentLoaded', () => {
    arScene = new ARFurnitureScene();
});

// Глобальные функции для кнопок
function resetFurniture() {
    if (arScene) arScene.resetFurniture();
}

function changeFurniture() {
    if (arScene) arScene.changeFurniture();
}

function toggleInfo() {
    if (arScene) arScene.toggleInfo();
}

// Обработка ошибок загрузки моделей
window.addEventListener('error', (e) => {
    if (e.target.tagName === 'A-ENTITY') {
        console.error('Ошибка загрузки 3D модели:', e);
        document.getElementById('loading').innerHTML = 
            '<h2>Ошибка загрузки</h2><p>Не удалось загрузить 3D модель</p>';
    }
});

// Проверка поддержки WebXR
if ('xr' in navigator) {
    navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
        if (supported) {
            console.log('WebXR AR поддерживается');
        } else {
            console.log('WebXR AR не поддерживается');
            document.getElementById('loading').innerHTML = 
                '<h2>AR не поддерживается</h2><p>Ваше устройство не поддерживает дополненную реальность</p>';
        }
    });
} else {
    console.log('WebXR не поддерживается');
} 