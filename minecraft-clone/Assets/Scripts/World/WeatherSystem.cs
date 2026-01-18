using UnityEngine;

namespace VoxelGame.World
{
    /// <summary>
    /// Manages weather states and particle effects (rain, snow, fog, lightning).
    /// Implements GPU particle systems for optimal performance.
    /// </summary>
    public class WeatherSystem : MonoBehaviour
    {
        public static WeatherSystem Instance { get; private set; }

        public enum WeatherType
        {
            Clear,
            Overcast,
            Rain,
            Storm,
            Snow,
            Blizzard
        }

        [Header("Particle Settings")]
        public GameObject rainParticlePrefab;
        public GameObject snowParticlePrefab;
        public int rainCount = 5000;
        public int snowCount = 3000;
        public float rainAreaSize = 200f;
        public float snowAreaSize = 200f;

        [Header("Weather Settings")]
        public float clearDurationMin = 300f;
        public float clearDurationMax = 600f;
        public float weatherDurationMin = 60f;
        public float weatherDurationMax = 180f;
        public float lightningInterval = 10f;
        public float lightningFlashDuration = 0.2f;

        private ParticleSystem rainSystem;
        private ParticleSystem snowSystem;
        private WeatherType currentWeather = WeatherType.Clear;
        private float weatherTimer;
        private float lightningTimer;
        private Light lightningLight;

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
            }
            else
            {
                Destroy(gameObject);
            }
        }

        private void Start()
        {
            InitializeRainSystem();
            InitializeSnowSystem();
            InitializeLightning();
        }

        private void InitializeRainSystem()
        {
            if (rainParticlePrefab != null)
            {
                GameObject rainSystemObj = new GameObject("RainSystem");
                rainSystemObj.transform.parent = transform;

                rainSystem = rainSystemObj.AddComponent<ParticleSystem>();
                var main = rainSystem.main;
                main.maxParticles = rainCount;
                main.playOnAwake = false;
                main.simulationSpace = ParticleSystemSimulationSpace.World;
                main.loop = true;
                main.prewarm = false;

                var emission = main.emission;
                emission.rateOverTime = 500f;
                emission.useBurst = false;

                var shape = main.shape;
                shape.shape = ParticleSystemShapeType.Mesh;
                shape.mesh = rainParticlePrefab.GetComponent<MeshFilter>().sharedMesh;
                shape.alignToDirection = ParticleSystemShapeAlignment.View;

                var velocityOverLifetime = main.velocityOverLifetime;
                velocityOverLifetime.enabled = true;
                AnimationCurve xCurve = new AnimationCurve();
                AnimationCurve yCurve = new AnimationCurve();
                AnimationCurve zCurve = new AnimationCurve();
                yCurve.AddKey(0f, 0f);
                yCurve.AddKey(1f, -20f);
                velocityOverLifetime.x = new ParticleSystem.MinMaxCurve(0f, 0f, xCurve);
                velocityOverLifetime.y = new ParticleSystem.MinMaxCurve(-1f, -1f, yCurve);
                velocityOverLifetime.z = new ParticleSystem.MinMaxCurve(0f, 0f, zCurve);

                var colorOverLifetime = main.colorOverLifetime;
                colorOverLifetime.enabled = true;
                Gradient colorGradient = new Gradient();
                colorGradient.SetKeys(
                    new GradientColorKey[] {
                        new GradientColorKey(0f, new Color(0.6f, 0.6f, 0.7f, 0.8f),
                        new GradientColorKey(0.5f, new Color(0.5f, 0.5f, 0.6f, 0.3f)
                    }
                );
                colorOverLifetime.color = colorGradient;

                var sizeOverLifetime = main.sizeOverLifetime;
                sizeOverLifetime.enabled = true;
                AnimationCurve sizeCurve = new AnimationCurve();
                sizeCurve.AddKey(0f, 0.1f);
                sizeCurve.AddKey(1f, 0.15f);
                sizeOverLifetime.size = new ParticleSystem.MinMaxCurve(0f, 1f, sizeCurve);

                rainSystem.Stop();
            }
        }

        private void InitializeSnowSystem()
        {
            if (snowParticlePrefab != null)
            {
                GameObject snowSystemObj = new GameObject("SnowSystem");
                snowSystemObj.transform.parent = transform;

                snowSystem = snowSystemObj.AddComponent<ParticleSystem>();
                var main = snowSystem.main;
                main.maxParticles = snowCount;
                main.playOnAwake = false;
                main.simulationSpace = ParticleSystemSimulationSpace.World;
                main.loop = true;
                main.prewarm = false;

                var emission = main.emission;
                emission.rateOverTime = 100f;
                emission.useBurst = false;

                var shape = main.shape;
                shape.shape = ParticleSystemShapeType.Mesh;
                shape.mesh = snowParticlePrefab.GetComponent<MeshFilter>().sharedMesh;
                shape.alignToDirection = ParticleSystemShapeAlignment.View;

                var velocityOverLifetime = main.velocityOverLifetime;
                velocityOverLifetime.enabled = true;
                AnimationCurve xCurve = new AnimationCurve();
                AnimationCurve yCurve = new AnimationCurve();
                AnimationCurve zCurve = new AnimationCurve();
                yCurve.AddKey(0f, 0f);
                yCurve.AddKey(1f, -3f);
                velocityOverLifetime.x = new ParticleSystem.MinMaxCurve(-0.5f, 0.5f, xCurve);
                velocityOverLifetime.y = new ParticleSystem.MinMaxCurve(-0.2f, -0.2f, yCurve);
                velocityOverLifetime.z = new ParticleSystem.MinMaxCurve(0f, 0f, zCurve);

                var rotationOverLifetime = main.rotationOverLifetime;
                rotationOverLifetime.enabled = true;
                AnimationCurve rotCurve = new AnimationCurve();
                rotCurve.AddKey(0f, 0f);
                rotCurve.AddKey(1f, 360f);
                rotationOverLifetime.z = new ParticleSystem.MinMaxCurve(0f, 360f, rotCurve);

                var colorOverLifetime = main.colorOverLifetime;
                colorOverLifetime.enabled = true;
                Gradient colorGradient = new Gradient();
                colorGradient.SetKeys(
                    new GradientColorKey[] {
                        new GradientColorKey(0f, new Color(1f, 1f, 1f, 0.9f)),
                        new GradientColorKey(1f, new Color(1f, 1f, 1f, 0.7f))
                    }
                );
                colorOverLifetime.color = colorGradient;

                var sizeOverLifetime = main.sizeOverLifetime;
                sizeOverLifetime.enabled = true;
                AnimationCurve sizeCurve = new AnimationCurve();
                sizeCurve.AddKey(0f, 0.2f);
                sizeCurve.AddKey(1f, 0.15f);
                sizeOverLifetime.size = new ParticleSystem.MinMaxCurve(0f, 1f, sizeCurve);

                snowSystem.Stop();
            }
        }

        private void InitializeLightning()
        {
            GameObject lightObj = new GameObject("Lightning");
            lightningLight = lightObj.AddComponent<Light>();
            lightningLight.type = LightType.Point;
            lightningLight.intensity = 0f;
            lightningLight.range = 1000f;
            lightningLight.color = Color.white;
            lightObj.SetActive(false);
        }

        private void Update()
        {
            weatherTimer += Time.deltaTime;

            if (currentWeather == WeatherType.Clear)
            {
                if (weatherTimer >= clearDurationMin)
                {
                    float chance = Mathf.InverseLerp(clearDurationMin, clearDurationMax, weatherTimer);
                    if (Random.value < chance * 0.001f)
                    {
                        ChangeWeather(GetRandomWeather());
                    }
                }
            }
            else
            {
                if (weatherTimer >= weatherDurationMin)
                {
                    float chance = Mathf.InverseLerp(weatherDurationMin, weatherDurationMax, weatherTimer);
                    if (Random.value < chance * 0.01f)
                    {
                        ChangeWeather(WeatherType.Clear);
                    }
                }
            }

            UpdateLightning();
        }

        private WeatherType GetRandomWeather()
        {
            float rand = Random.value;
            if (rand < 0.3f) return WeatherType.Rain;
            if (rand < 0.5f) return WeatherType.Overcast;
            if (rand < 0.7f) return WeatherType.Storm;
            if (rand < 0.85f) return WeatherType.Snow;
            return WeatherType.Blizzard;
        }

        private void ChangeWeather(WeatherType newWeather)
        {
            if (currentWeather == newWeather)
            {
                return;
            }

            currentWeather = newWeather;
            weatherTimer = 0f;

            UpdateWeatherEffects();
        }

        private void UpdateWeatherEffects()
        {
            switch (currentWeather)
            {
                case WeatherType.Clear:
                    ClearWeatherEffects();
                    break;
                case WeatherType.Overcast:
                    ClearWeatherEffects();
                    SetFogDensity(0.02f);
                    RenderSettings.skybox = CreateOvercastSkybox();
                    break;
                case WeatherType.Rain:
                    ClearWeatherEffects();
                    if (rainSystem != null) rainSystem.Play();
                    SetFogDensity(0.05f);
                    RenderSettings.skybox = CreateStormSkybox();
                    RenderSettings.ambientLight = new Color(0.3f, 0.3f, 0.35f);
                    break;
                case WeatherType.Storm:
                    ClearWeatherEffects();
                    if (rainSystem != null) rainSystem.Play();
                    SetFogDensity(0.08f);
                    RenderSettings.skybox = CreateStormSkybox();
                    RenderSettings.ambientLight = new Color(0.2f, 0.2f, 0.25f);
                    lightningTimer = 0f;
                    break;
                case WeatherType.Snow:
                    ClearWeatherEffects();
                    if (snowSystem != null) snowSystem.Play();
                    SetFogDensity(0.03f);
                    RenderSettings.skybox = CreateSnowSkybox();
                    break;
                case WeatherType.Blizzard:
                    ClearWeatherEffects();
                    if (snowSystem != null) snowSystem.Play();
                    SetFogDensity(0.06f);
                    RenderSettings.skybox = CreateSnowSkybox();
                    RenderSettings.ambientLight = new Color(0.4f, 0.4f, 0.45f);
                    break;
            }
        }

        private void ClearWeatherEffects()
        {
            if (rainSystem != null && rainSystem.isPlaying)
            {
                rainSystem.Stop();
            }
            if (snowSystem != null && snowSystem.isPlaying)
            {
                snowSystem.Stop();
            }
            SetFogDensity(0f);
            RenderSettings.ambientLight = Color.white;
        }

        private void SetFogDensity(float density)
        {
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.ExponentialSquared;
            RenderSettings.fogDensity = density;
            RenderSettings.fogColor = new Color(0.7f, 0.7f, 0.8f);
        }

        private Material CreateOvercastSkybox()
        {
            Material mat = new Material(Shader.Find("HDRP/Sky"));
            mat.SetFloat("_Exposure", 0.5f);
            mat.SetFloat("_Rotation", 0f);
            return mat;
        }

        private Material CreateStormSkybox()
        {
            Material mat = new Material(Shader.Find("HDRP/Sky"));
            mat.SetFloat("_Exposure", 0.3f);
            mat.SetFloat("_Rotation", Time.time * 0.01f);
            return mat;
        }

        private Material CreateSnowSkybox()
        {
            Material mat = new Material(Shader.Find("HDRP/Sky"));
            mat.SetFloat("_Exposure", 0.7f);
            mat.SetFloat("_Rotation", 0f);
            return mat;
        }

        private void UpdateLightning()
        {
            if (currentWeather == WeatherType.Storm)
            {
                lightningTimer += Time.deltaTime;

                if (lightningTimer >= lightningInterval)
                {
                    lightningTimer = 0f;

                    if (Random.value < 0.3f)
                    {
                        TriggerLightning();
                    }
                }
            }
        }

        private void TriggerLightning()
        {
            Vector3 randomPos = Camera.main.transform.position +
                new Vector3(
                    Random.Range(-50f, 50f),
                    Random.Range(10f, 50f),
                    Random.Range(-50f, 50f)
                );

            lightningLight.transform.position = randomPos;
            lightningLight.intensity = 10f;
            lightningLight.gameObject.SetActive(true);

            StartCoroutine(FlashLightning());
        }

        private System.Collections.IEnumerator FlashLightning()
        {
            yield return new WaitForSeconds(lightningFlashDuration);
            lightningLight.intensity = 0f;
            lightningLight.gameObject.SetActive(false);
        }

        public WeatherType GetCurrentWeather()
        {
            return currentWeather;
        }

        public bool IsRaining()
        {
            return currentWeather == WeatherType.Rain || currentWeather == WeatherType.Storm;
        }

        public bool IsSnowing()
        {
            return currentWeather == WeatherType.Snow || currentWeather == WeatherType.Blizzard;
        }
    }
}
