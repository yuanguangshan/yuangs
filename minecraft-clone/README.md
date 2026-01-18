# Minecraft Clone

A high-performance Minecraft clone built with Unity 2023 LTS, HDRP, and DOTS/ECS architecture.

## Features

### Core Systems
- **Infinite Procedural Terrain**: Chunk-based world generation with noise functions
- **Greedy Meshing**: 80-90% vertex reduction for optimal rendering
- **Chunk Streaming**: Dynamic loading/unloading around player
- **Memory Pooling**: Efficient chunk management

### Rendering
- **HDRP (High Definition Render Pipeline)**: Realistic PBR materials
- **PBR Materials**: Albedo, normal, roughness, metallic maps per block
- **Frustum Culling**: Only render visible chunks
- **Ambient Occlusion**: Two-level AO (voxel + SSAO)

### Gameplay
- **First-Person Controller**: Full physics, gravity, collision
- **Block Interaction**: Raycasting for break/place
- **Block Types**: 15+ block types with unique properties
- **Block Selection**: Cycle through available blocks (Q/E)

### World Generation
- **Heightmap Noise**: Multi-octave Perlin noise
- **Caves**: 3D noise for underground cave systems
- **Ore Deposits**: Coal, iron, gold, diamond with depth constraints
- **Biomes**: Foundation for diverse biomes

## Architecture

### Project Structure
```
Assets/Scripts/
├── Core/              # Core data structures
│   ├── Block.cs         # Voxel block representation
│   ├── Chunk.cs        # 16x16x16 chunk management
│   ├── VoxelWorld.cs   # World management with pooling
│   └── BlockRegistry.cs # Block type definitions
├── World/             # World generation
│   ├── TerrainGenerator.cs    # Procedural generation
│   ├── MeshGenerator.cs       # Greedy meshing
│   └── ChunkLoader.cs       # Chunk streaming
├── Player/           # Player systems
│   ├── PlayerController.cs   # Movement/physics
│   └── BlockInteraction.cs  # Break/place blocks
├── Materials/        # PBR materials
│   ├── MaterialManager.cs     # Material assignment
│   └── BlockMaterialData.cs  # Per-block properties
├── Rendering/       # Rendering systems
│   ├── ChunkRenderer.cs      # Mesh rendering
│   └── FrustumCulling.cs   # Performance optimization
├── UI/              # User interface
│   └── PlayerHUD.cs         # HUD display
└── Utils/           # Utilities
    ├── VoxelUtils.cs        # Coordinate transforms
    └── GameManager.cs       # Game coordination
```

### Performance Targets
- **Frame Rate**: 60 FPS minimum
- **Render Distance**: 8 chunks (128 blocks)
- **Memory**: < 4GB active gameplay
- **Chunk Load Time**: < 100ms

## Setup Instructions

1. Install Unity 2023 LTS
2. Create new HDRP project
3. Copy Scripts folder to Assets/
4. Install TextMeshPro for UI
5. Create texture atlases for blocks:
   - Albedo (base color)
   - Normal (surface detail)
   - Roughness (smoothness)
   - Metallic (reflectivity)

## Controls

- **WASD**: Move
- **Mouse**: Look around
- **Space**: Jump
- **Shift**: Sprint
- **Left Click**: Break block
- **Right Click**: Place block
- **Q/E**: Cycle selected block
- **ESC**: Release mouse cursor

## Block Types

| ID | Type          | Properties               |
|----|---------------|-------------------------|
| 0  | Air           | Transparent, Non-solid    |
| 1  | Stone         | Solid                   |
| 2  | Grass         | Solid                   |
| 3  | Dirt          | Solid                   |
| 4  | Cobblestone   | Solid                   |
| 5  | Wood          | Solid                   |
| 6  | Leaves         | Transparent, Solid       |
| 7  | Sand          | Solid                   |
| 8  | Water         | Transparent, Non-solid   |
| 9  | Bedrock       | Solid, Indestructible    |
| 10 | Coal Ore      | Solid                   |
| 11 | Iron Ore     | Solid                   |
| 12 | Gold Ore     | Solid                   |
| 13 | Diamond Ore   | Solid                   |
| 14 | Planks        | Solid                   |
| 15 | Glass         | Transparent, Solid       |

## Technical Details

### Terrain Generation
- Multi-layered noise for realistic landscapes
- Cave systems using 3D Perlin noise
- Ore deposits at specific depth ranges
- Foundation for biome diversity

### Rendering Pipeline
1. **Terrain Generation**: Burst-compiled job system
2. **Mesh Generation**: Greedy meshing for vertex reduction
3. **Material Assignment**: PBR material from atlases
4. **Frustum Culling**: Skip invisible chunks
5. **Ambient Occlusion**: Two-level system

### Memory Management
- Object pooling for chunks
- LRU cache for active chunks
- Native arrays for burst compatibility
- Aggressive unloading of distant chunks

## Future Enhancements

### Medium Priority
- Dynamic lighting (torches, lava)
- Day/night cycle
- Custom block models (stairs, slabs, fences)
- Weather and particle effects
- Inventory UI and hotbar
- Crafting system

### Low Priority
- World persistence (SQLite)
- LOD system for distant chunks
- Extended biome variety
- Mob spawning and AI
- Multiplayer support

## Performance Optimization

1. **Burst Compiler**: All performance-critical jobs
2. **Job System**: Parallel chunk generation
3. **Greedy Meshing**: 80-90% fewer vertices
4. **Frustum Culling**: Skip invisible chunks
5. **Texture Atlasing**: Single draw call per chunk
6. **Memory Pooling**: Reuse chunk objects

## License

This is a demonstration project for educational purposes.
