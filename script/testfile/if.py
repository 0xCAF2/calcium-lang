a = True
b = False
c = None
if a or b:
    if a and b:
        c = 'NG 1'
    elif b and b:
        c = 'NG 2'
    elif a and a and b:
        c = 'NG 3'
else:
    c = 'NG 4'
print(c == None)
