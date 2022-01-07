l = [0, 1, 2, 3]
a = l[-1:]
r = a[0] == 3
b = len(l[:])
r = r and b == 4
print(r)
