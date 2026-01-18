using UnityEngine;

namespace VoxelGame.UI
{
    /// <summary>
    /// Displays selected block type and basic player HUD information.
    /// Shows current block, FPS counter, and world position.
    /// </summary>
    public class PlayerHUD : MonoBehaviour
    {
        [Header("UI References")]
        public TMPro.TextMeshProUGUI selectedBlockText;
        public TMPro.TextMeshProUGUI fpsText;
        public TMPro.TextMeshProUGUI positionText;
        public TMPro.TextMeshProUGUI biomeText;

        private PlayerController player;
        private BlockInteraction blockInteraction;
        private float fpsUpdateTimer;

        private void Awake()
        {
            player = FindObjectOfType<PlayerController>();
            blockInteraction = FindObjectOfType<BlockInteraction>();
        }

        private void Update()
        {
            UpdateSelectedBlock();
            UpdatePosition();
            UpdateFPS();
        }

        private void UpdateSelectedBlock()
        {
            if (blockInteraction != null && selectedBlockText != null)
            {
                BlockType selectedBlock = blockInteraction.GetSelectedBlock();
                selectedBlockText.text = $"Selected: {selectedBlock}";
            }
        }

        private void UpdatePosition()
        {
            if (player != null && positionText != null)
            {
                Vector3 pos = player.GetPosition();
                positionText.text = $"Position: {pos.x:F1}, {pos.y:F1}, {pos.z:F1}";
            }
        }

        private void UpdateFPS()
        {
            fpsUpdateTimer += Time.deltaTime;

            if (fpsUpdateTimer >= 0.5f)
            {
                float fps = 1.0f / Time.deltaTime;

                if (fpsText != null)
                {
                    fpsText.text = $"FPS: {Mathf.RoundToInt(fps)}";
                }

                fpsUpdateTimer = 0f;
            }
        }
    }
}
