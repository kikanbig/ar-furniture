#!/usr/bin/env python3
"""
Конвертация РЕАЛЬНЫХ FBX моделей в GLB формат
"""

import bpy
import os
import sys

def clear_scene():
    """Очистить сцену Blender"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def convert_fbx_to_glb(fbx_path, output_path):
    """Конвертировать FBX в GLB"""
    print(f"Конвертация: {fbx_path} -> {output_path}")
    
    # Очистить сцену
    clear_scene()
    
    # Импорт FBX
    try:
        bpy.ops.import_scene.fbx(filepath=fbx_path)
        print(f"✅ FBX импортирован: {fbx_path}")
    except Exception as e:
        print(f"❌ Ошибка импорта FBX: {e}")
        return False
    
    # Проверить что объекты загружены
    if len(bpy.context.scene.objects) == 0:
        print("❌ Нет объектов в сцене")
        return False
    
    print(f"📦 Объектов в сцене: {len(bpy.context.scene.objects)}")
    for obj in bpy.context.scene.objects:
        print(f"  - {obj.name} ({obj.type})")
    
    # Выбрать все объекты
    bpy.ops.object.select_all(action='SELECT')
    
    # Экспорт в GLB
    try:
        bpy.ops.export_scene.gltf(
            filepath=output_path,
            export_format='GLB',
            use_selection=True,
            export_materials='EXPORT',
            export_image_format='AUTO',
            export_yup=True
        )
        print(f"✅ GLB экспортирован: {output_path}")
        return True
    except Exception as e:
        print(f"❌ Ошибка экспорта GLB: {e}")
        return False

def main():
    print("🛋️ Конвертация РЕАЛЬНЫХ моделей диванов в GLB")
    
    # Пути к исходным FBX файлам
    models = [
        {
            'name': 'cannoli-sofa',
            'fbx': '../Cannoli sofa/Export/Cannoli sofa.fbx',
            'glb': 'public/models/cannoli-sofa.glb'
        },
        {
            'name': 'bellagio-sofa', 
            'fbx': '../Sofa Bellagio/Export/Sofa Bellagio.fbx',
            'glb': 'public/models/bellagio-sofa.glb'
        }
    ]
    
    # Создать папку для моделей
    os.makedirs('public/models', exist_ok=True)
    
    success_count = 0
    for model in models:
        print(f"\n{'='*50}")
        print(f"🛋️ Конвертация {model['name']}")
        print(f"{'='*50}")
        
        # Проверить существование FBX файла
        if not os.path.exists(model['fbx']):
            print(f"❌ FBX файл не найден: {model['fbx']}")
            continue
            
        # Конвертировать
        if convert_fbx_to_glb(model['fbx'], model['glb']):
            success_count += 1
            file_size = os.path.getsize(model['glb']) / 1024  # KB
            print(f"📊 Размер файла: {file_size:.1f} KB")
        else:
            print(f"❌ Не удалось конвертировать {model['name']}")
    
    print(f"\n{'='*50}")
    print(f"🎉 Конвертация завершена!")
    print(f"✅ Успешно: {success_count}/{len(models)}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()