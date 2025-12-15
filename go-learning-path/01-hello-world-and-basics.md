# Go Learning Path - Module 1: Hello World & Basic Concepts

Welcome to Go programming! Go (also known as Golang) is a statically typed, compiled programming language designed at Google. This module introduces you to the basics of Go.

## Hello World Program

Let's start with the classic "Hello, World!" program:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

### Explanation:
- `package main` - Every Go program starts with a package declaration. The `main` package is special - it defines a standalone executable program.
- `import "fmt"` - Imports the `fmt` package which provides formatted I/O functions.
- `func main()` - The entry point function that gets executed when the program runs.
- `fmt.Println()` - Prints the string followed by a newline.

## How to Run Go Programs

Save your code in a file ending with `.go` extension (e.g., `hello.go`) and run:

```bash
go run hello.go
```

To compile and generate an executable:

```bash
go build hello.go
./hello        # On Unix/Linux/Mac
hello.exe      # On Windows
```

## Package Declaration

Every Go program belongs to a package. Packages help organize and reuse code:

```go
package main    // For executable programs

// Or for libraries
package utils   // A reusable package named 'utils'
```

## Import Statements

You can import multiple packages:

```go
package main

import (
    "fmt"
    "math"
)

func main() {
    fmt.Println("Square root of 16 is:", math.Sqrt(16))
}
```

## Comments

Go supports single-line and multi-line comments:

```go
// This is a single-line comment

/*
This is a
multi-line comment
*/
```

## Exercises

1. Modify the hello world program to print your name.
2. Create a program that prints multiple lines using multiple `Println` statements.
3. Experiment with the `fmt.Print()` function to see how it differs from `fmt.Println()`.

---
Next: [Module 2: Variables, Data Types, and Constants](02-variables-data-types-constants.md)