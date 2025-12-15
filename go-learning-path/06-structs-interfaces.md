# Go Learning Path - Module 6: Structs and Interfaces

Structs and interfaces are essential for organizing and structuring your Go code. Structs allow you to define custom data types, while interfaces enable polymorphism and abstraction.

## Structs

A struct is a collection of fields grouped together under a single type.

### Defining and Using Structs

```go
package main

import "fmt"

// Define a Person struct
type Person struct {
    Name    string
    Age     int
    Address string
}

func main() {
    // Create a struct instance
    p1 := Person{Name: "Alice", Age: 30, Address: "123 Main St"}
    
    // Another way to create a struct
    p2 := Person{"Bob", 25, "456 Oak Ave"}
    
    // Access and modify fields
    fmt.Printf("Person 1: %+v\n", p1)  // %+v prints field names
    fmt.Printf("Person 2: %+v\n", p2)
    
    // Access individual fields
    fmt.Printf("Name: %s, Age: %d\n", p1.Name, p1.Age)
    
    // Modify fields
    p1.Age = 31
    fmt.Printf("Updated age: %d\n", p1.Age)
}
```

### Struct Literals

```go
func main() {
    // Create struct with some fields specified
    p1 := Person{Name: "Carol", Age: 28}  // Address will be zero value ""
    
    // Create using new (returns pointer to zero value)
    p2 := new(Person)  // Equivalent to: p2 := &Person{}
    p2.Name = "Dave"
    p2.Age = 35
    
    fmt.Printf("p1: %+v\n", p1)
    fmt.Printf("p2: %+v\n", *p2)  // Dereference to print the value
}
```

### Struct Tags

Struct tags provide metadata about fields, often used by libraries for JSON/XML marshaling:

```go
type Employee struct {
    ID    int    `json:"employee_id"`
    Name  string `json:"full_name"`
    Email string `json:"email_address" validate:"email"`
    Age   int    `json:"age,omitempty"`  // omitempty means don't include if zero
}

func main() {
    emp := Employee{
        ID:    123,
        Name:  "John Doe",
        Email: "john@example.com",
        Age:   30,
    }
    
    fmt.Printf("Employee: %+v\n", emp)
    // The tags won't show here, but they're used by reflection
}
```

### Nested Structs

```go
type Address struct {
    Street, City, State string
    ZipCode             int
}

type Person struct {
    Name    string
    Age     int
    Address Address  // Embedded struct
}

func main() {
    person := Person{
        Name: "Jane Smith",
        Age:  27,
        Address: Address{
            Street:  "789 Pine St",
            City:    "Seattle",
            State:   "WA",
            ZipCode: 98101,
        },
    }
    
    // Access nested fields
    fmt.Printf("Name: %s\n", person.Name)
    fmt.Printf("City: %s\n", person.Address.City)
    
    // You can also use anonymous structs
    type Response struct {
        Status  string
        Payload struct {
            Message string
            Code    int
        }
    }
    
    resp := Response{
        Status: "success",
        Payload: struct {
            Message string
            Code    int
        }{
            Message: "Operation completed",
            Code:    200,
        },
    }
    
    fmt.Printf("Response: %+v\n", resp)
}
```

## Methods on Structs

Methods are functions with a special receiver argument that operates on a struct instance:

```go
package main

import "fmt"

type Rectangle struct {
    Width, Height float64
}

// Method with value receiver
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// Method with pointer receiver (to modify the struct)
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

// Method to return a new scaled rectangle (value receiver)
func (r Rectangle) Scaled(factor float64) Rectangle {
    return Rectangle{Width: r.Width * factor, Height: r.Height * factor}
}

func main() {
    rect := Rectangle{Width: 10, Height: 5}
    
    fmt.Printf("Original area: %.2f\n", rect.Area())
    
    // Scale the original rectangle
    rect.Scale(2)
    fmt.Printf("After scaling by 2: width=%.2f, height=%.2f\n", rect.Width, rect.Height)
    fmt.Printf("New area: %.2f\n", rect.Area())
    
    // Get a new scaled rectangle without modifying original
    biggerRect := rect.Scaled(1.5)
    fmt.Printf("New rectangle area: %.2f\n", biggerRect.Area())
    fmt.Printf("Original unchanged: width=%.2f, height=%.2f\n", rect.Width, rect.Height)
}
```

## Interfaces

An interface is a contract that specifies a set of methods a type must implement. Go uses duck typing: "if it walks like a duck and quacks like a duck, it's a duck."

### Basic Interface

```go
package main

import "fmt"

// Define an interface
type Shape interface {
    Area() float64
    Perimeter() float64
}

// Implement the interface with a Rectangle
type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}

// Implement the same interface with a Circle
type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return 3.14159 * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
    return 2 * 3.14159 * c.Radius
}

func main() {
    var s Shape  // Interface variable
    
    s = Rectangle{Width: 10, Height: 5}
    fmt.Printf("Rectangle area: %.2f, perimeter: %.2f\n", s.Area(), s.Perimeter())
    
    s = Circle{Radius: 5}
    fmt.Printf("Circle area: %.2f, perimeter: %.2f\n", s.Area(), s.Perimeter())
    
    // Polymorphism: use same interface for different types
    shapes := []Shape{
        Rectangle{Width: 3, Height: 4},
        Circle{Radius: 2},
        Rectangle{Width: 6, Height: 8},
        Circle{Radius: 3.5},
    }
    
    for _, shape := range shapes {
        fmt.Printf("Type: %T, Area: %.2f, Perimeter: %.2f\n", 
                   shape, shape.Area(), shape.Perimeter())
    }
}
```

### Empty Interface

The empty interface `interface{}` (or `any` in newer Go versions) can hold any type:

```go
package main

import "fmt"

func describe(i interface{}) {
    fmt.Printf("Type: %T, Value: %v\n", i, i)
}

func main() {
    // Using empty interface
    var anything interface{}
    
    anything = 42
    describe(anything)  // Type: int, Value: 42
    
    anything = "hello"
    describe(anything)  // Type: string, Value: hello
    
    anything = true
    describe(anything)  // Type: bool, Value: true
    
    // Function that accepts any type
    describe(3.14)
    describe([]int{1, 2, 3})
    describe([2]string{"hello", "world"})
}
```

### Type Assertions

Extract the concrete value from an interface:

```go
func main() {
    var i interface{} = "hello"
    
    // Type assertion to extract the value
    s := i.(string)
    fmt.Printf("String value: %s\n", s)  // hello
    
    // Safe type assertion (avoids panic)
    if str, ok := i.(string); ok {
        fmt.Printf("It's a string: %s\n", str)
    }
    
    // This would panic if i doesn't hold an int
    if num, ok := i.(int); !ok {
        fmt.Println("i is not an int")
    }
    
    // Type switches
    describeType := func(i interface{}) {
        switch v := i.(type) {
        case string:
            fmt.Printf("String: %s (length: %d)\n", v, len(v))
        case int:
            fmt.Printf("Integer: %d\n", v)
        case bool:
            fmt.Printf("Boolean: %t\n", v)
        default:
            fmt.Printf("Unknown type: %T\n", v)
        }
    }
    
    describeType("hello")
    describeType(42)
    describeType(true)
    describeType(3.14)
}
```

## Interface Composition

Interfaces can be composed from other interfaces:

```go
package main

import "fmt"

// Basic interfaces
type Speaker interface {
    Speak() string
}

type Mover interface {
    Move() string
}

// Combined interface
type Animal interface {
    Speaker
    Mover
    Name() string
}

// Dog implements Animal
type Dog struct {
    name string
}

func (d Dog) Speak() string {
    return "Woof!"
}

func (d Dog) Move() string {
    return "Running on four legs"
}

func (d Dog) Name() string {
    return d.name
}

// Cat also implements Animal
type Cat struct {
    name string
}

func (c Cat) Speak() string {
    return "Meow!"
}

func (c Cat) Move() string {
    return "Walking gracefully"
}

func (c Cat) Name() string {
    return c.name
}

func main() {
    animals := []Animal{
        Dog{name: "Buddy"},
        Cat{name: "Whiskers"},
    }
    
    for _, animal := range animals {
        fmt.Printf("%s: %s, %s, %s\n", 
                   animal.Name(), animal.Speak(), animal.Move(), "Animal")
    }
}
```

## Built-in Interfaces

Go has several important built-in interfaces, such as `error` and `Stringer`:

```go
package main

import (
    "fmt"
)

// Implement the Stringer interface
type Person struct {
    Name string
    Age  int
}

func (p Person) String() string {
    return fmt.Sprintf("%s (%d years old)", p.Name, p.Age)
}

// Custom error implementation
type CustomError struct {
    Message string
    Code    int
}

func (e CustomError) Error() string {
    return fmt.Sprintf("Error %d: %s", e.Code, e.Message)
}

func main() {
    person := Person{Name: "Alice", Age: 30}
    fmt.Println(person)  // Uses the String() method
    
    // Using custom error
    err := CustomError{Message: "Something went wrong", Code: 404}
    if err != nil {
        fmt.Println(err)  // Uses the Error() method
    }
}
```

## Advanced Interface Patterns

### The Writer/Reader Interface Pattern

```go
package main

import (
    "fmt"
    "io"
    "os"
    "strings"
)

func main() {
    // Using io.Writer interface
    var w io.Writer
    
    // os.Stdout implements io.Writer
    w = os.Stdout
    fmt.Fprint(w, "Written to stdout\n")
    
    // strings.Builder implements io.Writer
    var builder strings.Builder
    w = &builder
    fmt.Fprint(w, "Written to builder")
    fmt.Println("From builder:", builder.String())
}
```

### Functional Interface Pattern

```go
package main

import "fmt"

// Interface for operations
type Operation interface {
    Execute(x, y int) int
}

// Different implementations
type AddOp struct{}
func (AddOp) Execute(x, y int) int { return x + y }

type MultiplyOp struct{}
func (MultiplyOp) Execute(x, y int) int { return x * y }

type Calculator struct {
    op Operation
}

func (c *Calculator) Calculate(x, y int) int {
    return c.op.Execute(x, y)
}

func (c *Calculator) SetOperation(op Operation) {
    c.op = op
}

func main() {
    calc := &Calculator{op: AddOp{}}
    fmt.Printf("5 + 3 = %d\n", calc.Calculate(5, 3))
    
    calc.SetOperation(MultiplyOp{})
    fmt.Printf("5 * 3 = %d\n", calc.Calculate(5, 3))
}
```

## Exercises

1. Define a `Vehicle` interface with methods `Start()`, `Stop()`, and `GetSpeed()`, then implement it for different vehicle types (Car, Bike, Boat).
2. Create a `Drawable` interface with a `Draw()` method and implement it for shapes like Circle, Rectangle, and Triangle.
3. Implement a `Logger` interface with methods like `Info()`, `Warning()`, and `Error()`, and create different logger implementations (ConsoleLogger, FileLogger).
4. Write a function that takes an interface{} and determines its type using a type switch, printing different information depending on the type.
5. Create a `Sorter` interface with a `Sort()` method and implement different sorting algorithms (BubbleSort, QuickSort, etc.) that satisfy the interface.

---
Next: [Module 7: Pointers and Memory Management](07-pointers-memory-management.md)