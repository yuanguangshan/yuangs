using System.Collections.Generic;
using UnityEngine;

namespace VoxelGame.World
{
    /// <summary>
    /// Manages point light sources (torches, lava, etc.) in the world.
    /// Optimizes active lights and updates when blocks change.
    /// </summary>
    public class LightManager : MonoBehaviour
    {
        [Header("Light Settings")]
        public int maxActiveLights = 8;
        public float torchIntensity = 1.5f;
        public float torchRange = 10.0f;
        public float lavaIntensity = 2.0f;
        public float lavaRange = 15.0f;

        private Dictionary<int3, Light> activeLights;
        private Queue<Light> lightPool;

        private void Awake()
        {
            activeLights = new Dictionary<int3, Light>();
            lightPool = new Queue<Light>();

            InitializeLightPool();
        }

        private void InitializeLightPool()
        {
            for (int i = 0; i < maxActiveLights * 2; i++)
            {
                GameObject lightObj = new GameObject($"PooledLight_{i}");
                Light light = lightObj.AddComponent<Light>();
                light.type = LightType.Point;
                light.shadows = LightShadows.Soft;
                light.shadowResolution = 512;
                light.renderMode = LightRenderMode.ForcePixel;
                light.range = 20.0f;
                light.intensity = 0.0f;
                lightObj.SetActive(false);

                lightPool.Enqueue(light);
            }
        }

        private void OnDestroy()
        {
            foreach (var light in activeLights.Values)
            {
                if (light != null)
                {
                    Destroy(light.gameObject);
                }
            }

            while (lightPool.Count > 0)
            {
                Light light = lightPool.Dequeue();
                if (light != null)
                {
                    Destroy(light.gameObject);
                }
            }
        }

        /// <summary>
        /// Place a torch at the specified position
        /// </summary>
        public void PlaceTorch(int3 worldPosition)
        {
            if (activeLights.ContainsKey(worldPosition))
            {
                return;
            }

            Light torchLight = GetPooledLight();
            if (torchLight == null)
            {
                return;
            }

            torchLight.transform.position = new Vector3(worldPosition.x, worldPosition.y, worldPosition.z);
            torchLight.range = torchRange;
            torchLight.intensity = torchIntensity;
            torchLight.color = new Color(1.0f, 0.8f, 0.5f);
            torchLight.gameObject.SetActive(true);

            activeLights[worldPosition] = torchLight;
        }

        /// <summary>
        /// Remove light at the specified position
        /// </summary>
        public void RemoveLight(int3 worldPosition)
        {
            if (activeLights.TryGetValue(worldPosition, out Light light))
            {
                light.intensity = 0.0f;
                light.gameObject.SetActive(false);
                lightPool.Enqueue(light);
                activeLights.Remove(worldPosition);
            }
        }

        /// <summary>
        /// Update light position when block moves (if implementing movable lights)
        /// </summary>
        public void UpdateLightPosition(int3 oldPosition, int3 newPosition)
        {
            if (activeLights.TryGetValue(oldPosition, out Light light))
            {
                activeLights.Remove(oldPosition);
                activeLights[newPosition] = light;

                light.transform.position = new Vector3(newPosition.x, newPosition.y, newPosition.z);
            }
        }

        /// <summary>
        /// Create lava light effect at the specified position
        /// </summary>
        public void CreateLavaLight(int3 worldPosition)
        {
            if (activeLights.ContainsKey(worldPosition))
            {
                return;
            }

            Light lavaLight = GetPooledLight();
            if (lavaLight == null)
            {
                return;
            }

            lavaLight.transform.position = new Vector3(worldPosition.x + 0.5f, worldPosition.y + 0.5f, worldPosition.z + 0.5f);
            lavaLight.range = lavaRange;
            lavaLight.intensity = lavaIntensity;
            lavaLight.color = new Color(1.0f, 0.6f, 0.2f);
            lavaLight.gameObject.SetActive(true);

            activeLights[worldPosition] = lavaLight;
        }

        private Light GetPooledLight()
        {
            if (lightPool.Count > 0)
            {
                return lightPool.Dequeue();
            }
            return null;
        }

        /// <summary>
        /// Get total number of active lights
        /// </summary>
        public int GetActiveLightCount()
        {
            return activeLights.Count;
        }

        /// <summary>
        /// Check if there's a light at the specified position
        /// </summary>
        public bool HasLightAt(int3 worldPosition)
        {
            return activeLights.ContainsKey(worldPosition);
        }

        /// <summary>
        /// Remove all lights (useful for world reset)
        /// </summary>
        public void ClearAllLights()
        {
            foreach (var kvp in activeLights)
            {
                Light light = kvp.Value;
                light.intensity = 0.0f;
                light.gameObject.SetActive(false);
                lightPool.Enqueue(light);
            }

            activeLights.Clear();
        }
    }
}
