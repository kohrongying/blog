---
title: Revisiting Go
date: 2020-06-26 14:51:28
tags:
- golang
---

I started learning Go a year ago, amazed at how it checks for errors at compile time (haha my first time). I went for a Golang course (sponsored by company hehe) but didn't practise much until now.<!-- excerpt --> I used a programming problem to practise Golang.

I blogged about Gophercon 2019 [here](/2019/05/08/2019-5-Gophercon-2019/)


## Golang - OOP...?
According to the [official site](https://golang.org/doc/faq#Is_Go_an_object-oriented_language), Yes and No. The closest equivalent to a class in OOP is a `struct` in Golang and it in itself has many differences.

```go
type Robot struct {
	X int
	Y int
	Direction Direction
}

func (r Robot) GetPosition() string {
	return fmt.Sprintf("%d, %d", r.X, r.Y)
}
```

A type can satisfy many interfaces as well, unlike certain OOP languages which restrict that.

### Learning about Package Visibility
I came across the term unexported types when I was googling for OOP in Golang. The first time I saw the word unexported, I thought it was a careless typo. 

And so, it turns out the Capitalized letter we see in structs/method calls _is_ intentional. It represents exported which means a method in another package can call it. If it is unexported, you can't use it.

As there is no idea of constructors in Golang, I came across [this article](https://golangbot.com/structs-instead-of-classes/) that suggests we unexport _classes_ (I'm using this term loosely) to prevent access from other package and export instead a `New` method which will return the unexported type.

```go
type employee struct {  
    firstName   string
    lastName    string
}

func New(firstName string, lastName string) employee {  
    e := employee {firstName, lastName}
    return e
}
```

However, I later faced problems with this pattern. I was in package main, trying to use the unexported type from package robot in another struct, but faced the error `Unable to use unexported type`. I couldn't find a solution so I chose to revert to exporting the type :p 

I guess the important lesson here is knowing how unexporting work and how you can use it as one of the means of encapsulation (or not.

## Using *robot and robot
Okay I keep forgetting this!! 

For every type `T`, there exists another type `*T` where the star represents the address of value of type. In Go, _everything_ is pass by value. 

Here's an example to illustrate

```go
func main() {
	apples := 10
	fmt.Println(apples) //10
	decrement(apples)
	fmt.Println(apples) //10

	myAge := Age{40}
	fmt.Printf("age is %d\n", myAge)
	myAge.increment()
	fmt.Printf("age is %d\n", myAge)
}

func decrement(num int) {
	num--
}

type Age struct {
	age int
}

func (age Age) increment() {
	age.age++
}
```

This will return an error. This is because the variable `age` that is called on, lives at a different address than the variable `myAge`. When the variable is passed as a parameter, a new copy is created and hence lives at a different memory address. What is effectively inc/decremented is a duplicate. In order to increment correctly, we have to specify the address of the variable we already defined.

```go
decrement(&apples) // pass in pointer
myAge.increment() // don't have to dereference

func decrement(num *int) {
	num--
}

func (age *Age) increment() {
	age.age++
}
```
This will work! One note is that using the `&` will dereference the variable - giving us the pointer address. For Structs, we don't have to explicitly dereference it as it is [cumbersome](https://tour.golang.org/moretypes/4)

I found this answer which sums it up nicely:
```go
func (s *MyStruct) pointerMethod() { } // method on pointer
func (s MyStruct)  valueMethod()   { } // method on value
```

Thus we can use Get methods (eg. get robot position) as value methods and have to use Set methods (eg. change robot x, y coor / direction) as pointer methods.

## Using const and iota
I was toying with enums and even a global `map[string][int]` (but unable to initialize it outside of a main function) to implement direction. Incidentally, I came across the use of const.

`const` declares a constant value and can be used like how a var works. 

`iota` on the other hand, represents consecutive integers that resets to 0 when `const` appears and increments after each declaration.

```go
type Direction int
const (
	N Direction = iota
	E Direction = iota
	S Direction = iota
	W Direction = iota
)
```

I thought it was suitable for Direction to be an integer as I can then denote a clockwise and anticlockwise turn with a +1 and -1 respectively, while also checking the bounds that it remain between the values 0 to 3.

## Slice and array
I encountered this error at the last stages as I was parsing the list of commands.
```go
instructions := [3]string{"M", "L", "M"}
room.RobotInstructions(instructions)
// ERR: cannot use (type [3]string) as type []string
```

I asked for help and help answered to just remove the length 3. I was shocked! So I guess it was time to be properly schooled.

Arrays in Go are values as they are fixed-length sequences (assigning one array to another means copying all elements and that passing an array will result in a copy of it, not a pointer). Slices are reference types (cheap to assign, to pass, to resize).

Hence, slices are more powerful, more flexible and more efficient.



## Composite Literal error
There was a composite literal error warning. Not sure why but I just had to change `robot.Robot{3, 5, N}` to `robot.Robot{X: 3, Y: 5, Direction: N}`

## Error and Exception handling
We can throw an error like this
```go
errors.New("Invalid Command")
```

And test it like this:
```go
err := room.MoveRobot("A")
if err == nil {
    t.Errorf("Expected error but received no error")
}
var ErrInvalidCommand = errors.New("Invalid command")
if errors.Is(err, ErrInvalidCommand) {
    t.Errorf("Unexpected error %v, but received %v", "Invalid command", err)
}
```

## Concluding Thoughts
I think the mars rover problem or any other problem is a good way to practise a new programming language. I get to practise my TDD and also explore different ways of implementing the solution. Different solutions also show different advantages / efficiency of different languages. :) 