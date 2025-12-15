# Go Learning Path - Module 9: Error Handling and Defer/Panic/Recover

Proper error handling is essential in Go. Go's approach to error handling is explicit and idiomatic, using multiple return values where errors are returned as a second (or subsequent) value. Additionally, Go provides defer, panic, and recover for more complex error scenarios.

## Error Handling

In Go, functions often return an error value as their last return value. The caller should check this error:

```go
package main

import (
    "errors"
    "fmt"
    "strconv"
)

// Function that returns an error
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 3)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
    } else {
        fmt.Printf("Result: %.2f\n", result)
    }
    
    // This will cause an error
    result, err = divide(10, 0)
    if err != nil {
        fmt.Printf("Error: %v\n", err)  // Error: division by zero
    } else {
        fmt.Printf("Result: %.2f\n", result)
    }
}

// More detailed error with custom types
type DivideError struct {
    dividend float64
    divisor  float64
}

func (e DivideError) Error() string {
    return fmt.Sprintf("cannot divide %.2f by %.2f", e.dividend, e.divisor)
}

func divideDetailed(a, b float64) (float64, error) {
    if b == 0 {
        return 0, DivideError{dividend: a, divisor: b}
    }
    return a / b, nil
}

func mainDetailed() {
    result, err := divideDetailed(10, 0)
    if err != nil {
        fmt.Printf("Detailed error: %v\n", err)
        // Type assertion to access custom error fields
        if divErr, ok := err.(DivideError); ok {
            fmt.Printf("Tried to divide %.2f by %.2f\n", divErr.dividend, divErr.divisor)
        }
    } else {
        fmt.Printf("Result: %.2f\n", result)
    }
}
```

### Using fmt.Errorf for formatted errors

```go
package main

import (
    "errors"
    "fmt"
)

func validateAge(age int) error {
    if age < 0 {
        return fmt.Errorf("age cannot be negative: %d", age)
    }
    if age > 150 {
        return fmt.Errorf("age seems unrealistic: %d", age)
    }
    return nil
}

func processUser(name string, age int) error {
    if err := validateAge(age); err != nil {
        return fmt.Errorf("invalid user data for %s: %w", name, err)
    }
    fmt.Printf("Processing user: %s, age: %d\n", name, age)
    return nil
}

func main() {
    err := processUser("Alice", -5)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
    }
}
```

## The Defer Statement

The `defer` statement postpones the execution of a function call until the surrounding function returns:

```go
package main

import "fmt"

func main() {
    fmt.Println("First")
    
    defer fmt.Println("This will be printed second-to-last")
    defer fmt.Println("This will be printed last")
    
    fmt.Println("Second")
    
    // Defer statements are executed in LIFO (Last In, First Out) order
}

// Practical example: ensuring resources are closed
func processFile() error {
    fmt.Println("Opening file...")
    
    defer func() {
        fmt.Println("Closing file...")
        // In real code: f.Close()
    }()
    
    fmt.Println("Processing file content...")
    
    // If there's an error, the deferred function still runs
    if true { // Simulate some condition
        return fmt.Errorf("something went wrong")
    }
    
    fmt.Println("File processed successfully")
    return nil
}

func mainDefer() {
    err := processFile()
    if err != nil {
        fmt.Printf("Error occurred: %v\n", err)
    }
}
```

### Multiple Defers

```go
package main

import "fmt"

func multipleDefers() {
    for i := 0; i < 3; i++ {
        defer fmt.Printf("defer %d\n", i)
    }
    fmt.Println("End of function")
}

func main() {
    multipleDefers()
    fmt.Println("After function call")
}

// Output:
// End of function
// defer 2
// defer 1
// defer 0
// After function call
```

### Defer with Arguments Evaluation

```go
package main

import "fmt"

func deferArguments() {
    x := 1
    
    // The value of x is evaluated immediately when defer is called
    defer fmt.Printf("defer: x = %d\n", x)
    
    x = 2
    fmt.Printf("before return: x = %d\n", x)
}

func main() {
    deferArguments()
}

// Output:
// before return: x = 2
// defer: x = 1
```

## Panic and Recover

`panic` causes a run-time error that stops normal execution and begins panicking. `recover` can stop the panic and restore normal execution:

```go
package main

import "fmt"

func mightPanic(shouldPanic bool) {
    if shouldPanic {
        fmt.Println("About to panic...")
        panic("Something went terribly wrong!")
    }
    fmt.Println("No panic here")
}

func handlePanic() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Printf("Recovered from panic: %v\n", r)
        }
    }()
    
    // This won't panic
    mightPanic(false)
    
    // This will panic but be recovered
    mightPanic(true)
    
    fmt.Println("After potential panic")
}

func main() {
    handlePanic()
    fmt.Println("Continued execution after panic recovery")
}
```

### When to Use Panic

Use `panic` for truly exceptional situations, not for normal error conditions:

```go
package main

import "fmt"

func safeAccess(slice []int, index int) int {
    if index < 0 || index >= len(slice) {
        // This is an exceptional situation - don't use panic for expected errors
        panic(fmt.Sprintf("index %d out of bounds for slice of length %d", index, len(slice)))
    }
    return slice[index]
}

// Better approach for expected errors
func safeAccessWithError(slice []int, index int) (int, error) {
    if index < 0 || index >= len(slice) {
        return 0, fmt.Errorf("index %d out of bounds for slice of length %d", index, len(slice))
    }
    return slice[index], nil
}

func main() {
    slice := []int{1, 2, 3, 4, 5}
    
    // Safe access
    fmt.Printf("Element at index 2: %d\n", safeAccess(slice, 2))
    
    // Error handling approach
    if val, err := safeAccessWithError(slice, 10); err != nil {
        fmt.Printf("Error: %v\n", err)
    } else {
        fmt.Printf("Value: %d\n", val)
    }
}
```

## Comprehensive Error Handling Example

```go
package main

import (
    "errors"
    "fmt"
    "io"
    "os"
)

// Custom error types
var (
    ErrNotFound = errors.New("item not found")
    ErrPermission = errors.New("permission denied")
)

// A function that returns different types of errors
func processFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        if os.IsNotExist(err) {
            return fmt.Errorf("file %s: %w", filename, ErrNotFound)
        }
        if os.IsPermission(err) {
            return fmt.Errorf("file %s: %w", filename, ErrPermission)
        }
        return fmt.Errorf("could not open file %s: %w", filename, err)
    }
    
    // Use defer to ensure the file is closed
    defer func() {
        if closeErr := file.Close(); closeErr != nil {
            fmt.Printf("Error closing file: %v\n", closeErr)
        }
    }()
    
    // Simulate some processing that might fail
    data := make([]byte, 100)
    _, err = file.Read(data)
    if err != nil && err != io.EOF {
        return fmt.Errorf("could not read file %s: %w", filename, err)
    }
    
    fmt.Printf("Successfully processed file: %s\n", filename)
    return nil
}

func main() {
    // Test with non-existent file
    err := processFile("nonexistent.txt")
    if err != nil {
        // Check for specific error types
        if errors.Is(err, ErrNotFound) {
            fmt.Printf("File not found error: %v\n", err)
        } else {
            fmt.Printf("Other error: %v\n", err)
        }
    }
}
```

## Advanced Defer Usage

```go
package main

import "fmt"

// Defer in loops - be careful!
func badLoopDefer() {
    fmt.Println("Bad example - defer in loop:")
    for i := 0; i < 3; i++ {
        defer fmt.Printf("defer in loop: %d\n", i)
    }
    fmt.Println("Loop end")
}

func goodLoopDefer() {
    fmt.Println("\nGood example - defer in function called from loop:")
    for i := 0; i < 3; i++ {
        func(index int) {
            defer fmt.Printf("defer in function: %d\n", index)
            fmt.Printf("processing: %d\n", index)
        }(i)
    }
    fmt.Println("Function calls end")
}

func main() {
    badLoopDefer()
    goodLoopDefer()
}
```

## Panic/Recover in HTTP Handlers

```go
package main

import (
    "fmt"
    "log"
    "net/http"
)

// Middleware to recover from panics in HTTP handlers
func recoverMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if r := recover(); r != nil {
                log.Printf("Recovered from panic: %v", r)
                http.Error(w, "Internal server error", http.StatusInternalServerError)
            }
        }()
        
        next.ServeHTTP(w, r)
    }
}

func panicHandler(w http.ResponseWriter, r *http.Request) {
    panic("Something went wrong in the handler!")
}

func normalHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello, World!")
}

func main() {
    // In a real application, you'd run this
    // http.HandleFunc("/panic", recoverMiddleware(panicHandler))
    // http.HandleFunc("/normal", recoverMiddleware(normalHandler))
    // log.Fatal(http.ListenAndServe(":8080", nil))
}
```

## Best Practices

### 1. Always Check Errors

```go
// Good
data, err := someFunction()
if err != nil {
    // handle error appropriately
    return err
}
// use data safely

// Bad
data, _ := someFunction()  // ignoring error
// use data without knowing if it's valid
```

### 2. Use Defer for Cleanup

```go
// Good
func processFile(filename string) error {
    file, err := os.Open(filename)
    if err != nil {
        return err
    }
    defer file.Close()  // Guaranteed to run
    
    // Process file...
    return nil
}
```

### 3. Be Specific with Errors

```go
// Good - more informative error
func validateEmail(email string) error {
    if len(email) == 0 {
        return errors.New("email cannot be empty")
    }
    if !strings.Contains(email, "@") {
        return errors.New("invalid email format: missing @ symbol")
    }
    return nil
}
```

### 4. Don't Panic for Expected Errors

```go
// Good
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

// Avoid this for expected conditions
func dividePanic(a, b float64) float64 {
    if b == 0 {
        panic("division by zero")  // Not good for expected errors
    }
    return a / b
}
```

## Exercises

1. Write a function that reads a file, processes its content, and handles all possible errors appropriately using defer for cleanup.
2. Create a function that demonstrates the difference between panic/recover and regular error handling.
3. Implement a simple web server with proper panic recovery middleware.
4. Write a function that opens multiple resources, ensures all are closed using defer, and handles errors properly.
5. Create a custom error type with additional fields and demonstrate error wrapping using fmt.Errorf.

---
Next: [Module 10: Advanced Topics - Testing and Standard Library](10-advanced-topics-testing-standard-library.md)