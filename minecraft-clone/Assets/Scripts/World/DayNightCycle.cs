using UnityEngine;

namespace VoxelGame.World
{
    /// <summary>
    /// Manages dynamic lighting with day/night cycle and light sources.
    /// Implements sun/moon movement, torches, and light propagation.
    /// </summary>
    public class DayNightCycle : MonoBehaviour
    {
        [Header("Cycle Settings")]
        public float dayLengthSeconds = 120.0f;  // 2 minutes per day
        public float sunriseDuration = 10.0f;   // Dawn duration
        public float sunsetDuration = 10.0f;   // Dusk duration

        [Header("Lighting Settings")]
        public Light sunLight;
        public Light moonLight;
        public float sunIntensity = 1.2f;
        public float moonIntensity = 0.3f;

        private float currentTimeOfDay;
        private bool isDay;

        public event System.Action<bool> OnDayNightChanged;

        private void Start()
        {
            currentTimeOfDay = 0.25f; // Start at 6 AM
            SetupLights();
            UpdateLighting(0.25f);
        }

        private void SetupLights()
        {
            // Create sun light if not assigned
            if (sunLight == null)
            {
                GameObject sunObj = new GameObject("Sun");
                sunLight = sunObj.AddComponent<Light>();
                sunLight.type = LightType.Directional;
                sunLight.shadows = LightShadows.Soft;
                sunLight.shadowResolution = 2048;
                sunLight.renderMode = LightRenderMode.Auto;
            }

            // Create moon light if not assigned
            if (moonLight == null)
            {
                GameObject moonObj = new GameObject("Moon");
                moonLight = moonObj.AddComponent<Light>();
                moonLight.type = LightType.Directional;
                moonLight.shadows = LightShadows.None;  // Moon casts no shadows
                moonLight.renderMode = LightRenderMode.ForcePixel;
            }
        }

        private void Update()
        {
            // Advance time
            currentTimeOfDay += Time.deltaTime / dayLengthSeconds;
            if (currentTimeOfDay >= 1.0f)
            {
                currentTimeOfDay -= 1.0f;
            }

            UpdateLighting(currentTimeOfDay);
        }

        private void UpdateLighting(float timeOfDay)
        {
            // Time ranges (0.0-1.0):
            // 0.0-0.25: Night (12AM-6AM)
            // 0.25-0.5: Morning (6AM-12PM) - day starts at 0.25
            // 0.5-0.75: Afternoon (12PM-6PM)
            // 0.75-1.0: Evening (6PM-12AM) - night starts at 0.875

            bool nowIsDay = IsDaytime(timeOfDay);

            // Trigger day/night change event
            if (nowIsDay != isDay)
            {
                isDay = nowIsDay;
                OnDayNightChanged?.Invoke(isDay);
            }

            // Calculate sun position
            float sunAngle = CalculateSunAngle(timeOfDay);
            Vector3 sunDirection = Quaternion.Euler(sunAngle, 180f, 0f) * Vector3.forward;

            // Calculate moon position (opposite to sun)
            float moonAngle = sunAngle + 180f;
            Vector3 moonDirection = Quaternion.Euler(moonAngle, 180f, 0f) * Vector3.forward;

            sunLight.transform.rotation = Quaternion.LookRotation(sunDirection);
            sunLight.intensity = CalculateSunIntensity(timeOfDay);

            moonLight.transform.rotation = Quaternion.LookRotation(moonDirection);
            moonLight.intensity = CalculateMoonIntensity(timeOfDay);

            RenderSettings.ambientLight = CalculateAmbientColor(timeOfDay);
        }

        private bool IsDaytime(float timeOfDay)
        {
            // Day: 0.25 (6AM) to 0.75 (6PM)
            return timeOfDay >= 0.25f && timeOfDay < 0.75f;
        }

        private float CalculateSunAngle(float timeOfDay)
        {
            // Sun rises at 0.25 (6AM), sets at 0.75 (6PM)
            // Full rotation: 180 degrees during day
            float dayProgress = 0f;

            if (timeOfDay >= 0.25f && timeOfDay < 0.75f)
            {
                // Daytime: 0-180 degrees
                dayProgress = (timeOfDay - 0.25f) / 0.5f;
                return -90f + dayProgress * 180f;
            }

            // Nighttime: sun below horizon
            if (timeOfDay >= 0.75f)
            {
                // Sunset to midnight: 180-270 degrees
                dayProgress = (timeOfDay - 0.75f) / 0.25f;
                return 90f + dayProgress * 90f;
            }

            // Midnight to sunrise: 270-360 (0) degrees
            dayProgress = timeOfDay / 0.25f;
            return 270f + dayProgress * 90f;
        }

        private float CalculateSunIntensity(float timeOfDay)
        {
            // Sunrise: fade in
            if (timeOfDay >= 0.25f && timeOfDay < 0.25f + sunriseDuration / dayLengthSeconds)
            {
                float progress = (timeOfDay - 0.25f) / (sunriseDuration / dayLengthSeconds);
                return Mathf.Lerp(0f, sunIntensity, progress);
            }

            // Daytime: full intensity
            if (timeOfDay >= 0.25f && timeOfDay < 0.75f - sunsetDuration / dayLengthSeconds)
            {
                return sunIntensity;
            }

            // Sunset: fade out
            if (timeOfDay >= 0.75f - sunsetDuration / dayLengthSeconds && timeOfDay < 0.75f)
            {
                float progress = (timeOfDay - (0.75f - sunsetDuration / dayLengthSeconds)) / (sunsetDuration / dayLengthSeconds);
                return Mathf.Lerp(sunIntensity, 0f, progress);
            }

            // Nighttime: no sun
            return 0f;
        }

        private float CalculateMoonIntensity(float timeOfDay)
        {
            // Sun opposite to moon during day
            if (timeOfDay >= 0.25f && timeOfDay < 0.75f)
            {
                return 0f;
            }

            // Moonrise: fade in
            if (timeOfDay >= 0.75f && timeOfDay < 0.75f + sunriseDuration / dayLengthSeconds)
            {
                float progress = (timeOfDay - 0.75f) / (sunriseDuration / dayLengthSeconds);
                return Mathf.Lerp(0f, moonIntensity, progress);
            }

            // Nighttime: full intensity
            if (timeOfDay >= 0.75f + sunriseDuration / dayLengthSeconds || timeOfDay < 0.25f - sunsetDuration / dayLengthSeconds)
            {
                return moonIntensity;
            }

            // Moonset: fade out
            if (timeOfDay >= 0.25f - sunsetDuration / dayLengthSeconds && timeOfDay < 0.25f)
            {
                float progress = (timeOfDay - (0.25f - sunsetDuration / dayLengthSeconds)) / (sunsetDuration / dayLengthSeconds);
                return Mathf.Lerp(moonIntensity, 0f, progress);
            }

            return 0f;
        }

        private Color CalculateAmbientColor(float timeOfDay)
        {
            Color dayAmbient = new Color(0.6f, 0.6f, 0.6f);  // Bright neutral
            Color nightAmbient = new Color(0.05f, 0.05f, 0.1f);  // Dark blue

            float dayProgress;

            if (timeOfDay >= 0.25f && timeOfDay < 0.75f)
            {
                // Daytime
                return dayAmbient;
            }

            if (timeOfDay >= 0.75f && timeOfDay < 0.75f + sunriseDuration / dayLengthSeconds)
            {
                // Sunrise transition
                dayProgress = (timeOfDay - 0.75f) / (sunriseDuration / dayLengthSeconds);
                return Color.Lerp(nightAmbient, dayAmbient, dayProgress);
            }

            if (timeOfDay >= 0.25f - sunsetDuration / dayLengthSeconds && timeOfDay < 0.25f)
            {
                // Sunset transition
                dayProgress = (timeOfDay - (0.25f - sunsetDuration / dayLengthSeconds)) / (sunsetDuration / dayLengthSeconds);
                return Color.Lerp(dayAmbient, nightAmbient, dayProgress);
            }

            // Nighttime
            return nightAmbient;
        }

        public float GetTimeOfDay()
        {
            return currentTimeOfDay;
        }

        public bool IsCurrentlyDay()
        {
            return isDay;
        }
    }
}
