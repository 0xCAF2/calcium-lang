r = True
l = [0, 2]
l.append(4)
size = len(l)
l[0] = "0"
r = r and (size == 3) and (l[1] == 2) and str(l) == "['0', 2, 4]"
print(r)

# for e in l:
#     if e % 2 != 0:
#         r = False

# e = l.pop(0)
# e2 = l.pop()
# l.insert(0, e2)
# size = len(l)
# r = r and e == 0 and e2 == 4 and size == 2

# print(r)
