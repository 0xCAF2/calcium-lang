s = 'test'
n = 0
r = True
for c in s:
    if n == 0 or n == 3:
        r = r and (c == 't')
    elif n == 1:
        r = r and (c == 'e')
    else:
        r = r and (c == 's')
    n += 1
print(r)
