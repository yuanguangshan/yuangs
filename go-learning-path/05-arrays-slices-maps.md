# Go Learning Path - Module 5: Arrays, Slices, and Maps

Arrays, slices, and maps are fundamental data structures in Go. Understanding their differences and proper usage is crucial for writing effective Go programs.

## Arrays

An array is a numbered sequence of elements of a specific length. The size is part of the array's type.

```go
package main

import "fmt"

func main() {
    // Declaration: [size]Type
    var arr1 [5]int                  // Array of 5 integers, all initialized to 0
    var arr2 [3]string               // Array of 3 strings, all initialized to ""
    
    // Declaration with initialization
    arr3 := [3]int{1, 2, 3}         // Array literal
    arr4 := [5]int{1, 2, 3}         // Initialized: [1, 2, 3, 0, 0]
    arr5 := [...]int{1, 2, 3, 4}    // Size inferred: [1, 2, 3, 4]
    
    // Index access
    arr1[0] = 10
    arr1[4] = 20
    
    fmt.Println("arr1:", arr1)       // [10 0 0 0 20]
    fmt.Println("arr3:", arr3)       // [1 2 3]
    fmt.Println("arr4:", arr4)       // [1 2 3 0 0]
    fmt.Println("arr5:", arr5)       // [1 2 3 4]
    
    // Get array size
    fmt.Println("Size of arr1:", len(arr1))  // 5
}
```

### Iterating Over Arrays

```go
func main() {
    numbers := [5]int{10, 20, 30, 40, 50}
    
    // Using range
    for index, value := range numbers {
        fmt.Printf("numbers[%d] = %d\n", index, value)
    }
    
    // Traditional for loop
    for i := 0; i < len(numbers); i++ {
        fmt.Printf("numbers[%d] = %d\n", i, numbers[i])
    }
}
```

## Slices

A slice is a dynamically-sized, flexible view of an array. It's more common than arrays in Go.

```go
package main

import "fmt"

func main() {
    // Slice from array
    arr := [5]int{1, 2, 3, 4, 5}
    slice1 := arr[1:4]              // [2, 3, 4] - elements from index 1 to 3
    
    // Slice literal
    slice2 := []int{1, 2, 3, 4}     // Creates a slice (not an array!)
    
    // Using make to create slice
    slice3 := make([]int, 5)        // Length: 5, Capacity: 5, all zeros
    slice4 := make([]int, 3, 10)    // Length: 3, Capacity: 10
    
    fmt.Println("slice1:", slice1)  // [2 3 4]
    fmt.Println("slice2:", slice2)  // [1 2 3 4]
    fmt.Println("slice3:", slice3)  // [0 0 0 0 0]
    fmt.Println("slice4:", slice4)  // [0 0 0]
    
    // Get length and capacity
    fmt.Printf("slice2 length: %d, capacity: %d\n", len(slice2), cap(slice2))
}
```

### Important Properties of Slices

```go
func main() {
    // Slicing operations
    slice := []int{0, 1, 2, 3, 4, 5}
    
    s1 := slice[2:4]    // [2, 3]
    s2 := slice[:3]     // [0, 1, 2]
    s3 := slice[2:]     // [2, 3, 4, 5]
    s4 := slice[:]      // Copy of entire slice [0, 1, 2, 3, 4, 5]
    
    fmt.Println("s1:", s1)  // [2 3]
    fmt.Println("s2:", s2)  // [0 1 2]
    fmt.Println("s3:", s3)  // [2 3 4 5]
    fmt.Println("s4:", s4)  // [0 1 2 3 4 5]
    
    // Modifying elements affects the underlying array
    slice[0] = 100
    fmt.Println("After modifying slice[0]:", s4)  // [100 1 2 3 4 5]
}
```

### Adding Elements to Slices

Use the `append` function to add elements to slices:

```go
func main() {
    // Starting with empty slice
    var numbers []int
    
    // Append single elements
    numbers = append(numbers, 1)
    numbers = append(numbers, 2, 3, 4)  // Multiple elements
    fmt.Println("After appends:", numbers)  // [1 2 3 4]
    
    // Append another slice
    moreNumbers := []int{5, 6, 7}
    numbers = append(numbers, moreNumbers...)  // Note the ... to expand the slice
    fmt.Println("After appending slice:", numbers)  // [1 2 3 4 5 6 7]
    
    // Common pattern: growing slice
    primes := []int{2, 3, 5}
    for i := 0; i < 3; i++ {
        primes = append(primes, primes[i]*2)
    }
    fmt.Println("Final primes:", primes)  // [2 3 5 4 6 10]
}
```

### Copying Slices

```go
func main() {
    original := []int{1, 2, 3, 4, 5}
    
    // Using copy function
    copied := make([]int, len(original))
    copy(copied, original)  // src to dst: copy(dst, src)
    
    fmt.Println("Original:", original)  // [1 2 3 4 5]
    fmt.Println("Copied:", copied)      // [1 2 3 4 5]
    
    // Modifying one doesn't affect the other
    copied[0] = 100
    fmt.Println("After modifying copied:")
    fmt.Println("Original:", original)  // [1 2 3 4 5]
    fmt.Println("Copied:", copied)      // [100 2 3 4 5]
}
```

## Maps

Maps are Go's implementation of hash tables/key-value stores:

```go
package main

import "fmt"

func main() {
    // Declaration: map[keyType]valueType
    var ages map[string]int
    
    // Create using make
    ages = make(map[string]int)
    ages["Alice"] = 30
    ages["Bob"] = 25
    
    // Map literal
    scores := map[string]int{
        "Math":    95,
        "Science": 87,
        "English": 92,
    }
    
    // Alternative creation with make
    capitals := make(map[string]string, 3)
    capitals["France"] = "Paris"
    capitals["Japan"] = "Tokyo"
    
    fmt.Println("Ages:", ages)        // map[Alice:30 Bob:25]
    fmt.Println("Scores:", scores)    // map[English:92 Math:95 Science:87]
    fmt.Println("Capitals:", capitals) // map[France:Paris Japan:Tokyo]
}
```

### Working with Maps

```go
func main() {
    inventory := map[string]int{
        "apples": 10,
        "bananas": 5,
        "oranges": 8,
    }
    
    // Accessing values
    apples := inventory["apples"]
    fmt.Printf("Apples in stock: %d\n", apples)  // 10
    
    // Checking if key exists
    oranges, exists := inventory["oranges"]
    if exists {
        fmt.Printf("Oranges in stock: %d\n", oranges)  // 8
    } else {
        fmt.Println("Oranges not found")
    }
    
    // Checking for non-existent key
    pears, exists := inventory["pears"]
    if !exists {
        fmt.Println("Pears not in inventory")  // This will print
    }
    fmt.Printf("Value for non-existent key: %d\n", pears)  // 0 (zero value)
    
    // Updating values
    inventory["apples"] = 15
    inventory["grapes"] = 12  // Adding new key-value pair
    
    // Deleting keys
    delete(inventory, "bananas")
    
    fmt.Println("Updated inventory:", inventory)
    // map[apples:15 grapes:12 oranges:8]
    
    // Iterating over maps
    for item, count := range inventory {
        fmt.Printf("%s: %d\n", item, count)
    }
}
```

## Advanced Slice Operations

### Slice Tricks

```go
func main() {
    // Filtering without allocating new slice
    numbers := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}
    
    // Keep only even numbers
    result := []int{}
    for _, v := range numbers {
        if v%2 == 0 {
            result = append(result, v)
        }
    }
    fmt.Println("Even numbers:", result)  // [2 4 6 8 10]
    
    // Removing duplicates
    nums := []int{1, 2, 2, 3, 3, 3, 4, 5, 5}
    seen := make(map[int]bool)
    result = []int{}
    
    for _, v := range nums {
        if !seen[v] {
            seen[v] = true
            result = append(result, v)
        }
    }
    fmt.Println("Without duplicates:", result)  // [1 2 3 4 5]
}
```

### Slice Capacity Growth

Understanding capacity is important for performance:

```go
func main() {
    slice := make([]int, 0, 1)  // Start with capacity 1
    
    for i := 0; i < 10; i++ {
        oldCap := cap(slice)
        slice = append(slice, i)
        newCap := cap(slice)
        
        if newCap != oldCap {
            fmt.Printf("Capacity increased from %d to %d at element %d\n", 
                       oldCap, newCap, i)
        }
    }
    // Output might show capacity doubling at certain points
}
```

## Practical Examples

### Using Slices and Maps Together

```go
package main

import "fmt"

func main() {
    // Student grades system
    gradeBook := map[string][]float64{
        "Alice": {85, 92, 78, 96},
        "Bob":   {76, 81, 89},
        "Carol": {95, 98, 100, 87, 92},
    }
    
    // Add a new grade for Alice
    gradeBook["Alice"] = append(gradeBook["Alice"], 88)
    
    // Calculate averages
    for student, grades := range gradeBook {
        sum := 0.0
        for _, grade := range grades {
            sum += grade
        }
        average := sum / float64(len(grades))
        fmt.Printf("%s's average: %.2f\n", student, average)
    }
}
```

### Managing Variable-Length Sequences

```go
// Function to find all indices of a value in a slice
func findAllIndices(slice []int, target int) []int {
    var indices []int
    for i, value := range slice {
        if value == target {
            indices = append(indices, i)
        }
    }
    return indices
}

func main() {
    numbers := []int{1, 3, 7, 3, 9, 3, 5}
    indices := findAllIndices(numbers, 3)
    fmt.Printf("Number 3 found at indices: %v\n", indices)  // [1 3 5]
}
```

## Performance Considerations

1. When you know the approximate final size of a slice, use `make` with capacity:
```go
// Efficient: allocates once
result := make([]int, 0, expectedSize)
// ... append elements

// Less efficient: may reallocate multiple times
result := []int{}
// ... append elements
```

2. When iterating over a map in a deterministic way, sort keys first:
```go
import "sort"

keys := make([]string, 0, len(myMap))
for k := range myMap {
    keys = append(keys, k)
}
sort.Strings(keys)

for _, k := range keys {
    fmt.Println(k, myMap[k])
}
```

## Exercises

1. Write a function that takes two slices and returns their intersection (common elements).
2. Implement a function that mimics Python's `enumerate` by returning pairs of index and value.
3. Create a simple phone book using maps where keys are names and values are phone numbers.
4. Write a function that removes all occurrences of a specific value from a slice.
5. Create a histogram function that counts occurrences of elements in a slice and returns them in a map.

---
Next: [Module 6: Structs and Interfaces](06-structs-interfaces.md)