# Go Learning Path - Module 10: Advanced Topics - Testing and Standard Library

This final module covers testing in Go and explores useful packages from the standard library that will enhance your Go applications.

## Testing in Go

Go has a built-in testing framework that is simple to use and promotes good testing practices.

### Basic Testing Structure

Create a file called `mathutils.go`:

```go
package main

// Add returns the sum of two integers
func Add(a, b int) int {
    return a + b
}

// Multiply returns the product of two integers
func Multiply(a, b int) int {
    return a * b
}

// IsEven returns whether a number is even
func IsEven(n int) bool {
    return n%2 == 0
}

// Fibonacci calculates the nth Fibonacci number (naive implementation)
func Fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return Fibonacci(n-1) + Fibonacci(n-2)
}
```

And a corresponding test file called `mathutils_test.go`:

```go
package main

import (
    "testing"
)

func TestAdd(t *testing.T) {
    tests := []struct {
        a, b, expected int
        name           string
    }{
        {2, 3, 5, "positive numbers"},
        {-1, 1, 0, "negative and positive"},
        {0, 0, 0, "zeros"},
        {-5, -3, -8, "negative numbers"},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; expected %d", tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

func TestMultiply(t *testing.T) {
    result := Multiply(4, 5)
    expected := 20
    
    if result != expected {
        t.Errorf("Multiply(4, 5) = %d; expected %d", result, expected)
    }
}

func TestIsEven(t *testing.T) {
    tests := []struct {
        input    int
        expected bool
        name     string
    }{
        {2, true, "even number"},
        {3, false, "odd number"},
        {0, true, "zero"},
        {-2, true, "negative even"},
        {-3, false, "negative odd"},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := IsEven(tt.input)
            if result != tt.expected {
                t.Errorf("IsEven(%d) = %t; expected %t", tt.input, result, tt.expected)
            }
        })
    }
}

func BenchmarkFibonacci(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Fibonacci(10)
    }
}

func ExampleAdd() {
    result := Add(2, 3)
    fmt.Println(result)
    // Output: 5
}
```

### Running Tests

To run tests, use the following commands:

```bash
go test                    # Run all tests in current directory
go test -v                # Verbose output
go test -run TestAdd      # Run only TestAdd tests
go test -bench=.          # Run all benchmarks
go test -cover            # Show code coverage
go test -race             # Run with race detector
```

### Table-Driven Tests

Table-driven tests are a common pattern in Go that make testing multiple scenarios easier:

```go
package main

import "testing"

func TestDivision(t *testing.T) {
    tests := []struct {
        a, b         float64
        expected     float64
        expectError  bool
        name         string
    }{
        {10, 2, 5, false, "normal division"},
        {7, 3, 2.3333333333333335, false, "non-integer result"},
        {5, 0, 0, true, "division by zero"},
        {-10, 2, -5, false, "negative number"},
        {10, -2, -5, false, "negative divisor"},
    }
    
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result, err := divide(tt.a, tt.b)
            
            if (err != nil) != tt.expectError {
                t.Errorf("divide(%f, %f): expected error=%t, got error=%v", 
                         tt.a, tt.b, tt.expectError, err)
                return
            }
            
            if !tt.expectError && result != tt.expected {
                t.Errorf("divide(%f, %f) = %f; expected %f", 
                         tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, &DivideError{a, b}
    }
    return a / b, nil
}

type DivideError struct {
    a, b float64
}

func (e *DivideError) Error() string {
    return "division by zero"
}
```

### Subtests and Test Organization

```go
package main

import (
    "testing"
)

func TestCalculator(t *testing.T) {
    // Test suite setup
    calc := &Calculator{}
    
    t.Run("Addition", func(t *testing.T) {
        tests := []struct {
            a, b, expected int
        }{
            {1, 2, 3},
            {0, 5, 5},
            {-1, 1, 0},
        }
        
        for _, tt := range tests {
            result := calc.Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; expected %d", tt.a, tt.b, result, tt.expected)
            }
        }
    })
    
    t.Run("Multiplication", func(t *testing.T) {
        tests := []struct {
            a, b, expected int
        }{
            {3, 4, 12},
            {0, 5, 0},
            {-2, 3, -6},
        }
        
        for _, tt := range tests {
            result := calc.Multiply(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Multiply(%d, %d) = %d; expected %d", tt.a, tt.b, result, tt.expected)
            }
        }
    })
}
```

## Useful Standard Library Packages

### 1. fmt - Formatted I/O

```go
package main

import (
    "fmt"
)

func main() {
    // Basic printing
    fmt.Println("Hello, World!")
    fmt.Printf("Value: %d, String: %s\n", 42, "text")
    
    // Format specifiers
    fmt.Printf("Decimal: %d, Binary: %b, Hex: %x\n", 255, 255, 255)
    fmt.Printf("Float: %.2f, Scientific: %e\n", 3.14159, 3.14159)
    fmt.Printf("Pointer address: %p\n", &[]int{1, 2, 3})
    
    // Sprintf for string formatting
    message := fmt.Sprintf("Formatted string with %d and %s", 100, "values")
    fmt.Println(message)
    
    // Reading input
    var name string
    var age int
    fmt.Print("Enter name: ")
    fmt.Scanf("%s", &name)
    fmt.Print("Enter age: ")
    fmt.Scanf("%d", &age)
    fmt.Printf("Hello %s, you are %d years old\n", name, age)
}
```

### 2. strings and strconv - String Manipulation

```go
package main

import (
    "fmt"
    "strconv"
    "strings"
)

func main() {
    // String manipulation
    text := "  Hello, World!  "
    fmt.Println(strings.TrimSpace(text))              // "Hello, World!"
    fmt.Println(strings.ToLower(text))                // "  hello, world!  "
    fmt.Println(strings.Split("a,b,c", ","))          // ["a" "b" "c"]
    fmt.Println(strings.Join([]string{"a", "b", "c"}, "-")) // "a-b-c"
    fmt.Println(strings.Contains(text, "World"))      // true
    fmt.Println(strings.Replace(text, "World", "Go", -1)) // "  Hello, Go!  "
    
    // String to number conversion
    num, _ := strconv.Atoi("42")
    fmt.Printf("Number: %d\n", num)
    
    floatNum, _ := strconv.ParseFloat("3.14159", 64)
    fmt.Printf("Float: %.3f\n", floatNum)
    
    // Number to string conversion
    str := strconv.Itoa(123)
    fmt.Printf("String: %s\n", str)
    
    // Boolean conversion
    boolVal, _ := strconv.ParseBool("true")
    fmt.Printf("Boolean: %t\n", boolVal)
}
```

### 3. time - Time and Date Handling

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    // Current time
    now := time.Now()
    fmt.Printf("Current time: %v\n", now)
    fmt.Printf("Formatted: %s\n", now.Format("2006-01-02 15:04:05"))
    
    // Creating time
    specificTime := time.Date(2023, time.March, 15, 14, 30, 0, 0, time.UTC)
    fmt.Printf("Specific time: %v\n", specificTime)
    
    // Parsing time
    parsedTime, err := time.Parse("2006-01-02", "2023-03-15")
    if err != nil {
        fmt.Printf("Error parsing time: %v\n", err)
    } else {
        fmt.Printf("Parsed time: %v\n", parsedTime)
    }
    
    // Time calculations
    oneDayLater := now.AddDate(0, 0, 1)  // Add 1 day
    oneHourAgo := now.Add(-time.Hour)     // Subtract 1 hour
    
    fmt.Printf("One day later: %v\n", oneDayLater)
    fmt.Printf("One hour ago: %v\n", oneHourAgo)
    
    // Duration calculations
    duration := oneDayLater.Sub(now)
    fmt.Printf("Duration: %v\n", duration)
    fmt.Printf("Duration in hours: %f\n", duration.Hours())
    
    // Sleep and ticker
    fmt.Println("Sleeping for 1 second...")
    time.Sleep(time.Second)
    fmt.Println("Awake!")
    
    // Ticker example
    ticker := time.NewTicker(500 * time.Millisecond)
    go func() {
        for t := range ticker.C {
            fmt.Printf("Tick at %v\n", t)
        }
    }()
    
    time.Sleep(2 * time.Second)
    ticker.Stop()
}
```

### 4. net/http - HTTP Client and Server

```go
package main

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"
)

// HTTP Client example
func httpClientExample() {
    client := &http.Client{
        Timeout: 10 * time.Second,
    }
    
    resp, err := client.Get("https://httpbin.org/get")
    if err != nil {
        fmt.Printf("Error making request: %v\n", err)
        return
    }
    defer resp.Body.Close()
    
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        fmt.Printf("Error reading response: %v\n", err)
        return
    }
    
    fmt.Printf("Status: %s\n", resp.Status)
    fmt.Printf("Body length: %d\n", len(body))
}

// HTTP Server example
func serverExample() {
    http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
        fmt.Fprintf(w, "Hello, %s!", r.URL.Query().Get("name"))
    })
    
    http.HandleFunc("/api/user", func(w http.ResponseWriter, r *http.Request) {
        user := struct {
            Name  string `json:"name"`
            Email string `json:"email"`
        }{
            Name:  "Alice",
            Email: "alice@example.com",
        }
        
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(user)
    })
    
    fmt.Println("Server starting on :8080")
    // Uncomment to run: http.ListenAndServe(":8080", nil)
}

func main() {
    httpClientExample()
}
```

### 5. encoding/json - JSON Handling

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
)

type Person struct {
    Name      string `json:"name"`
    Age       int    `json:"age"`
    Email     string `json:"email,omitempty"`  // omit if empty
    IsActive  bool   `json:"active"`
}

func main() {
    // Marshal (encode) struct to JSON
    person := Person{
        Name:     "John Doe",
        Age:      30,
        Email:    "john@example.com",
        IsActive: true,
    }
    
    jsonData, err := json.Marshal(person)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("JSON: %s\n", jsonData)
    
    // Pretty-print JSON
    prettyJSON, _ := json.MarshalIndent(person, "", "  ")
    fmt.Printf("Pretty JSON:\n%s\n", prettyJSON)
    
    // Unmarshal (decode) JSON to struct
    jsonStr := `{"name":"Jane Smith","age":25,"active":true}`
    var person2 Person
    err = json.Unmarshal([]byte(jsonStr), &person2)
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Decoded person: %+v\n", person2)
    
    // Working with maps
    var data map[string]interface{}
    json.Unmarshal([]byte(jsonStr), &data)
    fmt.Printf("As map: %+v\n", data)
    
    for key, value := range data {
        fmt.Printf("Key: %s, Value: %v (%T)\n", key, value, value)
    }
}
```

### 6. io/ioutil (deprecated) and io - File I/O

```go
package main

import (
    "fmt"
    "io"
    "os"
)

func main() {
    // Writing to file
    file, err := os.Create("example.txt")
    if err != nil {
        fmt.Printf("Error creating file: %v\n", err)
        return
    }
    defer file.Close()
    
    content := "Hello, Go file I/O!"
    _, err = file.WriteString(content)
    if err != nil {
        fmt.Printf("Error writing to file: %v\n", err)
        return
    }
    
    // Reading from file
    readfile, err := os.Open("example.txt")
    if err != nil {
        fmt.Printf("Error opening file: %v\n", err)
        return
    }
    defer readfile.Close()
    
    data, err := io.ReadAll(readfile)
    if err != nil {
        fmt.Printf("Error reading file: %v\n", err)
        return
    }
    
    fmt.Printf("File content: %s\n", string(data))
    
    // Using os.ReadFile and os.WriteFile (Go 1.16+)
    err = os.WriteFile("example2.txt", []byte("Simpler file writing"), 0644)
    if err != nil {
        fmt.Printf("Error writing file: %v\n", err)
    }
    
    content2, err := os.ReadFile("example2.txt")
    if err != nil {
        fmt.Printf("Error reading file: %v\n", err)
    } else {
        fmt.Printf("Simple read: %s\n", string(content2))
    }
}
```

## Complete Example: Building a REST API

Here's a complete example that uses multiple standard library packages:

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strconv"
    "sync"
    "time"
)

// User represents a user in our system
type User struct {
    ID        int       `json:"id"`
    Name      string    `json:"name"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

// UserService manages users with thread safety
type UserService struct {
    mu    sync.RWMutex
    users map[int]User
    nextID int
}

// NewUserService creates a new user service
func NewUserService() *UserService {
    return &UserService{
        users:  make(map[int]User),
        nextID: 1,
    }
}

// AddUser adds a new user
func (s *UserService) AddUser(name, email string) User {
    s.mu.Lock()
    defer s.mu.Unlock()
    
    user := User{
        ID:        s.nextID,
        Name:      name,
        Email:     email,
        CreatedAt: time.Now(),
    }
    
    s.users[s.nextID] = user
    s.nextID++
    
    return user
}

// GetUser retrieves a user by ID
func (s *UserService) GetUser(id int) (User, bool) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    
    user, exists := s.users[id]
    return user, exists
}

// GetAllUsers returns all users
func (s *UserService) GetAllUsers() []User {
    s.mu.RLock()
    defer s.mu.RUnlock()
    
    users := make([]User, 0, len(s.users))
    for _, user := range s.users {
        users = append(users, user)
    }
    
    // Sort by ID
    for i := 0; i < len(users)-1; i++ {
        for j := i + 1; j < len(users); j++ {
            if users[i].ID > users[j].ID {
                users[i], users[j] = users[j], users[i]
            }
        }
    }
    
    return users
}

// Handler functions for the HTTP server
func (s *UserService) createUserHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
        return
    }
    
    var req struct {
        Name  string `json:"name"`
        Email string `json:"email"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }
    
    if req.Name == "" || req.Email == "" {
        http.Error(w, "Name and email are required", http.StatusBadRequest)
        return
    }
    
    user := s.AddUser(req.Name, req.Email)
    
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func (s *UserService) getUserHandler(w http.ResponseWriter, r *http.Request) {
    idStr := r.URL.Path[len("/users/"):]
    id, err := strconv.Atoi(idStr)
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    user, exists := s.GetUser(id)
    if !exists {
        http.Error(w, "User not found", http.StatusNotFound)
        return
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}

func (s *UserService) getAllUsersHandler(w http.ResponseWriter, r *http.Request) {
    users := s.GetAllUsers()
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

func main() {
    service := NewUserService()
    
    // Add some sample users
    service.AddUser("Alice Johnson", "alice@example.com")
    service.AddUser("Bob Smith", "bob@example.com")
    
    // Set up HTTP routes
    http.HandleFunc("/users", service.getAllUsersHandler)
    http.HandleFunc("/users/", service.getUserHandler)
    http.HandleFunc("/create", service.createUserHandler)
    
    fmt.Println("Server starting on :8080")
    fmt.Println("Try these endpoints:")
    fmt.Println("  GET  /users          - Get all users")
    fmt.Println("  GET  /users/1        - Get user with ID 1")
    fmt.Println("  POST /create        - Create a new user")
    
    log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## Best Practices

### 1. Testing Best Practices

```go
// Use table-driven tests
func TestMathOperations(t *testing.T) {
    tests := []struct {
        a, b, expected int
        operation      string
        shouldFail     bool
    }{
        {2, 3, 5, "add", false},
        {5, 3, 2, "subtract", false},
        {0, 0, 0, "add", false},
    }
    
    // ... test implementation
}

// Write example functions for documentation
func ExampleAdd() {
    result := Add(2, 3)
    fmt.Println(result)
    // Output: 5
}
```

### 2. Error Handling Best Practices

```go
import "errors"

// Create sentinel errors for common cases
var (
    ErrNotFound = errors.New("item not found")
    ErrInvalidInput = errors.New("invalid input provided")
)

// Wrap errors with context when passing up the call stack
func processData(data string) error {
    if len(data) == 0 {
        return fmt.Errorf("processData: %w", ErrInvalidInput)
    }
    // ... processing logic
    return nil
}
```

### 3. Standard Library Best Practices

```go
import (
    "context"
    "time"
)

// Use context for cancellation and timeouts
func apiCall(ctx context.Context) error {
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()
    
    // Use the context with HTTP clients, database operations, etc.
    req, err := http.NewRequestWithContext(ctx, "GET", "http://api.example.com", nil)
    if err != nil {
        return err
    }
    
    // ... make request
    return nil
}
```

## Exercises

1. Write comprehensive tests for a string utility package with functions for validation and transformation.
2. Create a simple web API that uses JSON, HTTP handlers, and proper error handling.
3. Implement a file processing utility that reads, modifies, and writes files using the io package.
4. Build a simple web scraper that fetches multiple URLs concurrently and processes the responses.
5. Create a command-line tool that accepts flags and reads from stdin using the flag and bufio packages.

## Conclusion

Congratulations on completing this Go learning path! You've covered:

1. Basic syntax and "Hello World"
2. Variables, data types, and constants
3. Functions, methods, and packages
4. Control structures (if/else, loops)
5. Arrays, slices, and maps
6. Structs and interfaces
7. Pointers and memory management
8. Concurrency with goroutines and channels
9. Error handling and defer/panic/recover
10. Testing and standard library usage

You now have a solid foundation in Go programming. Continue practicing by building projects, contributing to open-source Go projects, and reading existing Go code to become proficient.