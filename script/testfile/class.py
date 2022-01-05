class MyClass:
    def __init__(self, name):
        self.name = name

    def greet(self):
        return 'Hello, ' + self.name + '.'


c = MyClass('John')
msg = c.greet()
print(msg == 'Hello, John.')
