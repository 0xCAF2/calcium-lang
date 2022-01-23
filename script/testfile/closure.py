def f1(x):
    y = x + 3

    def f2(z):
        return y * z
    return f2


f = f1(7)
a = f(10)
print(a == 100)
