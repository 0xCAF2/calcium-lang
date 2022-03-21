def outer(x, y):
    def inner(z):
        return (x + y) * z

    return inner


f = outer(2, 5)
print(f(3) == 21)
