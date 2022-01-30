s = "test"
l = []
for c in s:
    l.append(c)
r = len(l) == 4

a = [0, 2, 4]
for i, e in enumerate(a):
    r = r and e == i * 2

print(r)
