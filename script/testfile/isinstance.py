class C:
    pass


c = C()
r = isinstance(c, C)

s = "test"
rs = isinstance(s, str)

rf = isinstance(s, C)

n = 7
ri = isinstance(n, int)

print(r and rs and not rf and ri)
