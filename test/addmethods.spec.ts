type Printable = { name: string; print: () => void };

describe("test methods", () => {
  it("add methods to an object", () => {
    const obj: { name: string; type: string } = {
      name: "Variable",
      type: "Var",
    };

    function addMethods(target: object): Printable {
      const printable = target as Printable;
      printable.print = function () {
        console.log(this.name);
      };
      return printable;
    }

    const pr = addMethods(obj);
    pr.print();
  });
});
