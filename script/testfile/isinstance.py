class C:
    pass


c = C()
r = isinstance(c, C)

s = "test"
rs = isinstance(s, str)

print(r and rs)
