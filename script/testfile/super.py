class B:
    def __init__(self, n):
        self.n = n

class C(B):
    def __init__(self, n):
        s = super()
        s.__init__(n)

c = C(7)
print(c.n == 7)
