r = True
l = [0, 2]
l.append(4)
size = len(l)
r = r and (size == 3) and (l[1] == 2)

for e in l:
    if e % 2 != 0:
        r = False

print(r)
