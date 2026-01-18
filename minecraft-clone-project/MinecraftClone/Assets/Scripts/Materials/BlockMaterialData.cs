using UnityEngine;

namespace VoxelGame.Materials
{
    /// <summary>
    /// Defines material properties for each block type for PBR rendering.
    /// Includes roughness, metallic, emissive, and transparency settings.
    /// </summary>
    [CreateAssetMenu(fileName = "BlockMaterialData", menuName = "VoxelGame/Block Material Data")]
    public class BlockMaterialData : ScriptableObject
    {
        [System.Serializable]
        public struct BlockProperties
        {
            [Range(0f, 1f)] public float roughness;
            [Range(0f, 1f)] public float metallic;
            [Range(0f, 1f)] public float emissiveIntensity;
            public bool isTransparent;
            public bool isEmissive;
        }

        public BlockProperties[] blockProperties;

        public BlockProperties GetProperties(BlockType blockType)
        {
            int index = (int)blockType;
            if (index >= 0 && index < blockProperties.Length)
            {
                return blockProperties[index];
            }
            return new BlockProperties { roughness = 0.5f, metallic = 0.0f, isTransparent = false };
        }
    }
}
