using UnityEngine;

namespace VoxelGame.Utils
{
    /// <summary>
    /// Utility class for common voxel world operations.
    /// Includes coordinate transformations and helper methods.
    /// </summary>
    public static class VoxelUtils
    {
        /// <summary>
        /// Convert world position to block position (floor to nearest block)
        /// </summary>
        public static int3 WorldToBlock(float3 worldPos)
        {
            return new int3(
                Mathf.FloorToInt(worldPos.x),
                Mathf.FloorToInt(worldPos.y),
                Mathf.FloorToInt(worldPos.z)
            );
        }

        /// <summary>
        /// Convert block position to world position (center of block)
        /// </summary>
        public static float3 BlockToWorld(int3 blockPos)
        {
            return new float3(blockPos.x, blockPos.y, blockPos.z);
        }

        /// <summary>
        /// Convert world position to chunk position
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
        /// Convert chunk position to world position
        /// </summary>
        public static float3 ChunkToWorld(int3 chunkPos)
        {
            return new float3(
                chunkPos.x * Chunk.SIZE,
                chunkPos.y * Chunk.SIZE,
                chunkPos.z * Chunk.SIZE
            );
        }

        /// <summary>
        /// Convert world position to local chunk position
        /// </summary>
        public static int3 WorldToLocal(float3 worldPos, int3 chunkPos)
        {
            float3 chunkWorldPos = ChunkToWorld(chunkPos);
            return WorldToBlock(worldPos - chunkWorldPos);
        }

        /// <summary>
        /// Check if two block positions are adjacent
        /// </summary>
        public static bool AreAdjacent(int3 posA, int3 posB)
        {
            int3 diff = math.abs(posA - posB);
            return diff.x + diff.y + diff.z == 1;
        }

        /// <summary>
        /// Calculate distance between two positions
        /// </summary>
        public static float Distance(float3 posA, float3 posB)
        {
            return math.length(posA - posB);
        }

        /// <summary>
        /// Calculate squared distance (faster than sqrt for comparisons)
        /// </summary>
        public static float DistanceSquared(float3 posA, float3 posB)
        {
            float3 diff = posA - posB;
            return math.dot(diff, diff);
        }
    }
}
