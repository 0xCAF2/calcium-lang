class A:
    def __init__(self, n):
        self.m = n * 2
        pass


class B(A):
    def __init__(self, n):
        s = super(B, self)
        s.__init__(n)
        self.n = n


class C(B):
    def __init__(self, n):
        s = super(C, self)
        s.__init__(n)


c = C(7)
print(c.n == 7 and c.m == 14)
