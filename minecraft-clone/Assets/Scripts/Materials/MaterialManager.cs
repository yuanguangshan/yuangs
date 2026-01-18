using UnityEngine;

namespace VoxelGame.Materials
{
    /// <summary>
    /// Manages PBR materials for all block types.
    /// Contains albedo, normal, roughness, metallic, and emissive maps for realistic rendering.
    /// </summary>
    public class MaterialManager : MonoBehaviour
    {
        public static MaterialManager Instance { get; private set; }

        [Header("Texture Atlases")]
        public Texture2D albedoAtlas;
        public Texture2D normalAtlas;
        public Texture2D roughnessAtlas;
        public Texture2D metallicAtlas;

        [Header("Material Settings")]
        public float atlasSize = 16;
        public float tileScale = 1.0f;

        private Material voxelMaterial;
        private Rect[] atlasUVs;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                Initialize();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Initialize()
        {
            InitializeMaterial();
            CalculateAtlasUVs();
        }

        private void InitializeMaterial()
        {
            Shader shader = Shader.Find("HDRP/LitTessellation");
            if (shader == null)
            {
                shader = Shader.Find("Universal Render Pipeline/Lit");
            }

            voxelMaterial = new Material(shader);

            if (albedoAtlas != null) voxelMaterial.SetTexture("_BaseMap", albedoAtlas);
            if (normalAtlas != null) voxelMaterial.SetTexture("_NormalMap", normalAtlas);
            if (roughnessAtlas != null) voxelMaterial.SetTexture("_RoughnessMap", roughnessAtlas);
            if (metallicAtlas != null) voxelMaterial.SetTexture("_MetallicMap", metallicAtlas);

            voxelMaterial.SetFloat("_Smoothness", 0.5f);
            voxelMaterial.SetFloat("_Metallic", 0.0f);
        }

        private void CalculateAtlasUVs()
        {
            int atlasPixels = albedoAtlas != null ? albedoAtlas.width : 256;
            int blockTypes = System.Enum.GetValues(typeof(BlockType)).Length;
            int tileSize = atlasPixels / blockTypes;

            atlasUVs = new Rect[blockTypes];

            for (int i = 0; i < blockTypes; i++)
            {
                float x = (i % (int)atlasSize) / atlasSize;
                float y = Mathf.Floor((float)i / atlasSize) / atlasSize;

                atlasUVs[i] = new Rect(x, y, 1.0f / atlasSize, 1.0f / atlasSize);
            }
        }

        public Material GetMaterial()
        {
            return voxelMaterial;
        }

        public Vector2[] GetBlockUVs(BlockType blockType)
        {
            Rect uvRect = atlasUVs[(int)blockType];

            Vector2[] uvs = new Vector2[4];
            uvs[0] = new Vector2(uvRect.xMin, uvRect.yMin);
            uvs[1] = new Vector2(uvRect.xMax, uvRect.yMin);
            uvs[2] = new Vector2(uvRect.xMax, uvRect.yMax);
            uvs[3] = new Vector2(uvRect.xMin, uvRect.yMax);

            return uvs;
        }

        public Vector2 GetBlockUV(BlockType blockType, int face, int vertexIndex)
        {
            Rect uvRect = atlasUVs[(int)blockType];

            switch (vertexIndex)
            {
                case 0: return new Vector2(uvRect.xMin, uvRect.yMin);
                case 1: return new Vector2(uvRect.xMax, uvRect.yMin);
                case 2: return new Vector2(uvRect.xMax, uvRect.yMax);
                case 3: return new Vector2(uvRect.xMin, uvRect.yMax);
                default: return Vector2.zero;
            }
        }
    }
}
