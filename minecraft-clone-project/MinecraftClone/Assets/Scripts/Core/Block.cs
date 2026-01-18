namespace VoxelGame.Core
{
    /// <summary>
    /// Represents a single voxel block in the world.
    /// Using byte for block ID allows up to 256 block types.
    /// </summary>
    public struct Block
    {
        public byte ID;

        public Block(byte id)
        {
            ID = id;
        }

        public static Block Empty => new Block(0);

        public bool IsEmpty => ID == 0;
    }
}
