# Go Learning Path - Module 3: Functions, Methods, and Packages

This module explores how to define and use functions, methods, and organize code using packages in Go.

## Functions

Functions in Go are defined using the `func` keyword and can have multiple parameters and return values.

### Basic Function Definition

```go
package main

import "fmt"

// Simple function with no parameters or return values
func sayHello() {
    fmt.Println("Hello from a function!")
}

// Function with parameters
func greet(name string) {
    fmt.Printf("Hello, %s!\n", name)
}

// Function with return value
func add(a int, b int) int {
    return a + b
}

// Function with multiple return values
func divide(dividend float64, divisor float64) (float64, error) {
    if divisor == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return dividend / divisor, nil
}

func main() {
    sayHello()
    greet("Alice")
    result := add(5, 3)
    fmt.Printf("5 + 3 = %d\n", result)
    
    quotient, err := divide(10, 3)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Printf("10 / 3 = %.2f\n", quotient)
    }
}
```

### Named Return Values

Go allows you to name return values, which creates variables that hold the return values:

```go
func split(sum int) (x, y int) {
    x = sum * 4 / 9
    y = sum - x
    return  // naked return - returns x and y
}

func main() {
    a, b := split(17)
    fmt.Printf("split(17) = %d, %d\n", a, b)  // Output: 7, 10
}
```

### Multiple Parameters with Same Type

When consecutive parameters share the same type, you can omit the type for all but the last:

```go
func addThreeNumbers(x, y, z int) int {
    return x + y + z
}

func rectangleArea(width, height float64) float64 {
    return width * height
}
```

## Variadic Functions

Functions can accept variable numbers of arguments using `...`:

```go
package main

import "fmt"

func sum(nums ...int) int {
    total := 0
    for _, num := range nums {
        total += num
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))        // Output: 6
    fmt.Println(sum(1, 2, 3, 4, 5))  // Output: 15
    
    // Pass slice to variadic function
    numbers := []int{1, 2, 3, 4, 5}
    fmt.Println(sum(numbers...))     // Output: 15 (note the ... to unpack the slice)
}
```

## Anonymous Functions and Closures

Go supports anonymous functions (functions without names) that can capture variables from their surrounding scope (closures):

```go
package main

import "fmt"

func main() {
    // Anonymous function assigned to a variable
    multiply := func(a, b int) int {
        return a * b
    }
    
    fmt.Printf("3 * 4 = %d\n", multiply(3, 4))
    
    // Closure example
    nextNumber := getSequence()
    fmt.Println(nextNumber())  // Output: 1
    fmt.Println(nextNumber())  // Output: 2
    fmt.Println(nextNumber())  // Output: 3
    
    // Another closure instance
    anotherNumber := getSequence()
    fmt.Println(anotherNumber())  // Output: 1
}

func getSequence() func() int {
    i := 0
    return func() int {
        i++
        return i
    }
}
```

## Methods

Methods are functions with a receiver argument. The receiver appears in the function's signature between the `func` keyword and the method name:

```go
package main

import "fmt"

type Rectangle struct {
    width, height float64
}

// Method with pointer receiver
func (r *Rectangle) Scale(factor float64) {
    r.width *= factor
    r.height *= factor
}

// Method with value receiver
func (r Rectangle) Area() float64 {
    return r.width * r.height
}

// Method with value receiver
func (r Rectangle) Perimeter() float64 {
    return 2 * (r.width + r.height)
}

func main() {
    rect := Rectangle{width: 5, height: 3}
    
    fmt.Printf("Initial area: %.2f\n", rect.Area())
    fmt.Printf("Perimeter: %.2f\n", rect.Perimeter())
    
    rect.Scale(2)  // Doubles dimensions
    fmt.Printf("After scaling: area = %.2f, perimeter = %.2f\n", 
               rect.Area(), rect.Perimeter())
}
```

### Value Receiver vs Pointer Receiver

- Use pointer receivers when:
  - You need to modify the receiver
  - The receiver is large (to avoid copying)
  - You want to maintain consistency (if some methods of a type have pointer receivers, the rest should too)

- Use value receivers when:
  - The method doesn't need to modify the receiver
  - The receiver is small and simple

## Packages

Packages are used to organize and reuse code in Go.

### Creating Your Own Package

Create a file called `mathutils/mathutils.go`:

```go
package mathutils

// Add returns the sum of two integers
func Add(a, b int) int {
    return a + b
}

// Subtract returns the difference of two integers
func Subtract(a, b int) int {
    return a - b
}

// Multiply returns the product of two integers
func Multiply(a, b int) int {
    return a * b
}

// IsEven returns whether a number is even
func IsEven(n int) bool {
    return n%2 == 0
}
```

Then use the package in your main program:

```go
package main

import (
    "fmt"
    "./mathutils"  // Adjust import path as needed
)

func main() {
    fmt.Println(mathutils.Add(5, 3))        // Output: 8
    fmt.Println(mathutils.Multiply(4, 6))   // Output: 24
    fmt.Println(mathutils.IsEven(7))        // Output: false
}
```

### Exported vs Unexported Names

- Names starting with a capital letter are exported and can be accessed from other packages
- Names starting with a lowercase letter are unexported (private) and only accessible within the same package

```go
package geometry

// Public function (exported)
func CalculateArea(length, width float64) float64 {
    return length * width
}

// Private function (unexported)
func isValidDimension(dimension float64) bool {
    return dimension > 0
}
```

## Built-in Packages

Go has an extensive standard library. Some commonly used packages:

```go
package main

import (
    "fmt"
    "math"
    "strings"
    "time"
)

func main() {
    // math package
    fmt.Printf("Square root of 16: %.2f\n", math.Sqrt(16))
    fmt.Printf("Ceiling of 3.2: %.0f\n", math.Ceil(3.2))
    
    // strings package
    text := "Hello, World!"
    fmt.Printf("Lowercase: %s\n", strings.ToLower(text))
    fmt.Printf("Contains 'World': %t\n", strings.Contains(text, "World"))
    
    // time package
    now := time.Now()
    fmt.Printf("Current time: %s\n", now.Format("2006-01-02 15:04:05"))
}
```

## Exercises

1. Write a function that takes a slice of integers and returns the sum, average, minimum, and maximum values.
2. Create a custom type with methods to calculate geometric properties (like area, perimeter).
3. Write a calculator package with functions for addition, subtraction, multiplication, and division.
4. Explore the `fmt`, `math`, and `strings` packages and write sample programs using different functions from each.

---
Next: [Module 4: Control Structures (if/else, loops)](04-control-structures-if-else-loops.md)