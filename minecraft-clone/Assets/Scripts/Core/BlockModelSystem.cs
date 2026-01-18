namespace VoxelGame.Core
{
    public enum BlockModel
    {
        Cube = 0,
        Stair = 1,
        Slab = 2,
        Fence = 3,
        FenceGate = 4,
        CrossPlant = 5,
        Fluid = 6
    }

    /// <summary>
    /// Direction for directional blocks (stairs, fences)
    /// </summary>
    public enum BlockDirection
    {
        North = 0,
        East = 1,
        South = 2,
        West = 3,
        Up = 4,
        Down = 5
    }

    /// <summary>
    /// Block model data including type, direction, and state.
    /// </summary>
    public struct BlockModelData
    {
        public BlockModel modelType;
        public BlockDirection direction;
        public bool isTopSlab;
        public float fluidHeight;

        public static BlockModelData Default()
        {
            return new BlockModelData
            {
                modelType = BlockModel.Cube,
                direction = BlockDirection.North,
                isTopSlab = false,
                fluidHeight = 0.0f
            };
        }

        public static BlockModelData Stair(BlockDirection dir)
        {
            return new BlockModelData
            {
                modelType = BlockModel.Stair,
                direction = dir,
                isTopSlab = false,
                fluidHeight = 0.0f
            };
        }

        public static BlockModelData Slab(bool topSlab)
        {
            return new BlockModelData
            {
                modelType = BlockModel.Slab,
                direction = BlockDirection.North,
                isTopSlab = topSlab,
                fluidHeight = 0.0f
            };
        }

        public static BlockModelData Fence(BlockDirection dir)
        {
            return new BlockModelData
            {
                modelType = BlockModel.Fence,
                direction = dir,
                isTopSlab = false,
                fluidHeight = 0.0f
            };
        }

        public static BlockModelData CrossPlant()
        {
            return new BlockModelData
            {
                modelType = BlockModel.CrossPlant,
                direction = BlockDirection.North,
                isTopSlab = false,
                fluidHeight = 0.0f
            };
        }

        public static BlockModelData Fluid(float height)
        {
            return new BlockModelData
            {
                modelType = BlockModel.Fluid,
                direction = BlockDirection.North,
                isTopSlab = false,
                fluidHeight = height
            };
        }
    }

    /// <summary>
    /// Extended block registry with model information.
    /// Stores model type for each block type.
    /// </summary>
    public static class BlockModelRegistry
    {
        private static BlockModelData[] blockModels;

        static BlockModelRegistry()
        {
            blockModels = new BlockModelData[256];
            InitializeModels();
        }

        private static void InitializeModels()
        {
            blockModels[(int)BlockType.Stone] = BlockModelData.Default();
            blockModels[(int)BlockType.Grass] = BlockModelData.Default();
            blockModels[(int)BlockType.Dirt] = BlockModelData.Default();
            blockModels[(int)BlockType.Cobblestone] = BlockModelData.Default();

            blockModels[(int)BlockType.Planks] = BlockModelData.Stair(BlockDirection.North);
            blockModels[(int)14] = BlockModelData.Stair(BlockDirection.North);

            blockModels[(int)15] = BlockModelData.Slab(false);

            blockModels[(int)BlockType.Wood] = BlockModelData.Fence(BlockDirection.North);

            blockModels[(int)BlockType.Leaves] = BlockModelData.CrossPlant();

            blockModels[(int)BlockType.Water] = BlockModelData.Fluid(0.5f);
        }

        public static BlockModelData GetModelData(BlockType blockType)
        {
            int index = (int)blockType;
            if (index >= 0 && index < blockModels.Length)
            {
                return blockModels[index];
            }
            return BlockModelData.Default();
        }

        public static BlockModel GetModel(BlockType blockType)
        {
            return GetModelData(blockType).modelType;
        }
    }
}
