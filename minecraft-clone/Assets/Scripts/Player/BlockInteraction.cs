using UnityEngine;

namespace VoxelGame.Player
{
    /// <summary>
    /// Handles block selection, placement, and removal through raycasting.
    /// Detects block under crosshair and allows player to interact with world.
    /// </summary>
    public class BlockInteraction : MonoBehaviour
    {
        [Header("Interaction Settings")]
        public float reachDistance = 5.0f;
        public KeyCode breakBlockKey = KeyCode.Mouse0;
        public KeyCode placeBlockKey = KeyCode.Mouse1;
        public KeyCode nextBlockKey = KeyCode.E;
        public KeyCode prevBlockKey = KeyCode.Q;

        [Header("Selected Block")]
        public BlockType selectedBlock = BlockType.Stone;

        private PlayerController player;
        private Camera playerCamera;
        private ChunkLoader world;

        private void Awake()
        {
            player = GetComponent<PlayerController>();
            playerCamera = GetComponentInChildren<Camera>();
            world = FindObjectOfType<ChunkLoader>();

            if (playerCamera == null)
            {
                playerCamera = Camera.main;
            }
        }

        private void Update()
        {
            HandleBlockSelection();
            HandleBlockBreak();
            HandleBlockPlace();
            HandleBlockCycling();
        }

        private void HandleBlockSelection()
        {
            // Could add visual indicator for selected block
            // Highlight block under crosshair
        }

        private void HandleBlockBreak()
        {
            if (Input.GetKeyDown(breakBlockKey))
            {
                Vector3 eyePos = player.GetEyePosition();
                Vector3 direction = player.GetForwardDirection();

                if (Physics.Raycast(eyePos, direction, out RaycastHit hit, reachDistance))
                {
                    Vector3 blockPos = hit.point - hit.normal * 0.1f;
                    world.GetWorld().SetBlock(blockPos, Block.Empty);
                }
            }
        }

        private void HandleBlockPlace()
        {
            if (Input.GetKeyDown(placeBlockKey))
            {
                Vector3 eyePos = player.GetEyePosition();
                Vector3 direction = player.GetForwardDirection();

                if (Physics.Raycast(eyePos, direction, out RaycastHit hit, reachDistance))
                {
                    Vector3 blockPos = hit.point + hit.normal * 0.1f;

                    // Don't place block if it would intersect player
                    if (!WouldIntersectPlayer(blockPos))
                    {
                        world.GetWorld().SetBlock(blockPos, new Block((byte)selectedBlock));
                    }
                }
            }
        }

        private bool WouldIntersectPlayer(Vector3 blockPos)
        {
            Vector3 playerPos = player.GetPosition();
            float halfWidth = 0.3f;
            float halfHeight = 0.9f;

            // Check if block position is within player's bounding box
            if (blockPos.x >= playerPos.x - halfWidth && blockPos.x <= playerPos.x + halfWidth &&
                blockPos.y >= playerPos.y - halfHeight && blockPos.y <= playerPos.y + halfHeight &&
                blockPos.z >= playerPos.z - halfWidth && blockPos.z <= playerPos.z + halfWidth)
            {
                return true;
            }

            return false;
        }

        private void HandleBlockCycling()
        {
            if (Input.GetKeyDown(nextBlockKey))
            {
                CycleBlock(1);
            }
            else if (Input.GetKeyDown(prevBlockKey))
            {
                CycleBlock(-1);
            }
        }

        private void CycleBlock(int direction)
        {
            int currentBlockIndex = (int)selectedBlock;
            int maxBlockIndex = System.Enum.GetValues(typeof(BlockType)).Length - 1;

            currentBlockIndex += direction;

            if (currentBlockIndex > maxBlockIndex)
            {
                currentBlockIndex = 1; // Skip air (0)
            }
            else if (currentBlockIndex < 1)
            {
                currentBlockIndex = maxBlockIndex;
            }

            selectedBlock = (BlockType)currentBlockIndex;
            Debug.Log($"Selected block: {selectedBlock}");
        }

        public BlockType GetSelectedBlock()
        {
            return selectedBlock;
        }
    }
}
