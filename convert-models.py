#!/usr/bin/env python3
"""
Скрипт для конвертации OBJ моделей в GLTF формат
Использует Blender Python API для автоматической конвертации
"""

import bpy
import os
import sys

# Включить аддоны для импорта/экспорта
bpy.ops.preferences.addon_enable(module="io_scene_obj")
bpy.ops.preferences.addon_enable(module="io_scene_gltf2")

def clear_scene():
    """Очистить сцену Blender"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def import_obj(obj_path):
    """Импортировать OBJ файл"""
    bpy.ops.import_scene.obj(filepath=obj_path)
    print(f"Импортирован: {obj_path}")

def export_gltf(output_path):
    """Экспортировать в GLTF формат"""
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_materials='EXPORT',
        export_textures=True,
        export_texcoords=True,
        export_normals=True,
        export_tangents=True,
        export_morph=True,
        export_lights=False,
        export_cameras=False,
        export_extras=False,
        export_yup=True,
        export_apply=False,
        export_animations=True,
        export_force_sampling=True,
        export_nla_strips=True,
        export_def_bones=False,
        export_current_frame=False,
        export_rest_position_armature=False,
        export_anim_single_armature=False,
        export_reset_pose_bones=True,
        export_anim_step=1.0,
        export_anim_simplify_factor=1.0
    )
    print(f"Экспортирован: {output_path}")

def convert_model(obj_path, output_path):
    """Конвертировать модель из OBJ в GLTF"""
    try:
        clear_scene()
        import_obj(obj_path)
        export_gltf(output_path)
        return True
    except Exception as e:
        print(f"Ошибка конвертации: {e}")
        return False

def main():
    """Основная функция"""
    # Пути к моделям
    models = [
        {
            'obj': '../Cannoli sofa/Export/Cannoli sofa.obj',
            'output': 'public/models/cannoli-sofa.glb'
        },
        {
            'obj': '../Sofa Bellagio/Export/Sofa Bellagio.obj',
            'output': 'public/models/bellagio-sofa.glb'
        }
    ]
    
    # Создать папку для моделей
    os.makedirs('public/models', exist_ok=True)
    
    # Конвертировать каждую модель
    for model in models:
        if os.path.exists(model['obj']):
            print(f"Конвертация: {model['obj']}")
            success = convert_model(model['obj'], model['output'])
            if success:
                print(f"✅ Успешно: {model['output']}")
            else:
                print(f"❌ Ошибка: {model['obj']}")
        else:
            print(f"❌ Файл не найден: {model['obj']}")

if __name__ == "__main__":
    main()