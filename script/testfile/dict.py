d = {}
d["k"] = 7
key = "test"
d[key] = d["k"] + 3
keys = d.keys()
s = len(keys)
r = s == 2 and d["test"] == 10
print(r)
