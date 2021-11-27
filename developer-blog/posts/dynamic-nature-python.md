---
title: The dynamic nature of Python's MRO
---

Imagine the following class relationships:

```python
class Base:
    def chain(self):
        return 'Base'


class A(Base):
    pass...


class B(Base):
    def chain(self):
        return f"{super().chain()} <- B"


class C(A, B):
    pass


class D(C):
    def chain(self):
        return f"{super().chain()} <- D"

```

Calling `chain` in an instance of `D` will result in the following string:

```python
In [1]: d.chain()
Out[1]: 'Base <- B <- D'
```

What would happen if the following code runs?

```python
In [2]: A.chain = A.chain
```

Inoffensive, right? Now try calling `d.chain()` again...

```python
In [3]: d.chain()
Out[3]: 'Base <- D'
```

Let's observe `D`'s **M**ethod **R**esolution **O**rder (_MRO_, the order of classes where Python will look for when resolving methods and attributes):

```python
In [4]: D.mro()
Out[4]: [__main__.D, __main__.C, __main__.A, __main__.B, __main__.Base, object]
```

When calling `D.chain()`, Python will look in this list and return the first instance where `chain` is present as a _member_ of the class. In our example, `D` implements `chain`.

`D.chain` in turn will call `super().chain()`. What will Python do? it will grab the next class from `D` and try to find `chain` in this new list. `C` doesn't implement it; neither does `A`. `B` does! The result will be whatever `B.chain` returns, plus the bit `" <- D"`.

`B.chain` does the super() call again... we know what we're doing. Base implements it and there are no more `super()` calls. So we have `Base.chain` returning `"Base"`, `B.chain()` returning `"Base <- B"`, and `D.chain()` finally returning `"Base <- B <- D"`.

So what’s going on after we do `A.chain = A.chain`? Why is `B.chain()` ignored? Let’s dissect what’s going on with it. What’s `A`'s MRO?

```python
In [5]: A.mro()
Out[5]: [__main__.A, __main__.Base, object]
```

Pretty simple. What happens when you do `A.chain`? Python will look at `A`, which does not implement it. But `Base` implements it, so that's the implementation it's gonna use. But what's going on when we do the assignment?

Python evaluates this assignment right to left: `A.chain = A.chain` then means "find `chain` for A", which returns `Base.chain`. Then, _python will effectively create a new member in the class A named `chain`_!

Let's go back to D's MRO:

```python
[__main__.D, __main__.C, __main__.A, __main__.B, __main__.Base, object]
```

The way these classes were constructed, `A`'s members will be tested before `B`! What does it mean for the resolution order? When `D.chain()` calls `super().chain()`, it will now grab the newly added member of `A` and call it. And from `A`'s point of view, the implementation is the same as `Base.chain`, which doesn't have any `super()` call! :exploding_head:

This happens due to the dynamic nature of Python. [The entry for `super()` in Python's documentation](https://docs.python.org/3/library/functions.html#super) has an amazing description of this issue, and how it's a unique use case due to Python's nature.

Python's multiple inheritance feature, plus its dynamic nature, make it so the actual method resolution order and class hierarchy are only known at runtime and can change at any time during the application lifetime.

Classes designs MUST be _collaborative_. The example above has many issues, [but there is a simple set of rules that help designing collaborative classes](https://rhettinger.wordpress.com/2011/05/26/super-considered-super/):

- methods called by super() need to exist
- methods called and their implementations need to have a matching argument signature
- every occurrence of the method needs to use super()

The point here is that the actual implementation of the method called by `super()` is only known at runtime and cannot be easily defined statically.

Design your classes collaboratively, and watch for mutations in classes in your runtime.

Want to know more about Python's MRO? This amazing article in the Python docs introduces how the algorithm works after version 2.3. [Check it out](https://www.python.org/download/releases/2.3/mro/)!
