s = "test"
p = s.find("e")
l = s.split("s")
r = isinstance(l, list)
r = r and p == 1 and l[0] == "te" and l[1] == "t"
print(r)
