l = [0, 1, 2, 3]
a = l[:-1]
r = a[1] == 1
b = len(l[:])
r = r and b == 4
a[:2] = [5]
c = len(a)
d = len(l)
r = r and c == 2 and d == 4
print(r)
