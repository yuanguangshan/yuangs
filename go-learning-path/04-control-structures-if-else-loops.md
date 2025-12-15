# Go Learning Path - Module 4: Control Structures (if/else, loops)

Control structures determine the flow of execution in your programs. Go provides the usual conditional statements and loops with some unique features.

## If-Else Statements

The basic `if-else` statement in Go:

```go
package main

import "fmt"

func checkNumber(n int) {
    if n > 0 {
        fmt.Printf("%d is positive\n", n)
    } else if n < 0 {
        fmt.Printf("%d is negative\n", n)
    } else {
        fmt.Printf("%d is zero\n", n)
    }
}

func main() {
    checkNumber(5)   // Output: 5 is positive
    checkNumber(-3)  // Output: -3 is negative
    checkNumber(0)   // Output: 0 is zero
}
```

### Initialization Statement in If

You can include an initialization statement before the condition:

```go
package main

import "fmt"

func main() {
    // Initialize and check in one statement
    if num := 15; num > 10 {
        fmt.Printf("%d is greater than 10\n", num)
    } else {
        fmt.Printf("%d is 10 or less\n", num)
    }
    
    // The variable 'num' is only available in the if/else scope
    // fmt.Println(num)  // This would cause an error
}
```

## Switch Statement

Go's `switch` statement is more flexible than in many other languages:

```go
package main

import (
    "fmt"
    "runtime"
)

func main() {
    // Simple switch
    os := runtime.GOOS
    switch os {
    case "darwin":
        fmt.Println("OS X.")
    case "linux":
        fmt.Println("Linux.")
    default:
        // Windows, FreeBSD, etc.
        fmt.Printf("%s.\n", os)
    }
    
    // Switch without a condition (equivalent to if/else chain)
    t := 15
    switch {
    case t < 12:
        fmt.Println("Good morning!")
    case t < 17:
        fmt.Println("Good afternoon!")
    default:
        fmt.Println("Good evening!")
    }
    
    // Multiple expressions in case
    day := 6
    switch day {
    case 0, 6:  // Sunday or Saturday
        fmt.Println("Weekend!")
    case 1, 2, 3, 4, 5:  // Monday to Friday
        fmt.Println("Workday!")
    default:
        fmt.Println("Invalid day!")
    }
}
```

## Loops

Go has only one loop construct: `for`. But it's versatile enough to handle all looping needs.

### Basic For Loop

```go
package main

import "fmt"

func main() {
    // Classic for loop: init; condition; post
    for i := 0; i < 5; i++ {
        fmt.Printf("Iteration %d\n", i)
    }
    
    // While-style loop
    j := 0
    for j < 5 {
        fmt.Printf("While loop iteration %d\n", j)
        j++
    }
    
    // Infinite loop (break out with 'break' or 'return')
    counter := 0
    for {
        fmt.Printf("Infinite loop iteration %d\n", counter)
        counter++
        if counter >= 3 {
            break  // Exit the loop
        }
    }
}
```

### Looping Through Collections

#### Range Loop

The `range` keyword is used to iterate over collections (arrays, slices, maps, strings):

```go
package main

import "fmt"

func main() {
    // Range over slice
    fruits := []string{"apple", "banana", "orange"}
    for index, fruit := range fruits {
        fmt.Printf("Index: %d, Fruit: %s\n", index, fruit)
    }
    
    // If we don't need the index
    for _, fruit := range fruits {
        fmt.Printf("Fruit: %s\n", fruit)
    }
    
    // If we don't need the value
    for index := range fruits {
        fmt.Printf("Index: %d\n", index)
    }
    
    // Range over map
    ages := map[string]int{
        "Alice": 30,
        "Bob":   25,
        "Carol": 35,
    }
    
    for name, age := range ages {
        fmt.Printf("%s is %d years old\n", name, age)
    }
    
    // Range over string (returns runes, not bytes)
    text := "Hello"
    for index, char := range text {
        fmt.Printf("Character at position %d: %c\n", index, char)
    }
}
```

## Break and Continue

Use `break` to exit a loop and `continue` to skip to the next iteration:

```go
package main

import "fmt"

func main() {
    // Using break
    for i := 0; i < 10; i++ {
        if i == 5 {
            break  // Stop the loop when i equals 5
        }
        fmt.Printf("%d ", i)  // Output: 0 1 2 3 4
    }
    fmt.Println()
    
    // Using continue
    for i := 0; i < 10; i++ {
        if i%2 == 0 {
            continue  // Skip even numbers
        }
        fmt.Printf("%d ", i)  // Output: 1 3 5 7 9
    }
    fmt.Println()
    
    // Break with labels (useful for nested loops)
outerLoop:
    for i := 0; i < 3; i++ {
        for j := 0; j < 3; j++ {
            if i == 1 && j == 1 {
                break outerLoop  // Break out of the outer loop
            }
            fmt.Printf("(%d,%d) ", i, j)
        }
    }
    // Output: (0,0) (0,1) (0,2) (1,0) 
}
```

## Practical Examples

Here are some practical examples combining control structures:

### Prime Number Checker

```go
package main

import (
    "fmt"
    "math"
)

func isPrime(n int) bool {
    if n < 2 {
        return false
    }
    if n == 2 {
        return true
    }
    if n%2 == 0 {
        return false
    }
    
    // Check odd divisors up to sqrt(n)
    for i := 3; i <= int(math.Sqrt(float64(n))); i += 2 {
        if n%i == 0 {
            return false
        }
    }
    return true
}

func main() {
    numbers := []int{2, 3, 4, 17, 25, 29}
    
    for _, num := range numbers {
        if isPrime(num) {
            fmt.Printf("%d is prime\n", num)
        } else {
            fmt.Printf("%d is not prime\n", num)
        }
    }
}
```

### Fibonacci Sequence Generator

```go
package main

import "fmt"

func fibonacci(n int) {
    a, b := 0, 1
    
    for i := 0; i < n; i++ {
        fmt.Printf("%d ", a)
        a, b = b, a+b  // Simultaneous assignment
    }
    fmt.Println()
}

func main() {
    fmt.Print("First 10 Fibonacci numbers: ")
    fibonacci(10)  // Output: 0 1 1 2 3 5 8 13 21 34
}
```

## Nested Control Structures

You can nest control structures for more complex logic:

```go
package main

import "fmt"

func main() {
    matrix := [][]int{
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9},
    }
    
    for i, row := range matrix {
        for j, val := range row {
            fmt.Printf("matrix[%d][%d] = %d\n", i, j, val)
            
            // Additional logic based on conditions
            if val%2 == 0 {
                fmt.Printf("  -> %d is even\n", val)
            } else {
                fmt.Printf("  -> %d is odd\n", val)
            }
        }
    }
}
```

## Exercises

1. Write a program that finds all prime numbers between 1 and 100 using loops and conditionals.
2. Create a guessing game where the computer generates a random number and the user tries to guess it.
3. Implement a function that reverses a string using a loop.
4. Write a program that calculates the factorial of a number using different types of loops (for loop, while-style loop).
5. Create a function that takes a slice of integers and returns the largest and smallest values using control structures.

---
Next: [Module 5: Arrays, Slices, and Maps](05-arrays-slices-maps.md)