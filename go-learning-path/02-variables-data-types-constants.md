# Go Learning Path - Module 2: Variables, Data Types, and Constants

In this module, we'll explore Go's type system, variable declarations, and constants.

## Variable Declarations

Go has several ways to declare variables:

### Using `var` keyword
```go
package main

import "fmt"

func main() {
    var name string
    var age int
    var height float64
    
    name = "Alice"
    age = 30
    height = 5.6
    
    fmt.Printf("Name: %s, Age: %d, Height: %.1f\n", name, age, height)
}
```

### Declaring with initialization
```go
var name string = "Bob"
var age int = 25
```

### Short variable declaration (:= operator)
```go
name := "Carol"  // Type inferred as string
age := 35       // Type inferred as int
height := 5.8   // Type inferred as float64
```

### Multiple variable declarations
```go
var x, y, z int = 1, 2, 3
a, b, c := 10, 20, 30  // Multiple assignment with inference
```

## Data Types

Go has several built-in data types:

### Basic Types
```go
// Boolean
var isActive bool = true

// Numeric types
var integer int = 42
var unsignedInt uint = 42
var floatNum float64 = 3.14159
var complexNum complex64 = 1 + 2i

// String
var greeting string = "Hello, Go!"
```

### Integer Types
```go
var int8Var int8 = 127      // -128 to 127
var int16Var int16 = 32767  // -32768 to 32767
var int32Var int32 = 2147483647  // -2^31 to 2^31-1
var int64Var int64 = 9223372036854775807  // -2^63 to 2^63-1

var uint8Var uint8 = 255     // 0 to 255
var uint16Var uint16 = 65535 // 0 to 65535
var uint32Var uint32 = 4294967295  // 0 to 2^32-1
var uint64Var uint64 = 18446744073709551615  // 0 to 2^64-1
```

### Special Integer Types
```go
var byteVar byte = 65    // alias for uint8
var runeVar rune = 65    // alias for int32, represents Unicode code points
var intVar int = 100     // platform dependent size (at least 32 bits)
var uintVar uint = 200   // platform dependent size (same size as int)
```

## Constants

Constants are declared with the `const` keyword. Their values cannot be changed after declaration.

```go
package main

import "fmt"

func main() {
    const pi float64 = 3.14159
    const company string = "Acme Corp"
    const isCool = true  // Type inferred
    
    fmt.Printf("Pi: %.5f\n", pi)
    fmt.Printf("Company: %s\n", company)
    fmt.Printf("Is Cool: %t\n", isCool)
}
```

### Iota - Auto-Incrementing Constants

`iota` is a predeclared identifier that resets to 0 each time a `const` declaration is encountered and increments by 1 for each constant in the block.

```go
const (
    Sunday = iota    // 0
    Monday           // 1
    Tuesday          // 2
    Wednesday        // 3
    Thursday         // 4
    Friday           // 5
    Saturday         // 6
)

const (
    Big = 1 << 10  // 1024 (bit shift)
    Small = Big >> 10 // 1
)

func main() {
    fmt.Println("Sunday =", Sunday)      // Output: 0
    fmt.Println("Monday =", Monday)      // Output: 1
    fmt.Println("Big =", Big)            // Output: 1024
    fmt.Println("Small =", Small)        // Output: 1
}
```

## Zero Values

When a variable is declared but not initialized, it gets a default "zero value":

```go
package main

import "fmt"

func main() {
    var i int        // zero value: 0
    var f float64    // zero value: 0.0
    var b bool       // zero value: false
    var s string     // zero value: "" (empty string)
    
    fmt.Printf("%v %v %v %q\n", i, f, b, s)  // Output: 0 0 false ""
}
```

## Type Conversion

Go doesn't allow implicit conversions between types, even between numeric types:

```go
package main

import "fmt"

func main() {
    var num int = 42
    // var floatNum float64 = num  // This causes a compile error!
    
    var floatNum float64 = float64(num)  // Explicit conversion required
    var newInt int = int(floatNum)
    
    fmt.Printf("Original int: %d, Converted float: %.2f, Back to int: %d\n", 
               num, floatNum, newInt)
}
```

## Exercises

1. Write a program that declares variables of different types and prints their values.
2. Create constants for the days of the week using `iota`.
3. Convert temperature from Celsius to Fahrenheit using type conversion.
4. Declare a variable using each of the three variable declaration methods (`var`, `var` with type, short form).

---
Next: [Module 3: Functions, Methods, and Packages](03-functions-methods-packages.md)