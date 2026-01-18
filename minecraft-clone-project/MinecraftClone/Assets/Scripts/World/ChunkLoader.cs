using UnityEngine;

namespace VoxelGame.World
{
    /// <summary>
    /// Manages chunk loading and unloading around the player.
    /// Implements dynamic chunk streaming for infinite terrain performance.
    /// </summary>
    public class ChunkLoader : MonoBehaviour
    {
        [Header("World Settings")]
        public ulong worldSeed = 12345;
        public int renderDistance = 8;
        public float chunkLoadInterval = 0.1f;

        [Header("Terrain Settings")]
        public float terrainScale = 0.01f;
        public float terrainHeightMultiplier = 20.0f;
        public float caveScale = 0.05f;

        private VoxelWorld world;
        private float loadTimer;
        private int3 lastPlayerChunk;

        private void Awake()
        {
            world = new VoxelWorld(worldSeed, renderDistance);
        }

        private void Update()
        {
            loadTimer += Time.deltaTime;

            if (loadTimer >= chunkLoadInterval)
            {
                UpdateChunksAroundPlayer();
                loadTimer = 0f;
            }
        }

        private void UpdateChunksAroundPlayer()
        {
            float3 playerPos = transform.position;
            int3 playerChunk = VoxelWorld.WorldToChunk(playerPos);

            // Only update if player moved to a new chunk
            if (playerChunk.Equals(lastPlayerChunk))
            {
                return;
            }

            lastPlayerChunk = playerChunk;

            // Load new chunks
            LoadChunksInRange(playerChunk);

            // Unload far chunks
            world.UnloadFarChunks(playerPos);
        }

        private void LoadChunksInRange(int3 centerChunk)
        {
            for (int x = -renderDistance; x <= renderDistance; x++)
            {
                for (int y = -renderDistance; y <= renderDistance; y++)
                {
                    for (int z = -renderDistance; z <= renderDistance; z++)
                    {
                        int3 chunkPos = centerChunk + new int3(x, y, z);

                        // Check if chunk already exists
                        if (world.GetChunk(chunkPos) != null)
                        {
                            continue;
                        }

                        // Create and generate chunk
                        GenerateChunk(chunkPos);
                    }
                }
            }
        }

        private void GenerateChunk(int3 chunkPos)
        {
            Chunk chunk = world.GetOrCreateChunk(chunkPos);

            // Create terrain generation job
            TerrainGeneratorJob job = new TerrainGeneratorJob
            {
                inputBlocks = new Unity.Collections.NativeArray<Block>(Chunk.VOLUME, Unity.Collections.Allocator.TempJob),
                chunkPosition = chunkPos,
                seed = worldSeed,
                scale = terrainScale,
                heightMultiplier = terrainHeightMultiplier,
                caveScale = caveScale,
                outputBlocks = new Unity.Collections.NativeArray<Block>(Chunk.VOLUME, Unity.Collections.Allocator.TempJob)
            };

            // Schedule job
            JobHandle handle = job.Schedule(Chunk.VOLUME, 64);

            // Wait for completion (in production, use job system more efficiently)
            handle.Complete();

            // Apply generated blocks to chunk
            for (int i = 0; i < Chunk.VOLUME; i++)
            {
                int x = i % 16;
                int y = (i / 16) % 16;
                int z = i / (16 * 16);
                chunk.SetBlock(new int3(x, y, z), job.outputBlocks[i]);
            }

            // Clean up
            job.inputBlocks.Dispose();
            job.outputBlocks.Dispose();

            // Generate mesh for chunk
            GenerateChunkMesh(chunk);
        }

        private void GenerateChunkMesh(Chunk chunk)
        {
            // Create mesh generation job
            MeshGenerationJob job = new MeshGenerationJob
            {
                blocks = new Unity.Collections.NativeArray<Block>(Chunk.VOLUME, Unity.Collections.Allocator.TempJob),
                chunkPosition = chunk.ChunkPosition,
                vertices = new Unity.Collections.NativeArray<float3>(10000, Unity.Collections.Allocator.TempJob),
                triangles = new Unity.Collections.NativeArray<int3>(10000, Unity.Collections.Allocator.TempJob),
                uv = new Unity.Collections.NativeArray<float2>(10000, Unity.Collections.Allocator.TempJob),
                normals = new Unity.Collections.NativeArray<float3>(10000, Unity.Collections.Allocator.TempJob),
                vertexColors = new Unity.Collections.NativeArray<float3>(10000, Unity.Collections.Allocator.TempJob),
                vertexCount = 0,
                triangleCount = 0
            };

            // Copy block data
            for (int i = 0; i < Chunk.VOLUME; i++)
            {
                int x = i % 16;
                int y = (i / 16) % 16;
                int z = i / (16 * 16);
                job.blocks[i] = chunk.GetBlock(new int3(x, y, z));
            }

            // Schedule job
            JobHandle handle = job.Schedule(Chunk.VOLUME, 64);
            handle.Complete();

            // Create Unity mesh
            Mesh mesh = new Mesh();
            mesh.vertices = ConvertToVector3Array(job.vertices, job.vertexCount);
            mesh.triangles = ConvertToIntArray(job.triangles, job.triangleCount * 3);
            mesh.uv = ConvertToVector2Array(job.uv, job.vertexCount);
            mesh.normals = ConvertToVector3Array(job.normals, job.vertexCount);
            mesh.colors = ConvertToColorArray(job.vertexColors, job.vertexCount);

            mesh.RecalculateBounds();
            mesh.Optimize();

            chunk.Mesh = mesh;

            // Clean up
            job.blocks.Dispose();
            job.vertices.Dispose();
            job.triangles.Dispose();
            job.uv.Dispose();
            job.normals.Dispose();
            job.vertexColors.Dispose();
        }

        private Vector3[] ConvertToVector3Array(Unity.Collections.NativeArray<float3> input, int count)
        {
            Vector3[] output = new Vector3[count];
            for (int i = 0; i < count; i++)
            {
                output[i] = new Vector3(input[i].x, input[i].y, input[i].z);
            }
            return output;
        }

        private int[] ConvertToIntArray(Unity.Collections.NativeArray<int3> input, int count)
        {
            int[] output = new int[count];
            for (int i = 0; i < count; i++)
            {
                int flatIndex = i / 3;
                int component = i % 3;

                switch (component)
                {
                    case 0: output[i] = input[flatIndex].x; break;
                    case 1: output[i] = input[flatIndex].y; break;
                    case 2: output[i] = input[flatIndex].z; break;
                }
            }
            return output;
        }

        private Vector2[] ConvertToVector2Array(Unity.Collections.NativeArray<float2> input, int count)
        {
            Vector2[] output = new Vector2[count];
            for (int i = 0; i < count; i++)
            {
                output[i] = new Vector2(input[i].x, input[i].y);
            }
            return output;
        }

        private Color[] ConvertToColorArray(Unity.Collections.NativeArray<float3> input, int count)
        {
            Color[] output = new Color[count];
            for (int i = 0; i < count; i++)
            {
                output[i] = new Color(input[i].x, input[i].y, input[i].z);
            }
            return output;
        }

        public VoxelWorld GetWorld()
        {
            return world;
        }

        private void OnDestroy()
        {
            world?.Dispose();
        }
    }
}
