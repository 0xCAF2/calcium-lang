def is_remainder_zero(x, y):
    r = (x % y) == 0
    return r


prime = []
for i in range(101):
    j = 2
    while True:
        if j >= i:
            break
        is_zero = is_remainder_zero(i, j)
        if is_zero:
            break
        else:
            j += 1
    if j == i:
        prime.append(i)
result = prime
print(
    str(result)
    == "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]"
)
