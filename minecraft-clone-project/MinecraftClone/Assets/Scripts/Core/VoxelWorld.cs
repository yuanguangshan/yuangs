using System.Collections.Generic;
using Unity.Collections;
using Unity.Mathematics;

namespace VoxelGame.Core
{
    /// <summary>
    /// Manages the entire voxel world including chunk management, persistence, and block operations.
    /// Uses a dictionary for efficient chunk lookup and memory pooling for performance.
    /// </summary>
    public class VoxelWorld
    {
        // Chunk storage using chunk position as key
        private Dictionary<int3, Chunk> chunks;

        // Chunk pool for memory efficiency
        private Queue<Chunk> chunkPool;
        private const int POOL_SIZE = 256;

        // World seed for procedural generation
        private readonly ulong worldSeed;

        // Render distance in chunks
        private int renderDistance;

        public VoxelWorld(ulong seed, int renderDistanceChunks)
        {
            worldSeed = seed;
            renderDistance = renderDistanceChunks;
            chunks = new Dictionary<int3, Chunk>();
            chunkPool = new Queue<Chunk>(POOL_SIZE);

            InitializeChunkPool();
        }

        private void InitializeChunkPool()
        {
            for (int i = 0; i < POOL_SIZE; i++)
            {
                chunkPool.Enqueue(new Chunk(int3.zero, Allocator.Persistent));
            }
        }

        /// <summary>
        /// Get chunk at chunk coordinates
        /// </summary>
        public Chunk GetChunk(int3 chunkPos)
        {
            if (chunks.TryGetValue(chunkPos, out Chunk chunk))
            {
                return chunk;
            }
            return null;
        }

        /// <summary>
        /// Get or create chunk at chunk coordinates
        /// </summary>
        public Chunk GetOrCreateChunk(int3 chunkPos)
        {
            if (chunks.TryGetValue(chunkPos, out Chunk chunk))
            {
                return chunk;
            }

            chunk = CreateChunk(chunkPos);
            chunks[chunkPos] = chunk;
            return chunk;
        }

        private Chunk CreateChunk(int3 chunkPos)
        {
            Chunk chunk;

            if (chunkPool.Count > 0)
            {
                chunk = chunkPool.Dequeue();
                chunk = new Chunk(chunkPos, Allocator.Persistent);
            }
            else
            {
                chunk = new Chunk(chunkPos, Allocator.Persistent);
            }

            return chunk;
        }

        /// <summary>
        /// Unload chunk and return to pool
        /// </summary>
        public void UnloadChunk(int3 chunkPos)
        {
            if (chunks.TryGetValue(chunkPos, out Chunk chunk))
            {
                chunks.Remove(chunkPos);
                chunk.Dispose();
                chunkPool.Enqueue(chunk);
            }
        }

        /// <summary>
        /// Convert world position to chunk coordinates
        /// </summary>
        public static int3 WorldToChunk(float3 worldPos)
        {
            return new int3(
                Mathf.FloorToInt(worldPos.x / Chunk.SIZE),
                Mathf.FloorToInt(worldPos.y / Chunk.SIZE),
                Mathf.FloorToInt(worldPos.z / Chunk.SIZE)
            );
        }

        /// <summary>
        /// Get block at world position
        /// </summary>
        public Block GetBlock(float3 worldPos)
        {
            int3 chunkPos = WorldToChunk(worldPos);
            Chunk chunk = GetChunk(chunkPos);

            if (chunk == null)
            {
                return Block.Empty;
            }

            int3 localPos = WorldToLocal(worldPos, chunkPos);
            if (!chunk.IsValidPosition(localPos))
            {
                return Block.Empty;
            }

            return chunk.GetBlock(localPos);
        }

        /// <summary>
        /// Set block at world position
        /// </summary>
        public void SetBlock(float3 worldPos, Block block)
        {
            int3 chunkPos = WorldToChunk(worldPos);
            Chunk chunk = GetOrCreateChunk(chunkPos);

            int3 localPos = WorldToLocal(worldPos, chunkPos);

            if (chunk.IsValidPosition(localPos))
            {
                chunk.SetBlock(localPos, block);
            }
        }

        /// <summary>
        /// Convert world position to local chunk position
        /// </summary>
        private int3 WorldToLocal(float3 worldPos, int3 chunkPos)
        {
            float3 chunkWorldPos = new float3(
                chunkPos.x * Chunk.SIZE,
                chunkPos.y * Chunk.SIZE,
                chunkPos.z * Chunk.SIZE
            );

            int3 localPos = new int3(
                Mathf.FloorToInt(worldPos.x - chunkWorldPos.x),
                Mathf.FloorToInt(worldPos.y - chunkWorldPos.y),
                Mathf.FloorToInt(worldPos.z - chunkWorldPos.z)
            );

            return localPos;
        }

        /// <summary>
        /// Get all chunks within render distance of a position
        /// </summary>
        public List<Chunk> GetChunksInRange(float3 centerPos, int distanceChunks)
        {
            List<Chunk> nearbyChunks = new List<Chunk>();
            int3 centerChunk = WorldToChunk(centerPos);

            for (int x = -distanceChunks; x <= distanceChunks; x++)
            {
                for (int y = -distanceChunks; y <= distanceChunks; y++)
                {
                    for (int z = -distanceChunks; z <= distanceChunks; z++)
                    {
                        int3 chunkPos = centerChunk + new int3(x, y, z);
                        Chunk chunk = GetChunk(chunkPos);
                        if (chunk != null)
                        {
                            nearbyChunks.Add(chunk);
                        }
                    }
                }
            }

            return nearbyChunks;
        }

        /// <summary>
        /// Unload all chunks outside render distance
        /// </summary>
        public void UnloadFarChunks(float3 playerPos)
        {
            List<int3> chunksToUnload = new List<int3>();
            int3 playerChunk = WorldToChunk(playerPos);
            int maxDist = renderDistance + 2;

            foreach (var kvp in chunks)
            {
                int3 chunkPos = kvp.Key;
                int3 diff = math.abs(chunkPos - playerChunk);

                if (diff.x > maxDist || diff.y > maxDist || diff.z > maxDist)
                {
                    chunksToUnload.Add(chunkPos);
                }
            }

            foreach (int3 pos in chunksToUnload)
            {
                UnloadChunk(pos);
            }
        }

        public void Dispose()
        {
            foreach (var kvp in chunks)
            {
                kvp.Value.Dispose();
            }
            chunks.Clear();

            while (chunkPool.Count > 0)
            {
                Chunk chunk = chunkPool.Dequeue();
                chunk.Dispose();
            }
        }
    }
}
