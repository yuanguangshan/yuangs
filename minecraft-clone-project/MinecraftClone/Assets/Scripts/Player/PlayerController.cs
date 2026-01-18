using UnityEngine;

namespace VoxelGame.Player
{
    /// <summary>
    /// First-person player controller with physics, gravity, and collision detection.
    /// Supports movement, jumping, and mouse look.
    /// </summary>
    public class PlayerController : MonoBehaviour
    {
        [Header("Movement Settings")]
        public float walkSpeed = 4.5f;
        public float sprintSpeed = 7.0f;
        public float jumpForce = 5.0f;
        public float gravity = 20.0f;

        [Header("Mouse Look")]
        public float mouseSensitivity = 2.0f;
        public float maxLookAngle = 89.0f;

        [Header("Player Dimensions")]
        public float playerHeight = 1.8f;
        public float playerWidth = 0.6f;

        private CharacterController controller;
        private Camera playerCamera;
        private float verticalRotation = 0f;
        private Vector3 velocity;
        private bool isGrounded;
        private ChunkLoader world;

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
            playerCamera = GetComponentInChildren<Camera>();
            world = FindObjectOfType<ChunkLoader>();

            if (playerCamera == null)
            {
                playerCamera = Camera.main;
            }

            Cursor.lockState = CursorLockMode.Locked;
            Cursor.visible = false;
        }

        private void Update()
        {
            HandleMouseLook();
            HandleMovement();
            HandleJump();
        }

        private void HandleMouseLook()
        {
            float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
            float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

            // Vertical look (pitch)
            verticalRotation -= mouseY;
            verticalRotation = Mathf.Clamp(verticalRotation, -maxLookAngle, maxLookAngle);
            playerCamera.transform.localRotation = Quaternion.Euler(verticalRotation, 0f, 0f);

            // Horizontal look (yaw)
            transform.Rotate(Vector3.up * mouseX);
        }

        private void HandleMovement()
        {
            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");

            bool isSprinting = Input.GetKey(KeyCode.LeftShift) || Input.GetKey(KeyCode.RightShift);
            float currentSpeed = isSprinting ? sprintSpeed : walkSpeed;

            Vector3 moveDirection = transform.right * horizontal + transform.forward * vertical;
            moveDirection = Vector3.ClampMagnitude(moveDirection, 1f);
            moveDirection *= currentSpeed;

            velocity.x = moveDirection.x;
            velocity.z = moveDirection.z;

            // Apply gravity
            velocity.y -= gravity * Time.deltaTime;

            // Move player
            controller.Move(velocity * Time.deltaTime);

            // Check if grounded
            isGrounded = controller.isGrounded;

            if (isGrounded && velocity.y < 0)
            {
                velocity.y = 0f;
            }
        }

        private void HandleJump()
        {
            if (Input.GetButtonDown("Jump") && isGrounded)
            {
                velocity.y = jumpForce;
            }
        }

        public Vector3 GetPosition()
        {
            return transform.position;
        }

        public Vector3 GetEyePosition()
        {
            return playerCamera.transform.position;
        }

        public Vector3 GetForwardDirection()
        {
            return playerCamera.transform.forward;
        }
    }
}
