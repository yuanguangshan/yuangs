using UnityEngine;

namespace VoxelGame.World
{
    /// <summary>
    /// Central lighting system coordinator.
    /// Manages day/night cycle and point lights together.
    /// </summary>
    public class LightingSystem : MonoBehaviour
    {
        public static LightingSystem Instance { get; private set; }

        [Header("Components")]
        public DayNightCycle dayNightCycle;
        public LightManager lightManager;

        [Header("Settings")]
        public bool updateOnBlockChange = true;

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
            if (dayNightCycle == null)
            {
                dayNightCycle = GetComponentInChildren<DayNightCycle>();
            }

            if (lightManager == null)
            {
                lightManager = GetComponentInChildren<LightManager>();
            }
        }

        /// <summary>
        /// Called when a block is placed that emits light (torch, lava)
        /// </summary>
        public void OnBlockPlaced(int3 worldPosition, BlockType blockType)
        {
            if (!updateOnBlockChange)
            {
                return;
            }

            switch (blockType)
            {
                case BlockType.CoalOre:
                    lightManager.PlaceTorch(worldPosition);
                    break;
                case BlockType.Lava:
                    lightManager.CreateLavaLight(worldPosition);
                    break;
            }
        }

        /// <summary>
        /// Called when a block is removed that had a light source
        /// </summary>
        public void OnBlockRemoved(int3 worldPosition)
        {
            if (!updateOnBlockChange)
            {
                return;
            }

            if (lightManager.HasLightAt(worldPosition))
            {
                lightManager.RemoveLight(worldPosition);
            }
        }

        /// <summary>
        /// Get current light intensity at position (for ambient calculation)
        /// </summary>
        public float GetLightIntensityAt(Vector3 worldPosition)
        {
            float sunMoonIntensity = dayNightCycle.IsCurrentlyDay()
                ? dayNightCycle.sunLight.intensity
                : dayNightCycle.moonLight.intensity;

            if (sunMoonIntensity <= 0.01f)
            {
                return 0f;
            }

            float closestPointLight = 0f;

            foreach (var light in lightManager.activeLights.Values)
            {
                if (light != null && light.gameObject.activeSelf)
                {
                    float distance = Vector3.Distance(worldPosition, light.transform.position);
                    if (distance < light.range)
                    {
                        float contribution = light.intensity * (1.0f - distance / light.range);
                        closestPointLight = Mathf.Max(closestPointLight, contribution);
                    }
                }
            }

            return sunMoonIntensity + closestPointLight;
        }

        public DayNightCycle GetDayNightCycle()
        {
            return dayNightCycle;
        }

        public LightManager GetLightManager()
        {
            return lightManager;
        }
    }
}
