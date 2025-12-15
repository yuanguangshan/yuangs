# Go Learning Path - Module 7: Pointers and Memory Management

Pointers are variables that store memory addresses rather than values. Understanding pointers is crucial for efficient Go programming, especially when working with large data structures or when you need to modify values directly.

## Understanding Pointers

In Go, variables store values directly, while pointers store the memory address of a value:

```go
package main

import "fmt"

func main() {
    // Normal variable
    var x int = 42
    
    // Pointer variable - stores address of x
    var ptr *int = &x  // & gets the address of x
    
    fmt.Printf("Value of x: %d\n", x)           // Value of x: 42
    fmt.Printf("Address of x: %p\n", &x)        // Address of x: 0x...
    fmt.Printf("Value of ptr: %p\n", ptr)       // Value of ptr: 0x... (same as address of x)
    fmt.Printf("Value pointed to by ptr: %d\n", *ptr)  // Value pointed to by ptr: 42
    
    // Modify value through pointer
    *ptr = 99  // * dereferences the pointer to access the value
    fmt.Printf("New value of x: %d\n", x)       // New value of x: 99
}
```

## Pointer Declaration and Initialization

```go
func main() {
    // Different ways to declare pointers
    var p1 *int      // Zero value is nil
    var p2 *string   // Zero value is nil
    
    // Initialize with address of variable
    x := 25
    p1 = &x
    
    // Pointer to a variable created with new()
    p3 := new(int)  // Creates int with zero value (0) and returns pointer to it
    *p3 = 30
    
    fmt.Printf("p1: %p, value: %d\n", p1, *p1)  // Points to x with value 25
    fmt.Printf("p2: %v\n", p2)                  // nil
    fmt.Printf("p3: %p, value: %d\n", p3, *p3)  // Points to new int with value 30
    
    // Check for nil
    if p2 == nil {
        fmt.Println("p2 is nil")
    }
    
    if p3 != nil {
        fmt.Println("p3 is not nil")
    }
}
```

## Pointers with Functions

Pointers allow functions to modify values passed to them:

```go
package main

import "fmt"

// Function that modifies value using pointer
func increment(n *int) {
    *n = *n + 1
}

// Function that swaps two values using pointers
func swap(a, b *int) {
    *a, *b = *b, *a
}

// Function that takes a slice pointer and modifies it
func doubleSliceValues(s *[]int) {
    for i := range *s {
        (*s)[i] *= 2
    }
}

func main() {
    x := 10
    fmt.Printf("Before increment: %d\n", x)  // 10
    increment(&x)
    fmt.Printf("After increment: %d\n", x)   // 11
    
    a, b := 5, 15
    fmt.Printf("Before swap: a=%d, b=%d\n", a, b)  // a=5, b=15
    swap(&a, &b)
    fmt.Printf("After swap: a=%d, b=%d\n", a, b)   // a=15, b=5
    
    numbers := []int{1, 2, 3, 4}
    fmt.Printf("Before doubling: %v\n", numbers)  // [1 2 3 4]
    doubleSliceValues(&numbers)
    fmt.Printf("After doubling: %v\n", numbers)   // [2 4 6 8]
}
```

## Pointers and Structs

You can create pointers to structs and access their fields:

```go
package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

// Method with value receiver
func (p Person) SetName(name string) {
    p.Name = name  // This only modifies the copy, not the original
}

// Method with pointer receiver
func (p *Person) SetAge(age int) {
    p.Age = age  // This modifies the original struct
}

// Function that takes pointer to struct
func birthday(p *Person) {
    p.Age++  // Or (*p).Age++
}

func main() {
    // Creating pointer to struct
    var person1 *Person = &Person{Name: "Alice", Age: 30}
    person2 := &Person{Name: "Bob", Age: 25}  // Shorthand
    person3 := new(Person)                    // Creates zero-valued struct
    
    fmt.Printf("person1: %+v\n", *person1)  // {Name:Alice Age:30}
    fmt.Printf("person2: %+v\n", *person2)  // {Name:Bob Age:25}
    fmt.Printf("person3: %+v\n", *person3)  // {Name: Age:0}
    
    // Accessing fields through pointer
    person1.Name = "Alice Smith"
    person3.Name = "Charlie"
    person3.Age = 22
    
    fmt.Printf("Modified person1: %+v\n", *person1)  // {Name:Alice Smith Age:30}
    fmt.Printf("Modified person3: %+v\n", *person3)  // {Name:Charlie Age:22}
    
    // Using methods
    p := &Person{Name: "David", Age: 28}
    fmt.Printf("Before birthday: %+v\n", p)
    
    birthday(p)  // The pointer is automatically dereferenced
    fmt.Printf("After birthday: %+v\n", p)  // Age incremented
    
    // Note: Go allows calling pointer methods on values and vice versa
    personVal := Person{Name: "Eve", Age: 24}
    (&personVal).SetAge(25)  // Convert to pointer to call pointer method
    fmt.Printf("After SetAge: %+v\n", personVal)  // Age changed to 25
}
```

## Pointer Receivers vs Value Receivers

Choosing between pointer and value receivers depends on your needs:

```go
package main

import "fmt"

type Counter struct {
    value int
}

// Value receiver - operates on a copy
func (c Counter) AddValue(n int) int {
    c.value += n  // Only affects the copy
    return c.value
}

// Pointer receiver - operates on the original
func (c *Counter) Add(n int) {
    c.value += n  // Affects the original
}

// Value receiver - good for methods that don't modify the struct
func (c Counter) GetValue() int {
    return c.value
}

// Pointer receiver - needed when modifying the struct
func (c *Counter) Reset() {
    c.value = 0
}

func main() {
    c := Counter{value: 10}
    
    // Using value receiver
    result := c.AddValue(5)
    fmt.Printf("Result from AddValue: %d\n", result)     // 15
    fmt.Printf("Actual value: %d\n", c.GetValue())       // Still 10
    
    // Using pointer receiver
    c.Add(5)
    fmt.Printf("After Add(5): %d\n", c.GetValue())       // 15
    
    // Both can coexist
    c.Reset()
    fmt.Printf("After reset: %d\n", c.GetValue())        // 0
}
```

## Memory Efficiency with Pointers

Using pointers can improve efficiency when dealing with large data structures:

```go
package main

import "fmt"

type LargeStruct struct {
    Data [10000]int  // Large amount of data
}

// Inefficient: copies the entire struct
func inefficientFunction(ls LargeStruct) {
    fmt.Printf("Processing struct with first value: %d\n", ls.Data[0])
    // This function receives a COPY of the entire struct
}

// Efficient: passes only the memory address
func efficientFunction(ls *LargeStruct) {
    fmt.Printf("Processing struct with first value: %d\n", ls.Data[0])
    // This function receives only the address of the struct
}

func main() {
    largeData := LargeStruct{}
    for i := 0; i < 10; i++ {
        largeData.Data[i] = i * 10
    }
    
    // Inefficient - creates copy
    inefficientFunction(largeData)
    
    // Efficient - passes reference
    efficientFunction(&largeData)
    
    // Modifying through pointer
    efficientFunction(&largeData)  // Can modify the original if needed
}
```

## Pointer to Pointers

You can have pointers to pointers (pointers with multiple levels of indirection):

```go
func main() {
    x := 5
    p1 := &x      // p1 is *int, points to x
    p2 := &p1     // p2 is **int, points to p1
    
    fmt.Printf("x: %d\n", x)                    // 5
    fmt.Printf("&x: %p, p1: %p\n", &x, p1)      // Same address
    fmt.Printf("Value at p1: %d\n", *p1)        // 5
    fmt.Printf("&p1: %p, p2: %p\n", &p1, p2)    // Same address
    fmt.Printf("Value at p2: %p\n", *p2)        // Address of x
    fmt.Printf("Value at *p2 (== p1): %d\n", **p2)  // 5
    
    // Modify through pointer to pointer
    **p2 = 10
    fmt.Printf("New value of x: %d\n", x)       // 10
}
```

## Nil Pointers and Safety

Always check for nil before dereferencing:

```go
package main

import "fmt"

func safeDereference(p *int) int {
    if p != nil {
        return *p
    }
    return 0  // Return zero value if nil
}

func doubleValue(p *int) {
    if p != nil {
        *p *= 2
    }
}

func main() {
    var p *int  // nil pointer
    
    fmt.Printf("Safe dereference of nil: %d\n", safeDereference(p))  // 0
    
    x := 42
    p = &x
    
    fmt.Printf("Value before doubling: %d\n", *p)  // 42
    doubleValue(p)
    fmt.Printf("Value after doubling: %d\n", *p)   // 84
    
    doubleValue(nil)  // Safe, no panic
    fmt.Println("No panic from doubling nil pointer")
}
```

## Pointers and Concurrency Safety

Be careful with pointers in concurrent code:

```go
package main

import (
    "fmt"
    "sync"
)

type SafeCounter struct {
    mu    sync.Mutex
    value int
}

func (sc *SafeCounter) Increment() {
    sc.mu.Lock()
    defer sc.mu.Unlock()
    sc.value++
}

func (sc *SafeCounter) Value() int {
    sc.mu.Lock()
    defer sc.mu.Unlock()
    return sc.value
}

func main() {
    counter := &SafeCounter{}
    
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Increment()  // Safe to call on same pointer from multiple goroutines
        }()
    }
    
    wg.Wait()
    fmt.Printf("Final counter value: %d\n", counter.Value())  // Should be 1000
}
```

## When to Use Pointers

### Use Pointers When:
1. You need to modify the original value
2. You're working with large data structures (for efficiency)
3. You want to represent "no value" (nil state)

### Use Values When:
1. The data is small
2. You don't want the function to modify the original
3. The data represents a simple scalar or small struct

## Memory Management with Go's Garbage Collector

Go has automatic memory management with a garbage collector, which handles memory allocation and deallocation:

```go
package main

import "fmt"

func memoryManagementExample() *int {
    x := 42  // x allocated on stack or heap (compiler decides)
    return &x  // Go's escape analysis ensures x stays alive after function returns
}

func main() {
    p := memoryManagementExample()
    fmt.Printf("Value from function: %d\n", *p)  // 42
    // No need to free memory - handled by GC
}
```

## Best Practices with Pointers

1. Don't return pointers to local stack variables (Go handles this automatically)
2. Be mindful of which methods should have pointer receivers
3. Use `new(T)` or `&T{}` to create pointers to zero values
4. Always check for nil before dereferencing
5. Use pointers with interfaces when you need to modify the underlying value

## Exercises

1. Write a function that takes two pointers to integers and sets them to the minimum and maximum of their original values.
2. Create a linked list implementation using structs with pointer fields.
3. Implement a simple bank account manager with methods that modify balances using pointer receivers.
4. Write a function that takes a pointer to a slice and appends random numbers to it.
5. Create a program that compares the performance difference between passing large structs by value versus by pointer.

---
Next: [Module 8: Concurrency with Goroutines and Channels](08-concurrency-goroutines-channels.md)