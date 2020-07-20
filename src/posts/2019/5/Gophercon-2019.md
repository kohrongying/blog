---
title: Gophercon 2019
date: 2019-05-08 23:45:34
tags:
- golang
- gophercon
---

Gophercon lasted for a week on 28 Apr 2019 to 3 May 2019.
<!-- excerpt -->

I was quite lucky that my company sent us to go for the Ultimate Go workshop in order to up our golang skills. 

Don't think I'll be able to list down everything we've learnt! (Felt weird being a student again - I was taking down notes and suffering from food coma after lunch. (It didn't help that we had like food 4 times a day (ooh nested statements haha)))

But just gonna mention things that I found significant.

# Basic Syntax
1. Pointers
- Finally understood how the pointer refers to the memory address of the variable
```go
var count int
var address *int  // A pointer variable
address = &count  // The memory address of count
*address          // derefernce pointer
```

2. Slices
- Basically mutable while arrays are not
- Golang does alot of background work to make sure that slices are in one contiguous block of memory to allow iteration to be blazing fast! 
- Thus led to concept of capacity and length
- Linked to the concept about memory and how go tries to compile code in the way that tries to improve mechanical sympathy 

3. Maps
- Fast in lookup but not iteration (no contiguous block of memory)

### Concurrency
I feel that I learnt more about go through concurrency. And how easy and straightforward it made concurrency haha. 

1. Go routines

So usually, go runs code in one main thread. But we can specify more threads, through the use of `go routines`.

They look something like:
```go
go func(){
 // do something 
}()
```

2. Wait Group

Part of the `sync` package, wait groups allow us to specify the number of jobs/threads there are through provisioning a counter then decrementing the counter when jobs/threads are complete. This allows us to await till all jobs are done. Something like a async/await block in javascript!
```go
var wg sync.WaitGroup

wg.Add(1) // Add tasks

go func(){
  wg.Done() // Decrement when task is done
}()

wg.Wait() // awaits
fmt.Println("DONE!")
```

3. Data Integrity & Data races

To prevent data races and inaccuracy of data, we were introduced the use of `atomic` and `mutex`. For updating numbers like count or values, we can use `atomic` which means, only one `atomic` operator can occur at any one time, all threads will be blocked when that happens.

`mutex` works in a simliar function, whereby all threads block when one thread uses `mutex.Lock()`.

It is important to make sure `mutex.Unlock()` is called, else deadlock might occur.

3. Channels

Didn't really get it the first time jiayu explained but I get this one! It is literally imagined to be a tunnel, in my head haha. Like someone sending chat messages or something 

Switch was pretty cool too.

4. Pitfalls of concurrency

We went through some pitfalls like data races, deadlocks etc, but what's interesting was that over-complicating the problem using go routines and channels was also a pitfall. 

We might get excited and jump into using channels as our solution for a problem, but it may not necessarily but the best. Running synchronously should still be an option! :) 

Ok thats all :) Can't wait for Gophercon 2020 haha.

