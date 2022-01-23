def f(x, y):
    n = 0
    while n < 10:
        if n > x:
            return x * 7
        elif n > y:
            return y * 10
        n += 1


r = f(7, 5)
print(r == 50)
