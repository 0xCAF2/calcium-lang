s = "test"
p = s.find("e")
l = s.split("s")
r = isinstance(l, list)
r = r and p == 1 and l[0] == "te" and l[1] == "t"

s2 = s.replace("t", "l")
r = r and s2 == "lesl"
print(r)
