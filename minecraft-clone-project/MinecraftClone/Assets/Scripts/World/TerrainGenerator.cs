using Unity.Burst;
using Unity.Collections;
using Unity.Jobs;
using Unity.Mathematics;

namespace VoxelGame.World
{
    /// <summary>
    /// Procedural terrain generation using noise functions.
    /// Implements multi-layered noise for realistic terrain with biomes, caves, and ore deposits.
    /// Uses Burst compiler for maximum performance.
    /// </summary>
    [BurstCompile]
    public struct TerrainGeneratorJob : IJobParallelFor
    {
        // Input parameters
        [ReadOnly] public NativeArray<Block> inputBlocks;
        public int3 chunkPosition;
        public ulong seed;
        public float scale;
        public float heightMultiplier;
        public float caveScale;

        // Output blocks
        [WriteOnly] public NativeArray<Block> outputBlocks;

        // Perlin noise implementation
        private static float PerlinNoise(float x, float y, float z, ulong seed)
        {
            // Simplified Perlin noise - in production, use FastNoiseLite library
            float4 p = new float4(x, y, z, seed);

            // Hash function
            p = math.frac(p * 0.1031f);
            p += new float4(p.y, p.z, p.x, p.w);
            p += new float4(p.z, p.x, p.y, p.w);
            p += new float4(p.w, p.y, p.z, p.x);

            float hash = math.frac((p.x + p.y) * 0.5f + p.z);
            return math.sin(hash * math.PI * 2.0f) * 0.5f + 0.5f;
        }

        // 3D Simplex-like noise for caves
        private static float Noise3D(float x, float y, float z, float scale, ulong seed)
        {
            float nx = x * scale + seed;
            float ny = y * scale + seed * 2.0f;
            float nz = z * scale + seed * 3.0f;

            float noise = PerlinNoise(nx, ny, nz, seed);
            noise += 0.5f * PerlinNoise(nx * 2.0f, ny * 2.0f, nz * 2.0f, seed);
            noise += 0.25f * PerlinNoise(nx * 4.0f, ny * 4.0f, nz * 4.0f, seed);

            return noise / 1.75f;
        }

        // 2D noise for terrain heightmap
        private static float Noise2D(float x, float z, float scale, ulong seed)
        {
            float nx = x * scale + seed;
            float nz = z * scale + seed * 2.0f;

            float noise = PerlinNoise(nx, 0, nz, seed);
            noise += 0.5f * PerlinNoise(nx * 2.0f, 0, nz * 2.0f, seed);
            noise += 0.25f * PerlinNoise(nx * 4.0f, 0, nz * 4.0f, seed);

            return noise / 1.75f;
        }

        public void Execute(int index)
        {
            // Calculate local position within chunk
            int x = index % 16;
            int y = (index / 16) % 16;
            int z = index / (16 * 16);

            // Convert to world position
            float worldX = chunkPosition.x * 16 + x;
            float worldY = chunkPosition.y * 16 + y;
            float worldZ = chunkPosition.z * 16 + z;

            // Calculate terrain height at this x,z position
            float heightNoise = Noise2D(worldX, worldZ, scale, seed);
            float terrainHeight = heightNoise * heightMultiplier;

            // Bedrock layer at bottom
            if (worldY < 1.0f)
            {
                outputBlocks[index] = new Block((byte)BlockType.Bedrock);
                return;
            }

            // Cave generation using 3D noise
            float caveNoise = Noise3D(worldX, worldY, worldZ, caveScale, seed);
            bool isCave = caveNoise > 0.6f;

            if (isCave && worldY > 1.0f && worldY < terrainHeight - 2.0f)
            {
                outputBlocks[index] = Block.Empty;
                return;
            }

            // Above terrain height: air or water
            if (worldY > terrainHeight)
            {
                if (worldY < 8.0f && worldY > terrainHeight - 2.0f)
                {
                    outputBlocks[index] = new Block((byte)BlockType.Water);
                }
                else
                {
                    outputBlocks[index] = Block.Empty;
                }
                return;
            }

            // Generate terrain layers
            BlockType blockType;

            if (worldY >= terrainHeight - 1.0f && worldY >= 8.0f)
            {
                // Surface layer: grass
                blockType = BlockType.Grass;
            }
            else if (worldY >= terrainHeight - 4.0f)
            {
                // Sub-surface: dirt
                blockType = BlockType.Dirt;
            }
            else
            {
                // Deep: stone with ore deposits
                blockType = BlockType.Stone;

                // Ore generation
                float oreNoise = PerlinNoise(worldX * 0.1f, worldY * 0.1f, worldZ * 0.1f, seed + 1000);

                if (worldY < 16.0f && oreNoise > 0.8f)
                {
                    blockType = BlockType.DiamondOre;
                }
                else if (worldY < 32.0f && oreNoise > 0.7f)
                {
                    blockType = BlockType.GoldOre;
                }
                else if (worldY < 48.0f && oreNoise > 0.6f)
                {
                    blockType = BlockType.IronOre;
                }
                else if (oreNoise > 0.5f)
                {
                    blockType = BlockType.CoalOre;
                }
            }

            outputBlocks[index] = new Block((byte)blockType);
        }
    }
}
