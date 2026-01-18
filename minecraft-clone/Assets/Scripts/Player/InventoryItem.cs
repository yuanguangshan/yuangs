namespace VoxelGame.Player
{
    /// <summary>
    /// Represents an item in the inventory.
    /// </summary>
    public struct Item
    {
        public BlockType blockType;
        public int stackSize;
        public int maxStackSize;

        public Item(BlockType type, int count, int maxStack = 64)
        {
            blockType = type;
            stackSize = count;
            maxStackSize = maxStack;
        }

        public bool IsEmpty()
        {
            return stackSize <= 0;
        }

        public bool IsFull()
        {
            return stackSize >= maxStackSize;
        }

        public Item Copy()
        {
            return new Item(blockType, stackSize, maxStackSize);
        }
    }

    /// <summary>
    /// Represents a single inventory slot with item data.
    /// </summary>
    public struct InventorySlot
    {
        public Item item;
        public int slotIndex;

        public InventorySlot(int index, Item slotItem)
        {
            slotIndex = index;
            item = slotItem;
        }

        public bool HasItem()
        {
            return !item.IsEmpty();
        }
    }
}
