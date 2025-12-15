# Go Learning Path - Module 8: Concurrency with Goroutines and Channels

Concurrency is one of Go's greatest strengths. Go provides lightweight threads called goroutines and channels for communication between goroutines, making concurrent programming both powerful and easy.

## Goroutines

A goroutine is a lightweight thread managed by the Go runtime. To create a goroutine, simply prefix a function call with `go`:

```go
package main

import (
    "fmt"
    "time"
)

// Function to run in a goroutine
func printNumbers() {
    for i := 1; i <= 5; i++ {
        fmt.Printf("Number: %d\n", i)
        time.Sleep(200 * time.Millisecond)  // Simulate work
    }
}

// Another function for a second goroutine
func printLetters() {
    for i := 'A'; i <= 'E'; i++ {
        fmt.Printf("Letter: %c\n", i)
        time.Sleep(300 * time.Millisecond)  // Simulate work
    }
}

func main() {
    fmt.Println("Starting goroutines...")
    
    // Start goroutines
    go printNumbers()
    go printLetters()
    
    // Give goroutines time to run
    time.Sleep(2 * time.Second)
    
    fmt.Println("Main function ending...")
}
```

### Anonymous Functions as Goroutines

```go
func main() {
    messages := []string{
        "Hello from goroutine 1",
        "Hello from goroutine 2", 
        "Hello from goroutine 3",
    }
    
    for i, msg := range messages {
        // Each goroutine captures different values
        go func(index int, message string) {
            fmt.Printf("Goroutine %d: %s\n", index, message)
        }(i, msg)  // Pass values as arguments to avoid closure issues
    }
    
    // Wait for all goroutines to finish
    time.Sleep(1 * time.Second)
}
```

## WaitGroup for Goroutine Synchronization

Use `sync.WaitGroup` to wait for all goroutines to complete:

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done()  // Signal completion when function returns
    
    fmt.Printf("Worker %d starting\n", id)
    
    // Simulate work
    time.Sleep(time.Duration(id) * time.Second)
    
    fmt.Printf("Worker %d done\n", id)
}

func main() {
    var wg sync.WaitGroup
    
    // Start multiple workers
    for i := 1; i <= 3; i++ {
        wg.Add(1)  // Increment counter
        go worker(i, &wg)
    }
    
    fmt.Println("All workers started, waiting for completion...")
    
    // Wait for all goroutines to finish
    wg.Wait()
    
    fmt.Println("All workers completed!")
}
```

## Channels

Channels are typed conduits through which you can send and receive values with the channel operator `<-`:

```go
package main

import "fmt"

func main() {
    // Create a channel for integers
    ch := make(chan int)
    
    // Send value to channel (in goroutine to avoid blocking)
    go func() {
        ch <- 42  // Send 42 to the channel
    }()
    
    // Receive value from channel
    value := <-ch  // Blocks until value is available
    fmt.Printf("Received: %d\n", value)
    
    // Channel with capacity (buffered channel)
    bufferedCh := make(chan string, 2)
    bufferedCh <- "Hello"
    bufferedCh <- "World"
    
    // Can read without blocking since there's capacity
    fmt.Println(<-bufferedCh)  // "Hello"
    fmt.Println(<-bufferedCh)  // "World"
}
```

### Directional Channels

You can specify if a channel is for sending, receiving, or both:

```go
package main

import "fmt"

// Function that only sends to a channel
func sendOnly(ch chan<- string, msg string) {
    ch <- msg
}

// Function that only receives from a channel
func receiveOnly(ch <-chan string) string {
    return <-ch
}

func main() {
    ch := make(chan string)
    
    go sendOnly(ch, "Hello from goroutine")
    msg := receiveOnly(ch)
    
    fmt.Println(msg)  // "Hello from goroutine"
}
```

## Channel Operations

### Closing and Range Over Channels

```go
package main

import (
    "fmt"
    "time"
)

func sendSequential(ch chan int) {
    for i := 1; i <= 5; i++ {
        ch <- i
        time.Sleep(100 * time.Millisecond)  // Simulate delay
    }
    close(ch)  // Close channel when done sending
}

func main() {
    ch := make(chan int)
    
    go sendSequential(ch)
    
    // Read all values until channel is closed
    for value := range ch {
        fmt.Printf("Received: %d\n", value)
    }
    
    fmt.Println("Channel closed, all values received")
}
```

### Non-blocking Channel Operations

```go
package main

import "fmt"

func main() {
    messages := make(chan string)
    signals := make(chan bool)
    
    // Non-blocking receive
    select {
    case msg := <-messages:
        fmt.Println("Received message:", msg)
    default:
        fmt.Println("No message received")
    }
    
    // Non-blocking send
    msg := "hi"
    select {
    case messages <- msg:
        fmt.Println("Sent message:", msg)
    default:
        fmt.Println("No message sent")
    }
    
    // Multi-way select with default
    select {
    case msg := <-messages:
        fmt.Println("Received message:", msg)
    case sig := <-signals:
        fmt.Println("Received signal:", sig)
    default:
        fmt.Println("No activity")
    }
}
```

## Advanced Channel Patterns

### Fan-in Pattern

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

// Producer function that sends values to a channel
func producer(name string, ch chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    defer close(ch)
    
    for i := 1; i <= 3; i++ {
        value := i * 10
        fmt.Printf("%s producing: %d\n", name, value)
        ch <- value
        time.Sleep(200 * time.Millisecond)
    }
}

// Fan-in function that merges multiple channels into one
func fanIn(channels ...<-chan int) <-chan int {
    out := make(chan int)
    
    var wg sync.WaitGroup
    wg.Add(len(channels))
    
    // Start a goroutine for each channel
    for _, ch := range channels {
        go func(c <-chan int) {
            defer wg.Done()
            for val := range c {
                out <- val
            }
        }(ch)
    }
    
    // Close output channel when all inputs are done
    go func() {
        wg.Wait()
        close(out)
    }()
    
    return out
}

func main() {
    ch1 := make(chan int)
    ch2 := make(chan int)
    
    var wg sync.WaitGroup
    wg.Add(2)
    
    go producer("Producer A", ch1, &wg)
    go producer("Producer B", ch2, &wg)
    
    // Wait for producers to start
    time.Sleep(50 * time.Millisecond)
    
    // Merge the channels
    merged := fanIn(ch1, ch2)
    
    // Print all values
    for value := range merged {
        fmt.Printf("Merged value: %d\n", value)
    }
    
    wg.Wait()
    fmt.Println("All done!")
}
```

### Timeout Pattern

```go
package main

import (
    "fmt"
    "time"
)

func doWork(name string, ch chan<- string, duration time.Duration) {
    time.Sleep(duration)
    ch <- fmt.Sprintf("%s completed", name)
}

func main() {
    result := make(chan string)
    
    // Start work in goroutine
    go doWork("Important Task", result, 2*time.Second)
    
    // Wait with timeout
    select {
    case res := <-result:
        fmt.Println(res)
    case <-time.After(1 * time.Second):  // Timeout after 1 second
        fmt.Println("Timeout! Work took too long.")
    }
    
    // Now try again with longer timeout
    result2 := make(chan string)
    go doWork("Another Task", result2, 800*time.Millisecond)
    
    select {
    case res := <-result2:
        fmt.Println(res)
    case <-time.After(1 * time.Second):
        fmt.Println("Timeout! Work took too long.")
    }
}
```

## Practical Examples of Concurrency

### Web Request with Multiple APIs

```go
package main

import (
    "fmt"
    "time"
)

// Simulate API calls that take different amounts of time
func fetchFromAPI(service string, ch chan<- string) {
    // Simulate network delay
    delay := map[string]time.Duration{
        "users":    300 * time.Millisecond,
        "products": 500 * time.Millisecond,
        "orders":   700 * time.Millisecond,
    }[service]
    
    time.Sleep(delay)
    ch <- fmt.Sprintf("Data from %s service", service)
}

func main() {
    start := time.Now()
    
    // Create channels for each API
    usersCh := make(chan string)
    productsCh := make(chan string)
    ordersCh := make(chan string)
    
    // Start all API calls concurrently
    go fetchFromAPI("users", usersCh)
    go fetchFromAPI("products", productsCh)
    go fetchFromAPI("orders", ordersCh)
    
    // Collect results (this will happen in the order they complete)
    for i := 0; i < 3; i++ {
        select {
        case users := <-usersCh:
            fmt.Println(users)
        case products := <-productsCh:
            fmt.Println(products)
        case orders := <-ordersCh:
            fmt.Println(orders)
        }
    }
    
    fmt.Printf("Total time: %v\n", time.Since(start))
}
```

### Worker Pool Pattern

```go
package main

import (
    "fmt"
    "sync"
    "time"
)

type Job struct {
    ID      int
    Payload string
}

type Result struct {
    JobID   int
    Output  string
    Worker  int
}

func worker(id int, jobs <-chan Job, results chan<- Result, wg *sync.WaitGroup) {
    defer wg.Done()
    
    for job := range jobs {
        // Simulate processing time
        time.Sleep(200 * time.Millisecond)
        
        result := Result{
            JobID:  job.ID,
            Output: fmt.Sprintf("Processed: %s by worker %d", job.Payload, id),
            Worker: id,
        }
        
        results <- result
    }
}

func main() {
    numJobs := 10
    numWorkers := 3
    
    jobs := make(chan Job, numJobs)
    results := make(chan Result, numJobs)
    
    var wg sync.WaitGroup
    
    // Start workers
    for i := 1; i <= numWorkers; i++ {
        wg.Add(1)
        go worker(i, jobs, results, &wg)
    }
    
    // Send jobs
    go func() {
        for i := 1; i <= numJobs; i++ {
            job := Job{
                ID:      i,
                Payload: fmt.Sprintf("task-%d", i),
            }
            jobs <- job
        }
        close(jobs)  // Close when done sending
    }()
    
    // Close results channel when all workers are done
    go func() {
        wg.Wait()
        close(results)
    }()
    
    // Collect results
    for result := range results {
        fmt.Printf("Job %d processed by worker %d: %s\n", 
                   result.JobID, result.Worker, result.Output)
    }
}
```

## Common Concurrency Patterns

### Generator Pattern

```go
package main

import "fmt"

// Generator function that returns a channel
func intGenerator(start, end int) <-chan int {
    ch := make(chan int)
    
    go func() {
        defer close(ch)
        for i := start; i <= end; i++ {
            ch <- i
        }
    }()
    
    return ch
}

func main() {
    numbers := intGenerator(1, 5)
    
    for num := range numbers {
        fmt.Printf("Generated: %d\n", num)
    }
}
```

### Pipeline Pattern

```go
package main

import "fmt"

// Takes integers and doubles them
func double(in <-chan int) <-chan int {
    out := make(chan int)
    
    go func() {
        defer close(out)
        for val := range in {
            out <- val * 2
        }
    }()
    
    return out
}

// Takes integers and squares them
func square(in <-chan int) <-chan int {
    out := make(chan int)
    
    go func() {
        defer close(out)
        for val := range in {
            out <- val * val
        }
    }()
    
    return out
}

func main() {
    // Create initial values
    nums := make(chan int)
    go func() {
        defer close(nums)
        for i := 1; i <= 5; i++ {
            nums <- i
        }
    }()
    
    // Create pipeline: nums -> double -> square
    doubled := double(nums)
    squared := square(doubled)
    
    // Collect results
    for result := range squared {
        fmt.Printf("Result: %d\n", result)
        // This gives us: (1*2)^2=4, (2*2)^2=16, (3*2)^2=36, etc.
    }
}
```

## Best Practices for Concurrency

1. **Use goroutines for independent tasks** that can run concurrently
2. **Use channels for communication** between goroutines instead of shared memory
3. **Always handle channel closing** to prevent goroutine leaks
4. **Use WaitGroup** when you need to wait for multiple goroutines to finish
5. **Be careful with shared state** - use mutexes when necessary
6. **Avoid race conditions** by properly synchronizing access to shared data

## Exercises

1. Write a program that calculates Fibonacci numbers concurrently using goroutines and channels.
2. Create a web scraper that fetches multiple URLs concurrently and collects the results.
3. Implement a producer-consumer pattern with multiple producers and consumers.
4. Write a program that implements a simple concurrent counter with multiple goroutines incrementing it.
5. Create a pipeline that processes text data: split into words → count word lengths → sum total characters.

---
Next: [Module 9: Error Handling and Defer/Panic/Recover](09-error-handling-defer-panic-recover.md)