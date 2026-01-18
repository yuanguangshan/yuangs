using UnityEngine;

namespace VoxelGame.Rendering
{
    /// <summary>
    /// Handles chunk mesh rendering with frustum culling and material assignment.
    /// Renders only visible chunks for optimal performance.
    /// </summary>
    public class ChunkRenderer : MonoBehaviour
    {
        public Chunk Chunk { get; private set; }
        public MeshRenderer MeshRenderer { get; private set; }
        public MeshFilter MeshFilter { get; private set; }

        private void Awake()
        {
            MeshFilter = GetComponent<MeshFilter>();
            MeshRenderer = GetComponent<MeshRenderer>();

            if (MeshFilter == null)
            {
                MeshFilter = gameObject.AddComponent<MeshFilter>();
            }

            if (MeshRenderer == null)
            {
                MeshRenderer = gameObject.AddComponent<MeshRenderer>();
            }

            InitializeMaterial();
        }

        private void InitializeMaterial()
        {
            if (MaterialManager.Instance != null)
            {
                MeshRenderer.material = MaterialManager.Instance.GetMaterial();
            }
        }

        public void SetChunk(Chunk chunk)
        {
            Chunk = chunk;
            UpdateMesh();
        }

        public void UpdateMesh()
        {
            if (Chunk == null || Chunk.Mesh == null)
            {
                return;
            }

            if (MeshFilter.sharedMesh != Chunk.Mesh)
            {
                MeshFilter.sharedMesh = Chunk.Mesh;
            }
        }

        public void SetVisible(bool visible)
        {
            if (MeshRenderer != null)
            {
                MeshRenderer.enabled = visible;
            }
        }

        public bool IsVisible()
        {
            return MeshRenderer != null && MeshRenderer.enabled;
        }
    }
}
