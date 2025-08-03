#!/usr/bin/env python3
"""
Скрипт для создания простых тестовых 3D моделей диванов
"""

import bpy
import os

def clear_scene():
    """Очистить сцену Blender"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)

def create_cannoli_sofa():
    """Создать модель дивана Cannoli"""
    # Основание дивана
    bpy.ops.mesh.primitive_cube_add(size=2)
    base = bpy.context.active_object
    base.name = "Cannoli_Base"
    base.location = (0, 0, 0.3)
    base.scale = (1.5, 0.8, 0.3)
    
    # Спинка
    bpy.ops.mesh.primitive_cube_add(size=2)
    back = bpy.context.active_object
    back.name = "Cannoli_Back"
    back.location = (0, -0.7, 0.8)
    back.scale = (1.5, 0.2, 0.8)
    
    # Подлокотники
    bpy.ops.mesh.primitive_cube_add(size=2)
    arm_left = bpy.context.active_object
    arm_left.name = "Cannoli_ArmLeft"
    arm_left.location = (-1.3, 0, 0.5)
    arm_left.scale = (0.2, 0.8, 0.5)
    
    bpy.ops.mesh.primitive_cube_add(size=2)
    arm_right = bpy.context.active_object
    arm_right.name = "Cannoli_ArmRight"
    arm_right.location = (1.3, 0, 0.5)
    arm_right.scale = (0.2, 0.8, 0.5)
    
    # Объединить все части
    objects_to_join = [base, back, arm_left, arm_right]
    bpy.context.view_layer.objects.active = base
    for obj in objects_to_join[1:]:
        obj.select_set(True)
    bpy.ops.object.join()
    
    # Добавить материал
    material = bpy.data.materials.new(name="Cannoli_Material")
    material.use_nodes = True
    material.node_tree.nodes["Principled BSDF"].inputs[0].default_value = (0.8, 0.6, 0.4, 1)
    base.data.materials.append(material)

def create_bellagio_sofa():
    """Создать модель дивана Bellagio"""
    # Основание дивана
    bpy.ops.mesh.primitive_cube_add(size=2)
    base = bpy.context.active_object
    base.name = "Bellagio_Base"
    base.location = (0, 0, 0.3)
    base.scale = (1.8, 0.9, 0.3)
    
    # Спинка
    bpy.ops.mesh.primitive_cube_add(size=2)
    back = bpy.context.active_object
    back.name = "Bellagio_Back"
    back.location = (0, -0.8, 0.9)
    back.scale = (1.8, 0.2, 0.9)
    
    # Подлокотники
    bpy.ops.mesh.primitive_cube_add(size=2)
    arm_left = bpy.context.active_object
    arm_left.name = "Bellagio_ArmLeft"
    arm_left.location = (-1.5, 0, 0.6)
    arm_left.scale = (0.2, 0.9, 0.6)
    
    bpy.ops.mesh.primitive_cube_add(size=2)
    arm_right = bpy.context.active_object
    arm_right.name = "Bellagio_ArmRight"
    arm_right.location = (1.5, 0, 0.6)
    arm_right.scale = (0.2, 0.9, 0.6)
    
    # Объединить все части
    objects_to_join = [base, back, arm_left, arm_right]
    bpy.context.view_layer.objects.active = base
    for obj in objects_to_join[1:]:
        obj.select_set(True)
    bpy.ops.object.join()
    
    # Добавить материал
    material = bpy.data.materials.new(name="Bellagio_Material")
    material.use_nodes = True
    material.node_tree.nodes["Principled BSDF"].inputs[0].default_value = (0.2, 0.3, 0.8, 1)
    base.data.materials.append(material)

def export_gltf(output_path):
    """Экспортировать в GLTF формат"""
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_materials='EXPORT',
        export_texcoords=True,
        export_normals=True,
        export_tangents=True,
        export_lights=False,
        export_cameras=False,
        export_extras=False,
        export_yup=True,
        export_apply=False
    )
    print(f"Экспортирован: {output_path}")

def main():
    """Основная функция"""
    # Создать папку для моделей
    os.makedirs('public/models', exist_ok=True)
    
    # Создать и экспортировать Cannoli
    print("Создание модели Cannoli...")
    clear_scene()
    create_cannoli_sofa()
    export_gltf('public/models/cannoli-sofa.glb')
    
    # Создать и экспортировать Bellagio
    print("Создание модели Bellagio...")
    clear_scene()
    create_bellagio_sofa()
    export_gltf('public/models/bellagio-sofa.glb')
    
    print("✅ Все модели созданы успешно!")

if __name__ == "__main__":
    main() 