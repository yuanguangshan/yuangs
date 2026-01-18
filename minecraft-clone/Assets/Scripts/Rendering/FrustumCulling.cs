using UnityEngine;

namespace VoxelGame.Rendering
{
    /// <summary>
    /// Performs frustum culling to only render chunks visible to the camera.
    /// Significant performance optimization for large worlds.
    /// </summary>
    public class FrustumCulling : MonoBehaviour
    {
        [Header("Culling Settings")]
        public float cullDistance = 150.0f;

        private Camera playerCamera;
        private Plane[] frustumPlanes;

        private void Awake()
        {
            playerCamera = Camera.main;
        }

        private void Update()
        {
            UpdateFrustum();
            CullInvisibleChunks();
        }

        private void UpdateFrustum()
        {
            if (playerCamera != null)
            {
                frustumPlanes = GeometryUtility.CalculateFrustumPlanes(playerCamera);
            }
        }

        private void CullInvisibleChunks()
        {
            ChunkRenderer[] chunkRenderers = FindObjectsOfType<ChunkRenderer>();

            foreach (ChunkRenderer renderer in chunkRenderers)
            {
                if (renderer.Chunk == null)
                {
                    continue;
                }

                bool isVisible = IsChunkVisible(renderer);

                renderer.SetVisible(isVisible);
            }
        }

        private bool IsChunkVisible(ChunkRenderer renderer)
        {
            // Check distance first (cheap)
            float3 chunkWorldPos = renderer.Chunk.GetWorldPosition();
            float distance = Vector3.Distance(chunkWorldPos, playerCamera.transform.position);

            if (distance > cullDistance)
            {
                return false;
            }

            // Check frustum (more expensive)
            Bounds chunkBounds = CalculateChunkBounds(chunkWorldPos);

            return GeometryUtility.TestPlanesAABB(frustumPlanes, chunkBounds);
        }

        private Bounds CalculateChunkBounds(float3 chunkWorldPos)
        {
            float chunkSize = Chunk.SIZE;

            Vector3 center = new Vector3(
                chunkWorldPos.x + chunkSize / 2f,
                chunkWorldPos.y + chunkSize / 2f,
                chunkWorldPos.z + chunkSize / 2f
            );

            Vector3 size = new Vector3(chunkSize, chunkSize, chunkSize);

            return new Bounds(center, size);
        }
    }
}
