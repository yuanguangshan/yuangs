namespace VoxelGame.Core
{
    /// <summary>
    /// Defines all block types in the game.
    /// ID 0 is reserved for empty blocks (air).
    /// </summary>
    public enum BlockType
    {
        Air = 0,
        Stone = 1,
        Grass = 2,
        Dirt = 3,
        Cobblestone = 4,
        Wood = 5,
        Leaves = 6,
        Sand = 7,
        Water = 8,
        Bedrock = 9,
        CoalOre = 10,
        IronOre = 11,
        GoldOre = 12,
        DiamondOre = 13,
        Planks = 14,
        Glass = 15
    }

    /// <summary>
    /// Block type registry for fast lookups and metadata.
    /// In a production system, this would contain texture UVs, solid/transparent flags,
    /// material properties, and other per-block data.
    /// </summary>
    public static class BlockRegistry
    {
        private static BlockData[] blockData;

        static BlockRegistry()
        {
            blockData = new BlockData[16];

            InitializeBlockData();
        }

        private static void InitializeBlockData()
        {
            SetBlockData(BlockType.Air, transparent: true, solid: false);
            SetBlockData(BlockType.Stone, transparent: false, solid: true);
            SetBlockData(BlockType.Grass, transparent: false, solid: true);
            SetBlockData(BlockType.Dirt, transparent: false, solid: true);
            SetBlockData(BlockType.Cobblestone, transparent: false, solid: true);
            SetBlockData(BlockType.Wood, transparent: false, solid: true);
            SetBlockData(BlockType.Leaves, transparent: true, solid: true);
            SetBlockData(BlockType.Sand, transparent: false, solid: true);
            SetBlockData(BlockType.Water, transparent: true, solid: false);
            SetBlockData(BlockType.Bedrock, transparent: false, solid: true, indestructible: true);
            SetBlockData(BlockType.CoalOre, transparent: false, solid: true);
            SetBlockData(BlockType.IronOre, transparent: false, solid: true);
            SetBlockData(BlockType.GoldOre, transparent: false, solid: true);
            SetBlockData(BlockType.DiamondOre, transparent: false, solid: true);
            SetBlockData(BlockType.Planks, transparent: false, solid: true);
            SetBlockData(BlockType.Glass, transparent: true, solid: true);
        }

        private static void SetBlockData(BlockType type, bool transparent, bool solid, bool indestructible = false)
        {
            blockData[(int)type] = new BlockData
            {
                transparent = transparent,
                solid = solid,
                indestructible = indestructible
            };
        }

        public static BlockData GetData(BlockType type)
        {
            return blockData[(int)type];
        }

        public static bool IsTransparent(BlockType type)
        {
            return blockData[(int)type].transparent;
        }

        public static bool IsSolid(BlockType type)
        {
            return blockData[(int)type].solid;
        }
    }

    public struct BlockData
    {
        public bool transparent;
        public bool solid;
        public bool indestructible;
    }
}
