using Unity.Collections;
using Unity.Mathematics;
using UnityEngine;

namespace VoxelGame.Core
{
    /// <summary>
    /// Represents a 16x16x16 chunk of voxel blocks.
    /// Chunks are the basic unit for world management and rendering.
    /// </summary>
    public class Chunk
    {
        public const int SIZE = 16;
        public const int VOLUME = SIZE * SIZE * SIZE;

        // Chunk position in world space (in chunk coordinates)
        public int3 ChunkPosition { get; private set; }

        // Block data for this chunk
        private NativeArray<Block> blocks;

        // Mesh data for rendering
        public Mesh Mesh { get; private set; }
        private Vector3[] vertices;
        private int[] triangles;
        private Vector2[] uv;
        private Color[] colors;

        // Dirty flag for mesh regeneration
        private bool isDirty;

        public Chunk(int3 chunkPosition, Allocator allocator = Allocator.Persistent)
        {
            ChunkPosition = chunkPosition;
            blocks = new NativeArray<Block>(VOLUME, allocator);
            isDirty = true;
        }

        /// <summary>
        /// Get block at local position within chunk
        /// </summary>
        public Block GetBlock(int3 localPosition)
        {
            int index = GetBlockIndex(localPosition);
            return blocks[index];
        }

        /// <summary>
        /// Set block at local position within chunk
        /// </summary>
        public void SetBlock(int3 localPosition, Block block)
        {
            int index = GetBlockIndex(localPosition);
            if (blocks[index].ID != block.ID)
            {
                blocks[index] = block;
                isDirty = true;
            }
        }

        /// <summary>
        /// Convert local position to flat array index
        /// </summary>
        private int GetBlockIndex(int3 localPosition)
        {
            return localPosition.x + localPosition.y * SIZE + localPosition.z * SIZE * SIZE;
        }

        /// <summary>
        /// Check if local position is valid within chunk
        /// </summary>
        public bool IsValidPosition(int3 localPosition)
        {
            return localPosition.x >= 0 && localPosition.x < SIZE &&
                   localPosition.y >= 0 && localPosition.y < SIZE &&
                   localPosition.z >= 0 && localPosition.z < SIZE;
        }

        /// <summary>
        /// Get world position of this chunk
        /// </summary>
        public float3 GetWorldPosition()
        {
            return new float3(
                ChunkPosition.x * SIZE,
                ChunkPosition.y * SIZE,
                ChunkPosition.z * SIZE
            );
        }

        /// <summary>
        /// Check if this chunk needs mesh regeneration
        /// </summary>
        public bool IsDirty()
        {
            return isDirty;
        }

        /// <summary>
        /// Mark chunk as dirty (mesh needs regeneration)
        /// </summary>
        public void MarkDirty()
        {
            isDirty = true;
        }

        /// <summary>
        /// Mark chunk as clean (mesh is up to date)
        /// </summary>
        public void MarkClean()
        {
            isDirty = false;
        }

        public void Dispose()
        {
            if (blocks.IsCreated)
            {
                blocks.Dispose();
            }
        }
    }
}
