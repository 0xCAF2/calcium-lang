class B:
    pass


class C(B):
    pass


class A:
    pass


c = C()
r = isinstance(c, C)
rb = isinstance(c, B)
ra = isinstance(c, A)

s = "test"
rs = isinstance(s, str)

rf = isinstance(s, C)

n = 7
ri = isinstance(n, int)

print(r and rb and not ra and rs and not rf and ri)
