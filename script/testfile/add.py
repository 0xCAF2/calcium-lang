a = 7
b = a + 3
c = a + b
r = False
if b == 7 + 3:
    r = r or c == 17

s = "test"
ss = s[0] + s[2]
r = r and ss == "ts"

l1 = [a, b, c, s[:-1]]
l2 = [ss]
l3 = l1 + l2
x = len(l3)
r = r and x == 5

print(r)
