using UnityEngine;
using VoxelGame.Core;

namespace VoxelGame.Utils
{
    /// <summary>
    /// Central game manager that initializes and coordinates all game systems.
    /// Singleton pattern for easy access from all components.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("World Settings")]
        public ulong worldSeed = 12345;
        public int renderDistance = 8;

        [Header("Player Settings")]
        public GameObject playerPrefab;

        private VoxelWorld world;
        private PlayerController player;
        private ChunkLoader chunkLoader;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                InitializeGame();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void InitializeGame()
        {
            world = new VoxelWorld(worldSeed, renderDistance);
            CreatePlayer();
            InitializeSystems();
        }

        private void CreatePlayer()
        {
            if (playerPrefab != null)
            {
                GameObject playerObj = Instantiate(playerPrefab, new Vector3(0, 50, 0), Quaternion.identity);
                player = playerObj.GetComponent<PlayerController>();
            }
            else
            {
                Debug.LogError("Player prefab not assigned in GameManager!");
            }
        }

        private void InitializeSystems()
        {
            chunkLoader = FindObjectOfType<ChunkLoader>();
            if (chunkLoader != null)
            {
                chunkLoader.worldSeed = worldSeed;
                chunkLoader.renderDistance = renderDistance;
            }
        }

        public VoxelWorld GetWorld()
        {
            return world;
        }

        public PlayerController GetPlayer()
        {
            return player;
        }

        public ChunkLoader GetChunkLoader()
        {
            return chunkLoader;
        }
    }
}
