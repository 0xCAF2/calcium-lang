"use strict";
const Calcium = {};
/// Enum for the value returned by Engine.step() and Engine.run()
Calcium.Result = {
  TERMINATED: 0,
  EXECUTED: 1,
  BREAKPOINT: 2,
  EXCEPTION: 3,
};

/// public interpreter of Calcium language
class Engine {
  constructor(jsonArray, parser) {
    let code;
    if (typeof jsonArray === "string" || jsonArray instanceof String) {
      // parse from string representation
      code = JSON.parse(jsonArray);
    } else if (jsonArray instanceof Array) {
      // jsonArray is already Calcium code
      code = jsonArray;
    } else {
      code = [];
    }
    this.environment = new Environment(code);
    this._breakpoints = [];
    if (parser) {
      this.parser = parser;
    } else {
      this.parser = new Parser();
    }
  }
  /// set the index as a breakpoint
  addBreakpoint(index) {
    if (this._breakpoints.indexOf(index) === -1) {
      this._breakpoints.push(index);
      this._breakpoints = this._breakpoints.sort();
    }
  }
  /// alias built-in functions or classes for localizations
  aliasBuiltin(reservedName, alternativeName) {
    const builtinObj = this.environment.builtin.lookUp(reservedName);
    this.environment.builtin.register(alternativeName, builtinObj);
  }
  /// alias built-in methods
  aliasMethod(reservedName, alternativeName) {
    // add to the key of the object
    // Value is not used.
    methodNames[reservedName][alternativeName] = null;
  }
  /// append the code in the array of an array before 'end'
  appendCode(codeArray) {
    // retrieve EndOfCode command
    const code = this.environment.code;
    const lastLineIndex = code.length - 1;
    const endOfCode = code.pop();
    // append codeArray and EndOfCode
    const newCode = code.concat(codeArray);
    newCode.push(endOfCode);
    this.environment.code = newCode; // update
    return lastLineIndex; // the line number to execute next
  }
  /// evaluate expr when stopped at a breakpoint
  debugPrint(expr, callback) {
    const exprObj = this.parser.parseExpression(expr);
    const result = describe(exprObj.debugEvaluate(this.environment));
    callback(result);
  }
  /// create a built-in function from the outside of Calcium
  /// also used to define methods of a built-in class below
  defineBuiltinFunction(name, body, isGlobal = true) {
    // body: (args, env) => { ... };
    const builtinFuncObj = new BuiltinFuncObj(name, body);
    // specify false if the function is a method
    if (isGlobal) {
      this.environment.builtin.register(name, builtinFuncObj);
    }
    return builtinFuncObj;
  }
  importModules(moduleBuilder) {
    for (let moduleObj of moduleBuilder.buildAll()) {
      this.environment.builtin.register(moduleObj.name, moduleObj);
    }
  }
  removeBreakpoint(index) {
    const position = this._breakpoints.indexOf(index);
    if (position !== -1) {
      this._breakpoints.splice(position, 1);
    }
  }
  /// execute code to the end or the breakpoint
  run() {
    for (;;) {
      const result = this.step();
      if (result === Calcium.Result.EXECUTED) {
        continue; // execute the next line
      } else if (result === Calcium.Result.EXCEPTION) {
        if (this.environment.address.indent === 0) {
          // exception not handled
          return result;
        } else {
          // searching except block
          continue;
        }
      } else {
        return result; // contains an exception
      }
    }
  }
  /// give the result of built-in print to an external function
  setPrintFunction(func) {
    this.environment.print = func;
  }
  /// execute lines regarded as one step
  step() {
    if (this.isEnded) {
      return Calcium.Result.TERMINATED;
    }

    // get current line as a command
    const command = this.parser.parse(this.arrayOfCurrentLine);
    command.execute(this.environment); // execute one line

    // program is finished
    if (command instanceof EndOfCode) return Calcium.Result.TERMINATED;
    // exception is raised and unhandled
    if (this.environment.hasException) return Calcium.Result.EXCEPTION;

    this.environment.skipToNextLine(); // search next line

    // check whether next line can be skipped
    let nextLine = this.arrayOfCurrentLine;
    let keyword = nextLine[Calcium.Index.KEYWORD];
    while (
      keyword === Calcium.Keyword.COMMENT ||
      keyword === Calcium.Keyword.IFS
    ) {
      const command = this.parser.parse(nextLine);
      command.execute(this.environment);
      this.environment.skipToNextLine();
      nextLine = this.arrayOfCurrentLine;
      keyword = nextLine[Calcium.Index.KEYWORD];
    }

    if (this.isAtBreakpoint) return Calcium.Result.BREAKPOINT;
    else return Calcium.Result.EXECUTED;
  }
  /// return the current line as an array
  get arrayOfCurrentLine() {
    return this.environment.code[this.currentIndex];
  }
  /// return a copy of _breakpoints
  get breakpoints() {
    return this._breakpoints.map((b) => b);
  }
  /// current line's index in the code
  get currentIndex() {
    return this.environment.address.index;
  }
  /// return whether current line has a breakpoint
  get isAtBreakpoint() {
    const i = this.currentIndex;
    return this._breakpoints.some((b) => b === i);
  }
  get isEnded() {
    return this.currentIndex === this.environment.code.length - 1;
  }
}
Calcium.Engine = Engine; // publish

/// Calcium code is represented by arrays.
/// e.g.
/// ["var", "x"] for an expression,
/// [1, [], "=", ["var", "x"], "Hello, World."] for a statement (command)
/// Each value means the index in an array.
Calcium.Index = {
  INDENT: 0,
  OPTIONS: 1,
  KEYWORD: 2,

  // statements
  ASSIGNMENT_LHS: 3,
  ASSIGNMENT_RHS: 4,

  CALL_LHS: 3,
  CALL_REFERENCE: 4,
  CALL_ARGS: 5,

  CLASS_DEF_CLASS_NAME: 3,
  CLASS_DEF_SUPERCLASS_NAME: 4,

  COMMENT_TEXT: 3,

  CONDITION: 3,

  EXCEPT_TYPE_NAME: 3,
  EXCEPT_OBJ_NAME: 4,

  FOR_EACH_ELEMENT_NAME: 3,
  FOR_EACH_ITERABLE: 4,

  FOR_RANGE_VARIABLE_NAME: 3,
  FOR_RANGE_VALUES: 4,

  FUNC_DEF_FUNC_NAME: 3,
  FUNC_DEF_PARAMETERS: 4,

  IMPORT_MODULE_NAME: 3,

  RAISE_EXCEPTION: 3,
  RAISE_ARGS: 4,

  RETURN_VALUE: 3,

  // expressions
  EXPRESSION_KEYWORD: 0,

  ATTRIBUTE_OBJECT_NAME: 1,
  ATTRIBUTE_PROPERTY_NAMES: 2,

  LEFT_OPERAND: 1,
  RIGHT_OPERAND: 2,

  SUBSCRIPT_REFERENCED_OBJECT: 1,
  SUBSCRIPT_INDEX_EXPR: 2,

  UNARY_OPERAND: 1,

  VARIABLE_NAME: 1,
};

const keyword = {};
keyword.BinaryOperator = {
  ADDITION: "+",
  SUBTRACTION: "-",
  MULTIPLICATION: "*",
  EXPONENTIATION: "**",
  DIVISION: "/",
  FLOOR_DIVISION: "//",
  REMAINDER: "%",
  EQUAL: "==",
  NOT_EQUAL: "!=",
  LESS_THAN: "<",
  LESS_THAN_OR_EQUAL: "<=",
  GREATER_THAN: ">",
  GREATER_THAN_OR_EQUAL: ">=",
  AND: "and",
  OR: "or",
  IS: "is",
  IS_NOT: "is not",
  IN: "in",
  NOT_IN: "not in",
  BITWISE_AND: "&",
  BITWISE_OR: "|",
  BITWISE_XOR: "^",
  LEFT_SHIFT: "<<",
  RIGHT_SHIFT: ">>",
};

keyword.UnaryOperator = {
  NOT: "not",
  NEGATIVE: "-_",
  BITWISE_NOT: "~",
};

keyword.Expression = {
  ATTRIBUTE: "attr",
  SUBSCRIPT: "sub",
  VARIABLE: "var",
};

keyword.Statement = {
  ASSIGNMENT: "=",
  BREAK: "break",
  CALL: "call",
  CLASS_DEF: "class",
  COMMENT: "#",
  COMPOUND_ADDITION: "+=",
  COMPOUND_SUBTRACTION: "-=",
  COMPOUND_MULTIPLICATION: "*=",
  CONTINUE: "continue",
  ELIF: "elif",
  ELSE: "else",
  END_OF_CODE: "end",
  EXCEPT: "except",
  FOR_EACH: "for each",
  FOR_RANGE: "for range",
  FUNC_DEF: "def",
  IF: "if",
  IFS: "ifs",
  IMPORT: "import",
  PASS: "pass",
  RAISE: "raise",
  RETURN: "return",
  TRY: "try",
  WHILE: "while",
};

/// Keywords are used to specify the kind of commands and expressions.
Calcium.Keyword = {
  ...keyword.BinaryOperator,
  ...keyword.Expression,
  ...keyword.Statement,
  ...keyword.UnaryOperator,
};

/// A builder for classes of a module
class ClassBuilder {
  constructor(name) {
    this.name = name;
    this.attributes = {};
    this.methods = [];
    this.superclass = null; // ClassBuilder
    this.classObj = null;
  }
  /// body: (args, env) => {}
  defineMethod(name, body) {
    this.methods.push(new BuiltinFuncObj(name, body));
    return this; // allows chaining
  }
  // builds a class object to be used internally
  build() {
    if (this.classObj) return this.classObj;

    for (let method of this.methods) {
      this.attributes[method.name] = method;
    }

    let superclassObj;
    if (this.superclass === null) {
      superclassObj = builtin.type.object;
    } else {
      superclassObj = this.superclass.build();
    }
    this.classObj = new ClassObj(this.name, superclassObj, this.attributes);
    return this.classObj;
  }
  inherit(superclass) {
    if (superclass instanceof ClassBuilder) {
      this.superclass = superclass;
      return this; // allows chaining
    } else {
      throw new SuperclassNotValidError("superclass must be a ClassBuilder");
    }
  }
}

/// A builder for modules of a library
class ModuleBuilder {
  constructor() {
    this.modules = [];
  }
  /// defines a module
  addModule(name) {
    const module = {
      name,
      classBuilders: [],
      functions: [],
    };
    this.modules.push(module);
    return {
      createClassBuilder(name) {
        const classBuilder = new ClassBuilder(name);
        module.classBuilders.push(classBuilder);
        return classBuilder;
      },
      // body: (args, env) => {}
      defineFunction(name, body) {
        const func = new BuiltinFuncObj(name, body);
        module.functions.push(func);
      },
    };
  }
  *buildAll() {
    for (let module of this.modules) {
      const classes = [];
      for (let classBuilder of module.classBuilders) {
        classes.push(classBuilder.build());
      }
      const moduleObj = new Module(module.name, classes, module.functions);
      yield moduleObj;
    }
  }
}
Calcium.ModuleBuilder = ModuleBuilder; // publish

/// Parses JSON arrays to commands in Calcium
class Parser {
  constructor() {
    const table = {};

    table[Calcium.Keyword.ASSIGNMENT] = (lineArray) => {
      const lhs = this.parseReference(lineArray[Calcium.Index.ASSIGNMENT_LHS]);
      const rhs = this.parseExpression(lineArray[Calcium.Index.ASSIGNMENT_RHS]);
      return new Assignment(lhs, rhs);
    };

    table[Calcium.Keyword.BREAK] = () => new Break();

    table[Calcium.Keyword.CALL] = (lineArray) => {
      let lhs = lineArray[Calcium.Index.CALL_LHS];
      if (lhs !== null) {
        lhs = this.parseReference(lhs);
      }
      // Variable or Attribute.
      const calledFuncRef = this.parseReference(
        lineArray[Calcium.Index.CALL_REFERENCE]
      );
      const args = this.parseArgs(lineArray, Calcium.Index.CALL_ARGS);
      return new Call(lhs, calledFuncRef, args);
    };

    table[Calcium.Keyword.CLASS_DEF] = (lineArray) => {
      const className = lineArray[Calcium.Index.CLASS_DEF_CLASS_NAME];
      const superclassName = lineArray[Calcium.Index.CLASS_DEF_SUPERCLASS_NAME];
      return new ClassDef(className, superclassName);
    };

    table[Calcium.Keyword.COMMENT] = (lineArray) => {
      const options = lineArray[Calcium.Index.OPTIONS];
      return new Comment(options);
    };

    table[Calcium.Keyword.COMPOUND_ADDITION] = (lineArray) => {
      return _createCompoundAssignment(Calcium.Keyword.ADDITION, lineArray);
    };

    table[Calcium.Keyword.COMPOUND_SUBTRACTION] = (lineArray) => {
      return _createCompoundAssignment(Calcium.Keyword.SUBTRACTION, lineArray);
    };

    table[Calcium.Keyword.COMPOUND_MULTIPLICATION] = (lineArray) => {
      return _createCompoundAssignment(
        Calcium.Keyword.MULTIPLICATION,
        lineArray
      );
    };

    table[Calcium.Keyword.CONTINUE] = () => new Continue();

    table[Calcium.Keyword.ELIF] = (lineArray) => {
      const condition = this.parseExpression(
        lineArray[Calcium.Index.CONDITION]
      );
      return new Elif(condition);
    };

    table[Calcium.Keyword.ELSE] = () => new Else();

    table[Calcium.Keyword.END_OF_CODE] = () => new EndOfCode();

    table[Calcium.Keyword.EXCEPT] = (lineArray) => {
      let typeName = lineArray[Calcium.Index.EXCEPT_TYPE_NAME];
      if (typeName === undefined) {
        typeName = null;
      }
      let objName = lineArray[Calcium.Index.EXCEPT_OBJ_NAME];
      if (objName === undefined) {
        objName = null;
      }
      return new Except(typeName, objName);
    };

    table[Calcium.Keyword.FOR_EACH] = (lineArray) => {
      const elementName = lineArray[Calcium.Index.FOR_EACH_ELEMENT_NAME];
      const iterable = this.parseExpression(
        lineArray[Calcium.Index.FOR_EACH_ITERABLE]
      );
      return new ForEach(elementName, iterable);
    };

    table[Calcium.Keyword.FOR_RANGE] = (lineArray) => {
      const variableName = lineArray[Calcium.Index.FOR_RANGE_VARIABLE_NAME];
      const values = lineArray[Calcium.Index.FOR_RANGE_VALUES];
      const length = values.length;
      if (length === 1) {
        let stop = this.parseExpression(values[0]);
        return new ForRange(variableName, null, stop, null);
      } else if (length >= 2) {
        const start = this.parseExpression(values[0]);
        let stop = this.parseExpression(values[1]);
        if (length === 2) {
          return new ForRange(variableName, start, stop, null);
        } else {
          const step = this.parseExpression(values[2]);
          return new ForRange(variableName, start, stop, step);
        }
      }
    };

    table[Calcium.Keyword.FUNC_DEF] = (lineArray) => {
      const funcName = lineArray[Calcium.Index.FUNC_DEF_FUNC_NAME];
      const params = lineArray[Calcium.Index.FUNC_DEF_PARAMETERS];
      return new FuncDef(funcName, params);
    };

    table[Calcium.Keyword.IF] = (lineArray) => {
      const condition = this.parseExpression(
        lineArray[Calcium.Index.CONDITION]
      );
      return new If(condition);
    };

    table[Calcium.Keyword.IFS] = () => new Ifs();

    table[Calcium.Keyword.IMPORT] = (lineArray) => {
      const moduleName = lineArray[Calcium.Index.IMPORT_MODULE_NAME];
      return new Import(moduleName);
    };

    table[Calcium.Keyword.PASS] = () => new Pass();

    table[Calcium.Keyword.RAISE] = (lineArray) => {
      const exceptionName = lineArray[Calcium.Index.RAISE_EXCEPTION];
      const args = this.parseArgs(lineArray, Calcium.Index.RAISE_ARGS);
      return new Raise(exceptionName, args);
    };

    table[Calcium.Keyword.RETURN] = (lineArray) => {
      if (lineArray.length - 1 < Calcium.Index.RETURN_VALUE) {
        return new Return(null);
      } else {
        const expr = this.parseExpression(
          lineArray[Calcium.Index.RETURN_VALUE]
        );
        return new Return(expr);
      }
    };

    table[Calcium.Keyword.TRY] = () => new Try();

    table[Calcium.Keyword.WHILE] = (lineArray) => {
      const condition = this.parseExpression(
        lineArray[Calcium.Index.CONDITION]
      );
      return new While(condition);
    };

    const _self = this;
    function _createCompoundAssignment(keyword, lineArray) {
      const lhs = _self.parseReference(lineArray[Calcium.Index.ASSIGNMENT_LHS]);
      const rhs = _self.parseExpression(
        lineArray[Calcium.Index.ASSIGNMENT_RHS]
      );
      const operation = new BinaryOperation(keyword, lhs, rhs);
      return new Assignment(lhs, operation);
    }

    this.table = table;

    this.binaryOperators = Object.values(keyword.BinaryOperator);
    this.unaryOperators = Object.values(keyword.UnaryOperator);
  }
  parse(lineArray) {
    const keyword = lineArray[Calcium.Index.KEYWORD];
    return this.table[keyword](lineArray);
  }
  parseArgs(lineArray, index) {
    const argsArray = lineArray[index];
    return argsArray.map((v) => this.parseExpression(v));
  }
  parseExpression(obj) {
    if (obj instanceof Array) {
      if (obj[0] instanceof Array)
        return obj[0].map((v) => this.parseExpression(v));
      else {
        const keyword = obj[Calcium.Index.EXPRESSION_KEYWORD];
        if (this.binaryOperators.includes(keyword)) {
          const leftOperand = this.parseExpression(
            obj[Calcium.Index.LEFT_OPERAND]
          );
          const rightOperand = this.parseExpression(
            obj[Calcium.Index.RIGHT_OPERAND]
          );
          return new BinaryOperation(keyword, leftOperand, rightOperand);
        } else if (this.unaryOperators.includes(keyword)) {
          const operand = this.parseExpression(
            obj[Calcium.Index.UNARY_OPERAND]
          );
          return new UnaryOperation(keyword, operand);
        } else {
          // var, attr, sub
          return this.parseReference(obj);
        }
      }
    } else if (obj instanceof Object) {
      const dict = {};
      // key accepts string type only
      for (let key in obj) {
        dict[key] = this.parseExpression(obj[key]);
      }
      return dict;
    } else {
      return obj; // Include null
    }
  }
  parseReference(arrayObj) {
    const keyword = arrayObj[Calcium.Index.EXPRESSION_KEYWORD];
    if (keyword === Calcium.Keyword.VARIABLE) {
      const name = arrayObj[Calcium.Index.VARIABLE_NAME];
      return new Variable(name);
    } else if (keyword === Calcium.Keyword.ATTRIBUTE) {
      const objName = arrayObj[Calcium.Index.ATTRIBUTE_OBJECT_NAME];
      const propertyNames = [];
      for (
        let i = Calcium.Index.ATTRIBUTE_PROPERTY_NAMES;
        i < arrayObj.length;
        ++i
      ) {
        propertyNames.push(arrayObj[i]);
      }
      return new Attribute(objName, propertyNames);
    } else if (keyword === Calcium.Keyword.SUBSCRIPT) {
      const objRef = this.parseReference(
        arrayObj[Calcium.Index.SUBSCRIPT_REFERENCED_OBJECT]
      );
      const indexExpr = this.parseExpression(
        arrayObj[Calcium.Index.SUBSCRIPT_INDEX_EXPR]
      );
      return new Subscript(objRef, indexExpr);
    }
  }
}
Calcium.Parser = Parser;

// ==== private classes ====

// contain (x, y) as (indent, index)
class Address {
  constructor(indent, index) {
    this.indent = indent;
    this.index = index;
  }
  // copy address and create new one
  clone() {
    return new Address(this.indent, this.index);
  }
}

// access attribute, e.g. self.name
class Attribute {
  constructor(objName, propertyNames) {
    this.objName = objName;
    this.propertyNames = propertyNames;
  }
  assign(value, env) {
    const instance = env.lookUp(this.objName);
    let target = instance;
    for (let i = 0; i < this.propertyNames.length - 1; ++i) {
      target = target.getAttribute(this.propertyNames[i]);
    }
    target.setAttribute(
      this.propertyNames[this.propertyNames.length - 1],
      value
    );
  }
  debugEvaluate(env) {
    const instance = env.debugLookUp(this.objName);
    let target = instance;
    for (let prop of this.propertyNames) {
      if (
        target instanceof ClassObj ||
        target instanceof Instance ||
        target instanceof Super ||
        target instanceof FuncObj ||
        target instanceof MethodObj ||
        target instanceof Module
      ) {
        target = target.getAttribute(prop);
      } else {
        throw new AttributeNotExistError();
      }
    }
    return target;
  }
  evaluate(env) {
    const instance = env.lookUp(this.objName);
    let prop;
    try {
      let target = instance;
      for (prop of this.propertyNames) {
        target = this.getAttribute(target, prop);
      }
      return target;
    } catch (e) {
      if (e instanceof ModuleNotImportedError) {
        env.raiseException(e.name);
        return null;
      } else {
        const error = new AttributeNotExistError();
        env.raiseException(error.name, [prop]);
        return null;
      }
    }
  }
  // gets the built-in method of built-in types
  getAttribute(obj, name) {
    if (obj instanceof Array) {
      if (name === "append" || name in methodNames["append"]) {
        return new BuiltinFuncObj(name, function(args, env) {
          obj.push(env.evaluate(args[0]));
          return null;
        });
      } else if (name === "pop" || name in methodNames["pop"]) {
        return new BuiltinFuncObj(name, function(args, env) {
          let value;
          if (args.length === 0) {
            value = obj.pop();
          } else {
            let index = env.evaluate(args[0]);
            value = obj.splice(index, 1)[0];
          }
          if (value !== undefined) {
            return value;
          } else {
            const error = new CannotPopFromListError();
            env.raiseException(error.name);
            return null;
          }
        });
      } else if (name === "insert" || name in methodNames["insert"]) {
        return new BuiltinFuncObj(name, function(args, env) {
          let index = env.evaluate(args[0]);
          const elem = env.evaluate(args[1]);
          if (index > obj.length) {
            index = obj.length; // Space is not allowed.
          }
          obj.splice(index, 0, elem);
          return null;
        });
      }
    } else if (obj instanceof String || typeof obj === "string") {
      if (name === "find" || name in methodNames["find"]) {
        return new BuiltinFuncObj(name, function(args, env) {
          const sub = env.evaluate(args[0]);
          return obj.indexOf(sub);
        });
      } else if (name === "replace" || name in methodNames["replace"]) {
        return new BuiltinFuncObj(name, function(args, env) {
          let fromStr = env.evaluate(args[0]);
          let toStr = env.evaluate(args[1]);
          return obj.replace(new RegExp(fromStr, "g"), toStr);
        });
      } else if (name === "split" || name in methodNames["split"]) {
        return new BuiltinFuncObj(name, function(args, env) {
          let separator = env.evaluate(args[0]);
          return obj.split(separator);
        });
      } else if (name === "isdigit" || name in methodNames["isdigit"]) {
        return new BuiltinFuncObj(name, function() {
          const halfWidth = convertFullWidthNumbers(obj);
          return /^\d+$/.test(halfWidth);
        });
      }
    } else if (
      (name === "keys" || name in methodNames["keys"]) &&
      !(
        obj instanceof Array ||
        obj instanceof String ||
        typeof obj === "string" ||
        obj instanceof ClassObj ||
        obj instanceof Instance ||
        obj instanceof FuncObj ||
        obj instanceof MethodObj ||
        obj instanceof BuiltinFuncObj ||
        obj instanceof Super ||
        obj instanceof Module
      )
    ) {
      return new BuiltinFuncObj(name, function() {
        return Object.keys(obj);
      });
    } else {
      return obj.getAttribute(name);
    }
  }
  get description() {
    return `${this.objName}.${this.propertyNames.join(".")}`;
  }
}

class BinaryOperation {
  constructor(operator, leftOperand, rightOperand) {
    this.operator = operator;
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;

    const table = {};

    table[Calcium.Keyword.ADDITION] = (leftOperand, rightOperand) =>
      leftOperand + rightOperand;

    table[Calcium.Keyword.SUBTRACTION] = (leftOperand, rightOperand) =>
      leftOperand - rightOperand;

    table[Calcium.Keyword.MULTIPLICATION] = (leftOperand, rightOperand) => {
      if (
        (leftOperand instanceof String || typeof leftOperand === "string") &&
        Number.isInteger(rightOperand)
      ) {
        let s = "";
        for (let i = 0; i < rightOperand; ++i) {
          s += leftOperand;
        }
        return s;
      } else {
        return leftOperand * rightOperand;
      }
    };

    table[Calcium.Keyword.EXPONENTIATION] = (leftOperand, rightOperand) =>
      Math.pow(leftOperand, rightOperand);

    table[Calcium.Keyword.DIVISION] = (leftOperand, rightOperand) =>
      leftOperand / rightOperand;

    table[Calcium.Keyword.FLOOR_DIVISION] = (leftOperand, rightOperand) =>
      Math.floor(leftOperand / rightOperand);

    table[Calcium.Keyword.REMAINDER] = (leftOperand, rightOperand) =>
      leftOperand % rightOperand;

    table[Calcium.Keyword.EQUAL] = (leftOperand, rightOperand) => {
      function isEqual(left, right) {
        if (left instanceof Array && right instanceof Array) {
          if (left.length !== right.length) {
            return false;
          } else {
            for (let i = 0; i < left.length; ++i) {
              if (isEqual(left[i], right[i])) {
                continue;
              } else {
                return false;
              }
            }
            return true;
          }
        } else if (
          !(
            left === null ||
            typeof left === "number" ||
            typeof left === "boolean" ||
            typeof left === "string" ||
            left instanceof String ||
            left instanceof Instance ||
            left instanceof ClassObj ||
            left instanceof FuncObj ||
            left instanceof MethodObj ||
            left instanceof Super ||
            left instanceof BuiltinFuncObj ||
            left instanceof Module
          ) &&
          !(
            right === null ||
            typeof right === "number" ||
            typeof right === "boolean" ||
            typeof right === "string" ||
            right instanceof String ||
            right instanceof Instance ||
            right instanceof ClassObj ||
            right instanceof FuncObj ||
            right instanceof MethodObj ||
            right instanceof Super ||
            right instanceof BuiltinFuncObj ||
            right instanceof Module
          )
        ) {
          for (let key in left) {
            if (isEqual(left[key], right[key])) {
              continue;
            } else {
              return false;
            }
          }
          return true;
        } else {
          return left === right;
        }
      }
      return isEqual(leftOperand, rightOperand);
    };

    table[Calcium.Keyword.NOT_EQUAL] = (leftOperand, rightOperand) =>
      !table[Calcium.Keyword.EQUAL](leftOperand, rightOperand);

    table[Calcium.Keyword.LESS_THAN] = (leftOperand, rightOperand) =>
      leftOperand < rightOperand;

    table[Calcium.Keyword.LESS_THAN_OR_EQUAL] = (leftOperand, rightOperand) =>
      leftOperand <= rightOperand;

    table[Calcium.Keyword.GREATER_THAN] = (leftOperand, rightOperand) =>
      leftOperand > rightOperand;

    table[Calcium.Keyword.GREATER_THAN_OR_EQUAL] = (
      leftOperand,
      rightOperand
    ) => leftOperand >= rightOperand;

    table[Calcium.Keyword.AND] = (leftOperand, rightOperand) =>
      leftOperand && rightOperand;

    table[Calcium.Keyword.OR] = (leftOperand, rightOperand) =>
      leftOperand || rightOperand;

    table[Calcium.Keyword.IS] = (leftOperand, rightOperand) =>
      leftOperand === rightOperand;

    table[Calcium.Keyword.IS_NOT] = (leftOperand, rightOperand) =>
      leftOperand !== rightOperand;

    table[Calcium.Keyword.IN] = (leftOperand, rightOperand) => {
      if (rightOperand instanceof Array) {
        return rightOperand.some((v) => leftOperand === v);
      } else if (
        rightOperand instanceof String ||
        typeof rightOperand === "string"
      ) {
        return rightOperand.includes(leftOperand);
      } else if (
        !(
          rightOperand === null ||
          typeof rightOperand === "number" ||
          typeof rightOperand === "boolean" ||
          rightOperand instanceof Instance ||
          rightOperand instanceof ClassObj ||
          rightOperand instanceof FuncObj ||
          rightOperand instanceof MethodObj ||
          rightOperand instanceof Super ||
          rightOperand instanceof BuiltinFuncObj ||
          rightOperand instanceof Module
        )
      ) {
        return leftOperand in rightOperand;
      } else {
        throw new InvalidOperationError();
      }
    };

    table[Calcium.Keyword.NOT_IN] = (leftOperand, rightOperand) =>
      !table[Calcium.Keyword.IN](leftOperand, rightOperand);

    table[Calcium.Keyword.BITWISE_AND] = (leftOperand, rightOperand) =>
      leftOperand & rightOperand;

    table[Calcium.Keyword.BITWISE_OR] = (leftOperand, rightOperand) =>
      leftOperand | rightOperand;

    table[Calcium.Keyword.BITWISE_XOR] = (leftOperand, rightOperand) =>
      leftOperand ^ rightOperand;

    table[Calcium.Keyword.LEFT_SHIFT] = (leftOperand, rightOperand) =>
      leftOperand << rightOperand;

    table[Calcium.Keyword.RIGHT_SHIFT] = (leftOperand, rightOperand) =>
      leftOperand >> rightOperand;

    this.table = table;
  }
  debugOperate(env) {
    const leftOperandValue = env.debugEvaluate(this.leftOperand);
    const rightOperandValue = env.debugEvaluate(this.rightOperand);
    const operatorFunction = this.table[this.operator];
    try {
      return operatorFunction(leftOperandValue, rightOperandValue);
    } catch {
      throw new InvalidOperationError();
    }
  }
  operate(env) {
    const leftOperandValue = env.evaluate(this.leftOperand);
    const rightOperandValue = env.evaluate(this.rightOperand);
    const operatorFunction = this.table[this.operator];
    try {
      return operatorFunction(leftOperandValue, rightOperandValue);
    } catch (e) {
      const error = new InvalidOperationError();
      env.raiseException(error.name, [this.operator]);
      return null;
    }
  }
  get description() {
    const leftOperand = wrapString(this.leftOperand);
    const rightOperand = wrapString(this.rightOperand);

    return (
      wrapDescriptionByParen(leftOperand) +
      ` ${this.operator} ` +
      wrapDescriptionByParen(rightOperand)
    );
  }
}

// represent statement such as if, for, etc.
// begin and end closures provide what the block should do.
class Block {
  constructor(kind, address, begin, end) {
    this.kind = kind;
    this.address = address.clone();
    // begin will be called at the start of the block.
    // return true when the block should be executed
    this.begin = begin;
    // end will be called at the end of the block.
    // have no return value
    this.end = end;
  }
}

// built-in function object
class BuiltinFuncObj {
  // body: (args, env) => { ... }
  constructor(name, body) {
    this.name = name;
    this.body = body;
  }
  evaluate() {
    return this;
  }
  get description() {
    return `<built-in function ${this.name}>`;
  }
  get selfClass() {
    return builtin.type.builtin_function_or_method;
  }
}

// built-in method object
class BuiltinMethodObj {
  // body: (args, env) => { ... }
  constructor(instance, funcObj) {
    this.instance = instance;
    this.funcObj = funcObj;
  }
  evaluate() {
    return this;
  }
  get description() {
    return `<built-in method ${this.funcObj.name}>`;
  }
  get selfClass() {
    return builtin.type.builtin_function_or_method;
  }
}

// a storage for a scope
class Namespace {
  constructor(nestingScope = null, dict = {}) {
    this.nestingScope = nestingScope;
    this.dict = dict;
  }
  debugGetTable() {
    const table = [];
    for (let name in this.dict) {
      const value = this.dict[name];
      let type;
      if (typeof value === "number") {
        type = "number";
      } else if (value instanceof Array) {
        type = "list";
      } else if (value instanceof String || typeof value === "string") {
        type = "str";
      } else if (value instanceof ClassObj) {
        type = "class";
      } else if (value instanceof Instance) {
        type = "instance";
      } else if (value instanceof FuncObj) {
        type = "function";
      } else if (value === null) {
        type = "none";
      } else if (value === true || value === false) {
        type = "bool";
      } else if (value instanceof Super) {
        type = "super";
      } else if (value instanceof Module) {
        type = "module";
      } else {
        type = "dict";
      }
      table.push({
        name: name,
        type: type,
        value: describe(value),
      });
    }
    return table;
  }
  // search the name and return an object
  lookUp(name) {
    return this.dict[name];
  }
  // add name and object pair to the dict
  register(name, obj) {
    this.dict[name] = obj;
  }
}

class BuiltinScope extends Namespace {} // used by Environment

// class type object
class ClassObj {
  constructor(name, superclass, attributes = null) {
    this.name = name;
    this.superclass = superclass;
    this.attributes = attributes;
  }
  evaluate() {
    return this;
  }
  getAttribute(name) {
    if (this.attributes !== null) {
      const value = this.attributes[name];
      if (value !== undefined) {
        return value;
      } else {
        return this.superclass.getAttribute(name);
      }
    } else {
      throw new CannotAccessAttributeError();
    }
  }
  setAttribute(name, value) {
    if (this.attributes !== null) {
      this.attributes[name] = value;
      return true;
    } else {
      return false;
    }
  }
  get description() {
    return `<class ${this.name}>`;
  }
}

class ClassScope extends Namespace {
  get attributes() {
    return this.dict;
  }
}

// manage code execution and store state
class Environment {
  constructor(code, parser) {
    this.code = code;

    const _builtinFunctions = {};
    const _builtin = new BuiltinScope(); // built-in functions
    const _global = new GlobalScope(_builtin); // global symbols
    const _self = this; // used in built-in functions

    // current coordinate
    // each line's index is unique but indent is not.
    // change of index gives an other command (statement).
    // indent may change on same index.
    this.address = new Address(1, 0); // (indent, index)

    // have a current control command's Block such as if, for, etc.
    this.blocks = [];

    this.builtin = _builtin;

    this.builtinFunctions = _builtinFunctions;

    // functions' call stack
    this.callStack = [];

    // current context which will be switched by some commands
    this.context = _global;

    // give an exception object when
    // raised by a user or the interpreter
    this.exception = null;

    this.global = _global;

    if (parser) {
      this.parser = parser;
    } else {
      this.parser = new Parser();
    }

    // built-in print function uses this function.
    this.print = null;

    // returned value of a function
    this.returnedValue = null;

    // built-in functions
    // dict function is also needed for isinstance().
    _builtinFunctions[builtin.name.DICT] = new BuiltinFuncObj(
      builtin.name.DICT,
      () => {
        return {};
      }
    );

    _builtinFunctions[builtin.name.HASATTR] = new BuiltinFuncObj(
      builtin.name.HASATTR,
      (args, env) => {
        const obj = env.evaluate(args[0]);
        const attrName = env.evaluate(args[1]);
        if (!obj.attributes) {
          return false;
        } else {
          if (
            obj instanceof FuncObj ||
            obj instanceof ClassObj ||
            obj instanceof Instance ||
            obj instanceof Super ||
            obj instanceof Module
          ) {
            try {
              const attr = obj.getAttribute(attrName);
              return attr !== undefined;
            } catch {
              return false;
            }
          } else {
            return false;
          }
        }
      }
    );

    _builtinFunctions[builtin.name.INT] = new BuiltinFuncObj(
      builtin.name.INT,
      (args, env) => {
        let valueToParse = env.evaluate(args[0]);
        try {
          valueToParse = convertFullWidthNumbers(valueToParse);
          return parseInt(valueToParse);
        } catch {
          const error = new CannotParseAsIntError();
          env.raiseException(error.name);
          return null;
        }
      }
    );

    _builtinFunctions[builtin.name.ISINSTANCE] = new BuiltinFuncObj(
      builtin.name.ISINSTANCE,
      (args, env) => {
        const instance = env.evaluate(args[0]);
        const classObj = env.evaluate(args[1]);
        if (classObj instanceof ClassObj && instance instanceof Instance) {
          let _classObj = instance.selfClass;
          for (;;) {
            if (!_classObj) {
              return false;
            } else if (_classObj === classObj) {
              return true;
            } else {
              _classObj = _classObj.superclass;
            }
          }
        } else {
          if (classObj instanceof BuiltinFuncObj) {
            const builtinFuncObj = classObj;
            if (builtinFuncObj.name === builtin.name.DICT) {
              return !(
                instance === null ||
                typeof instance === "number" ||
                typeof instance === "boolean" ||
                typeof instance === "string" ||
                instance instanceof String ||
                instance instanceof Array ||
                instance instanceof Instance ||
                instance instanceof ClassObj ||
                instance instanceof FuncObj ||
                instance instanceof MethodObj ||
                instance instanceof Super ||
                instance instanceof BuiltinFuncObj ||
                instance instanceof Module
              );
            } else if (builtinFuncObj.name === builtin.name.INT) {
              return typeof instance === "number";
            } else if (builtinFuncObj.name === builtin.name.LIST) {
              return instance instanceof Array;
            } else if (builtinFuncObj.name === builtin.name.STR) {
              return instance instanceof String || typeof instance === "string";
            } else if (builtinFuncObj.name === builtin.name.super) {
              return instance instanceof Super;
            }
          } else {
            return false;
          }
        }
      }
    );

    _builtinFunctions[builtin.name.ISSUBCLASS] = new BuiltinFuncObj(
      builtin.name.ISSUBCLASS,
      (args, env) => {
        const classObj = env.evaluate(args[0]);
        const superclass = env.evaluate(args[1]);
        if (classObj instanceof ClassObj && superclass instanceof ClassObj) {
          let _classObj = classObj;
          for (;;) {
            if (!_classObj) {
              return false;
            } else if (_classObj === superclass) {
              return true;
            } else {
              _classObj = _classObj.superclass;
            }
          }
        } else {
          return false;
        }
      }
    );

    _builtinFunctions[builtin.name.LEN] = new BuiltinFuncObj(
      builtin.name.LEN,
      (args, env) => {
        const iterableObj = env.evaluate(args[0]);
        if (typeof iterableObj === "string") {
          return new String(iterableObj).length;
        } else if (
          iterableObj instanceof Array ||
          iterableObj instanceof String
        ) {
          return iterableObj.length;
        } else {
          const error = new ObjectNotIterableError();
          env.raiseException(error.name);
          return null;
        }
      }
    );

    _builtinFunctions[builtin.name.LIST] = new BuiltinFuncObj(
      builtin.name.LIST,
      (args, env) => {
        if (args.length === 0) return [];

        let iterableObj = env.evaluate(args[0]);
        if (typeof iterableObj === "string") {
          iterableObj = new String(iterableObj);
        }
        if (iterableObj instanceof Array || iterableObj instanceof String) {
          const list = [];
          for (let elem of iterableObj) {
            list.push(elem);
          }
          return list;
        } else {
          const error = new ObjectNotIterableError();
          env.raiseException(error.name);
          return null;
        }
      }
    );

    _builtinFunctions[builtin.name.PRINT] = new BuiltinFuncObj(
      builtin.name.PRINT,
      (args, env) => {
        const descriptions = args
          .map((v) => env.evaluate(v))
          .map((v) => describe(v));
        const strToPrint = descriptions.join(" ") + "\n";
        if (!env.hasException && _self.print) {
          _self.print(strToPrint);
        }
        return null;
      }
    );

    _builtinFunctions[builtin.name.STR] = new BuiltinFuncObj(
      builtin.name.STR,
      (args, env) => {
        return describe(env.evaluate(args[0]));
      }
    );

    _builtinFunctions[builtin.name.SUPER] = new BuiltinFuncObj(
      builtin.name.SUPER,
      (args, env) => {
        const classObj = env.evaluate(args[0]);
        const instance = env.evaluate(args[1]);
        if (classObj instanceof ClassObj && instance instanceof Instance) {
          return new Super(classObj, instance);
        } else {
          const error = new InvalidArgumentsForSuperError();
          env.raiseException(error.name);
          return null;
        }
      }
    );

    for (let funcName in _builtinFunctions) {
      this.builtin.register(funcName, _builtinFunctions[funcName]);
    }

    // built-in exceptions
    this.builtin.register(builtin.name.EXCEPTION, builtin.type.exception);
    registerExceptionClass(AttributeNotExistError, this);
    registerExceptionClass(CannotAccessAttributeError, this);
    registerExceptionClass(CannotApplySubscriptError, this);
    registerExceptionClass(CannotInvokeFunctionError, this);
    registerExceptionClass(CannotParseAsIntError, this);
    registerExceptionClass(CannotPopFromListError, this);
    registerExceptionClass(ExceptionNotHandledError, this);
    registerExceptionClass(InconsistentBlockError, this);
    registerExceptionClass(InvalidArgumentsForSuperError, this);
    registerExceptionClass(InvalidBreakError, this);
    registerExceptionClass(InvalidContinueError, this);
    registerExceptionClass(InvalidExceptionError, this);
    registerExceptionClass(InvalidOperationError, this);
    registerExceptionClass(InvalidReturnError, this);
    registerExceptionClass(ModuleNotImportedError, this);
    registerExceptionClass(NameNotFoundError, this);
    registerExceptionClass(ObjectNotIterableError, this);
    registerExceptionClass(SubscriptNotAllowedError, this);
    registerExceptionClass(SuperCallFailedError, this);
    registerExceptionClass(SuperclassNotValidError, this);
    registerExceptionClass(ValueNotFoundError, this);
  }
  // enter a block if its begin method returns true
  beginBlock(block) {
    this.address = block.address.clone();
    if (block.begin(this)) {
      this.shiftIndent(1); // enter this block
      this.blocks.push(block); // save the block
    }
  }
  // used by a debugger
  debugEvaluate(expr) {
    if (
      expr instanceof Variable ||
      expr instanceof Attribute ||
      expr instanceof Subscript
    ) {
      return expr.debugEvaluate(this);
    } else if (
      expr instanceof BinaryOperation ||
      expr instanceof UnaryOperation
    ) {
      return expr.debugOperate(this);
    } else if (expr instanceof Array) {
      // expr is an array literal
      return expr.map((v) => this.debugEvaluate(v));
    } else if (
      expr instanceof ClassObj ||
      expr instanceof Instance ||
      expr instanceof FuncObj ||
      expr instanceof MethodObj
    ) {
      return expr;
    } else if (expr instanceof Object) {
      // expr is a dict literal
      const evaluatedDict = {};
      for (let key in expr) {
        evaluatedDict[key] = this.debugEvaluate(expr[key]);
      }
      return evaluatedDict;
    } else {
      return expr;
    }
  }
  // used by a debugger
  debugLookUp(name) {
    let currentScope = this.context;
    for (;;) {
      const value = currentScope.lookUp(name);
      if (value !== undefined) {
        return value;
      } else {
        currentScope = currentScope.nestingScope;
        if (currentScope === null) {
          // don't use this.raiseException here
          throw new NameNotFoundError(
            `${name} not found`,
            this.address.index,
            name
          );
        } else {
          continue;
        }
      }
    }
  }
  // called if the next line's indent < the current
  // returns true when an address is jumped over so that it is needed
  // to search a next line
  endBlock() {
    try {
      const block = this.popBlock();
      if (this.hasException) {
        return null;
      }
      block.end(this);
      switch (block.kind) {
        case Calcium.BlockKind.IFS:
        case Calcium.BlockKind.CLASS_DEF:
        case Calcium.BlockKind.TRY:
        case Calcium.BlockKind.EXCEPT:
          return false;
        case Calcium.BlockKind.IF_ELIF_ELSE:
        case Calcium.BlockKind.CALL:
          return true;
        case Calcium.BlockKind.WHILE:
        case Calcium.BlockKind.FOR_RANGE:
        case Calcium.BlockKind.FOR_EACH:
          this.beginBlock(block); // start next loop
          return true;
        default:
          return false;
      }
    } catch (e) {
      if (e instanceof ExceptionNotHandledError) {
        throw e;
      } else {
        const error = new InconsistentBlockError();
        this.raiseException(error.name);
        return null;
      }
    }
  }
  // evaluate an expression
  evaluate(expr) {
    if (
      expr instanceof Variable ||
      expr instanceof Attribute ||
      expr instanceof Subscript
    ) {
      return expr.evaluate(this);
    } else if (
      expr instanceof BinaryOperation ||
      expr instanceof UnaryOperation
    ) {
      return expr.operate(this);
    } else if (expr instanceof Array) {
      // expr is an array literal
      return expr.map((v) => this.evaluate(v));
    } else if (
      expr instanceof ClassObj ||
      expr instanceof Instance ||
      expr instanceof FuncObj ||
      expr instanceof MethodObj
    ) {
      return expr;
    } else if (expr instanceof Object) {
      // expr is a dict literal
      const evaluatedDict = {};
      for (let key in expr) {
        evaluatedDict[key] = this.evaluate(expr[key]);
      }
      return evaluatedDict;
    } else {
      return expr;
    }
  }
  // find an except block
  _findExcept() {
    let nextIndex = this.address.index + 1;
    for (;;) {
      const nextLine = this.code[nextIndex];

      // reached to the end
      if (nextLine === undefined) {
        // set to the index of end command
        this.address.index = this.code.length - 1;
        return null;
      }

      const indent = nextLine[Calcium.Index.INDENT];
      if (indent < this.address.indent) {
        // except blocks were not found.
        return null;
      } else {
        if (
          nextLine[Calcium.Index.KEYWORD] === Calcium.Keyword.EXCEPT &&
          indent === this.address.indent
        ) {
          this.jumpTo(new Address(this.address.indent, nextIndex));
          // return except command
          return this.parser.parse(nextLine);
        } else {
          nextIndex += 1;
          continue;
        }
      }
    }
  }
  // used when a function is called or a next loop is started
  jumpTo(address) {
    this.address = address.clone();
  }
  // evaluate the name in the context
  lookUp(name) {
    let currentScope = this.context;
    for (;;) {
      const value = currentScope.lookUp(name);
      if (value !== undefined) {
        return value;
      } else {
        currentScope = currentScope.nestingScope;
        if (currentScope === null) {
          const error = new NameNotFoundError();
          this.raiseException(error.name, [name + " not found"]);
          return null;
        } else {
          continue;
        }
      }
    }
  }
  // returns a current block
  popBlock() {
    return this.blocks.pop();
  }
  // invoked when a function call is finished
  popCallStack() {
    const previousContext = this.callStack.pop();
    this.context = previousContext;
  }
  // invoked when a function is called
  pushCallStack(newContext) {
    this.callStack.push(this.context);
    this.context = newContext;
  }
  // execute a raise command or throw an internal error
  raiseException(exceptionName, args = []) {
    if (this.hasException) return;
    const raisedAddress = this.address.clone();
    const raisedExceptionClass = this.lookUp(exceptionName);
    const raisedExceptionObj = new Instance(raisedExceptionClass);

    // init exception by using an args array
    args.unshift(raisedAddress.index);
    args.unshift(raisedExceptionObj);

    const init = raisedExceptionObj.getAttribute(builtin.name.INIT);
    // init must be a BuiltinMethodObj.
    init.funcObj.body(args, this);

    // find a try block
    for (;;) {
      let block;
      try {
        block = this.popBlock();
        if (block.kind !== Calcium.BlockKind.TRY) {
          if (block.kind === Calcium.BlockKind.CALL) {
            this.popCallStack();
          }
          continue;
        }
      } catch (e) {
        // block is empty.
        const error = new ExceptionNotHandledError(raisedAddress.index);
        const unhandledException = this.lookUp(error.name);
        this.exception = new Instance(unhandledException);
        this.exception.attributes.index = raisedAddress.index;
        this.exception.attributes.exception = raisedExceptionObj;
        this.address = new Address(0, this.address.index);
        return;
      }

      // Nearest try block has been found.
      this.jumpTo(block.address);

      for (;;) {
        const exceptCommand = this._findExcept();
        if (exceptCommand === null) break;

        if (exceptCommand.typeName === null) {
          // catch all
          this.exception = raisedExceptionObj;
          return;
        }
        const exceptionClassToCatch = this.lookUp(exceptCommand.typeName);
        const shouldBeCaught = this.builtinFunctions[
          builtin.name.ISINSTANCE
        ].body([raisedExceptionObj, exceptionClassToCatch], this);
        if (shouldBeCaught) {
          this.exception = raisedExceptionObj;
          return;
        } else {
          continue;
        }
      }
      // search nesting try block
    }
    // not reached
  }
  // make a variable, function or class etc. in the context
  register(name, obj) {
    this.context.register(name, obj);
  }
  // When a function is executed in a class definition or
  // a nested class is defined, this.context has to be
  // changed from a current one.
  searchNestingScope() {
    let currentScope = this.context;
    for (;;) {
      if (currentScope instanceof ClassScope) {
        // use a function scope or the global for a namespace
        currentScope = currentScope.nestingScope;
        continue;
      } else {
        return currentScope;
      }
    }
  }
  // change the indent level of a current address
  shiftIndent(delta) {
    this.address.indent += delta;
  }
  // search the next line to be executed
  skipToNextLine() {
    let nextIndex = this.address.index + 1;
    for (;;) {
      let nextLine = this.code[nextIndex];
      let nextIndent = nextLine[Calcium.Index.INDENT];
      let deltaIndent = nextIndent - this.address.indent;
      if (deltaIndent <= 0) {
        // skip this loop when deltaIndent === 0
        for (let i = 0; i > deltaIndent; --i) {
          let isAddressJumped = this.endBlock();
          if (this.hasException) {
            // temporarily return
            return;
          }
          if (isAddressJumped) {
            this.skipToNextLine();
            return;
          }
        }
        break; // stop while (true) loop. Not inner for loop
      }
      nextIndex += 1;
    }
    this.address.index = nextIndex;
  }
  // change the current line of the execution
  stepLine(delta) {
    this.address.index += delta;
  }
  // not push or pop the stack
  switchContext(nextContext) {
    this.context = nextContext;
  }
  get hasException() {
    return this.exception !== null;
  }
}

class FuncObj {
  constructor(name, params, nestingScope, address) {
    this.name = name;
    this.params = params;
    this.nestingScope = nestingScope;
    this.address = address.clone();
    this.attributes = {};
  }
  evaluate() {
    return this;
  }
  getAttribute(name) {
    const attr = this.attributes[name];
    return attr; // Cannot throw an error at this point
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
    return true;
  }
  get description() {
    return `<function ${this.name}>`;
  }
  get selfClass() {
    return builtin.type.function;
  }
}

// have local variables in a function
class FuncScope extends Namespace {}

// have global variables, functions and classes
class GlobalScope extends Namespace {}

class Instance {
  constructor(selfClass) {
    this.selfClass = selfClass;
    this.attributes = {};
  }
  evaluate() {
    return this;
  }
  getAttribute(name) {
    const attr = this.attributes[name];
    if (attr !== undefined) {
      return attr;
    } else {
      const classAttr = this.selfClass.getAttribute(name);
      if (classAttr instanceof FuncObj) {
        return new MethodObj(this, classAttr);
      } else if (classAttr instanceof BuiltinFuncObj) {
        return new BuiltinMethodObj(this, classAttr);
      } else {
        return classAttr;
      }
    }
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
    return true;
  }
  get description() {
    return `<instance of ${this.selfClass.name}>`;
  }
}

class MethodObj {
  constructor(instance, funcObj) {
    this.instance = instance;
    this.funcObj = funcObj;
  }
  evaluate() {
    return this;
  }
  getAttribute() {
    return undefined;
  }
  setAttribute() {
    return false;
  }
  get description() {
    return `<method ${this.funcObj.name}>`;
  }
  get selfClass() {
    return builtin.type.instance_method;
  }
}

class Module {
  constructor(name, classes = [], functions = []) {
    this.name = name;
    this.attributes = {};
    for (let cls of classes) {
      this.attributes[cls.name] = cls;
    }
    for (let func of functions) {
      this.attributes[func.name] = func;
    }
    this.isImported = false;
  }
  evaluate() {
    return this;
  }
  getAttribute(name) {
    if (this.isImported) {
      return this.attributes[name];
    } else {
      throw new ModuleNotImportedError();
    }
  }
  setAttribute() {
    return false;
  }
  get description() {
    return `<module ${this.name}>`;
  }
  get selfClass() {
    return builtin.type.module;
  }
}

class Subscript {
  constructor(objRef, indexExpr) {
    this.objRef = objRef;
    this.indexExpr = indexExpr;
  }
  assign(value, env) {
    const obj = this.lookUp(env);
    if (env.hasException) return null;
    if (obj instanceof String || typeof obj === "string") {
      const error = new SubscriptNotAllowedError();
      env.raiseException(error.name);
      return null;
    }
    let index = env.evaluate(this.indexExpr);
    if (index < 0) {
      index += obj.length;
    }
    obj[index] = value;
  }
  debugEvaluate(env) {
    const obj = env.debugEvaluate(this.objRef);
    if (
      !(
        obj instanceof Array ||
        obj instanceof String ||
        typeof obj === "string" ||
        obj instanceof Object
      )
    ) {
      throw new SubscriptNotAllowedError();
    }
    const subscript = env.debugEvaluate(this.indexExpr);
    const value = obj[subscript];
    if (value !== undefined) {
      return value;
    } else {
      throw new ValueNotFoundError(
        `${subscript} not found`,
        env.address.index,
        subscript
      );
    }
  }
  evaluate(env) {
    const obj = this.lookUp(env);
    if (env.hasException) return null;
    let index = env.evaluate(this.indexExpr);
    if (index < 0) {
      index += obj.length;
    }
    const value = obj[index];
    if (value !== undefined) {
      return value;
    } else {
      const error = new ValueNotFoundError();
      env.raiseException(error.name, [`${index} not found`]);
      return null;
    }
  }
  lookUp(env) {
    const obj = env.evaluate(this.objRef);
    if (
      obj instanceof Array ||
      obj instanceof String ||
      typeof obj === "string" ||
      obj instanceof Object
    ) {
      return obj;
    } else {
      const error = new SubscriptNotAllowedError();
      env.raiseException(error.name);
      return null;
    }
  }
  get description() {
    return this.objRef.description + `[${describe(this.indexExpr)}]`;
  }
}

class Super {
  constructor(classObj, instance) {
    this.classObj = classObj;
    this.instance = instance;
  }
  evaluate() {
    return this;
  }
  // Super is used in order to get a superclass's method
  getAttribute(name) {
    // Single inheritance is allowed only
    let currentClassObj = this.instance.selfClass;
    for (;;) {
      if (!currentClassObj) {
        // This exception will be caught by outer catch phrase
        throw new SuperCallFailedError("", this.classObj.name, name);
      }
      if (this.classObj !== currentClassObj) {
        currentClassObj = currentClassObj.superclass;
        continue;
      } else {
        const superclass = currentClassObj.superclass;
        if (!superclass) {
          // This exception will be caught by outer catch phrase
          throw new SuperCallFailedError("", this.classObj.name, name);
        }
        const funcObj = superclass.getAttribute(name);
        if (!funcObj || !(funcObj instanceof FuncObj)) {
          // This exception will be caught by outer catch phrase
          throw new SuperCallFailedError("", this.classObj.name, name);
        }
        return new MethodObj(this.instance, funcObj);
      }
    }
  }
  setAttribute() {
    return false;
  }
  get description() {
    return (
      `<super of ${this.classObj.name} on ` + `${this.instance.description}>`
    );
  }
  get selfClass() {
    return builtin.type.super;
  }
}

class UnaryOperation {
  constructor(operator, operand) {
    this.operator = operator;
    this.operand = operand;

    const table = {};

    table[Calcium.Keyword.NOT] = (operand) => !operand;
    table[Calcium.Keyword.NEGATIVE] = (operand) => -operand;
    table[Calcium.Keyword.BITWISE_NOT] = (operand) => ~operand;

    this.table = table;
  }
  debugOperate(env) {
    const operandValue = env.debugEvaluate(this.operand);
    const operatorFunction = this.table[this.operator];
    try {
      return operatorFunction(operandValue);
    } catch {
      throw new InvalidOperationError();
    }
  }
  operate(env) {
    const operandValue = env.evaluate(this.operand);
    const operatorFunction = this.table[this.operator];
    try {
      return operatorFunction(operandValue);
    } catch (e) {
      const error = new InvalidOperationError();
      env.raiseException(error.name, [this.operator]);
      return null;
    }
  }
  get description() {
    if (this.operator === Calcium.Keyword.NEGATIVE) {
      return "-" + wrapDescriptionByParen(this.operand);
    } else if (this.operator === Calcium.Keyword.NOT) {
      return "not " + wrapDescriptionByParen(this.operand);
    } else {
      return this.operator + wrapDescriptionByParen(this.operand);
    }
  }
}

class Variable {
  constructor(name) {
    this.name = name;
  }
  assign(obj, env) {
    env.register(this.name, obj);
  }
  debugEvaluate(env) {
    return env.debugLookUp(this.name);
  }
  evaluate(env) {
    return env.lookUp(this.name);
  }
  get description() {
    return this.name;
  }
}

// returns representation for print()
function describe(obj) {
  if (
    typeof obj === "number" ||
    typeof obj === "string" ||
    obj instanceof String
  ) {
    return obj.toString();
  } else if (obj instanceof Array) {
    const desc = [];
    for (let elem of obj) {
      if (elem === obj) {
        desc.push("[...]");
      } else {
        if (typeof elem === "string" || elem instanceof String) {
          desc.push(`'${elem}'`);
        } else {
          desc.push(describe(elem));
        }
      }
    }
    return `[${desc.join(", ")}]`;
  } else if (
    obj instanceof Variable ||
    obj instanceof Attribute ||
    obj instanceof Subscript ||
    obj instanceof BinaryOperation ||
    obj instanceof UnaryOperation ||
    obj instanceof Instance ||
    obj instanceof ClassObj ||
    obj instanceof Super ||
    obj instanceof FuncObj ||
    obj instanceof MethodObj ||
    obj instanceof BuiltinFuncObj ||
    obj instanceof Module
  ) {
    return obj.description;
  } else if (obj === null) {
    return "None";
  } else if (obj === true) {
    return "True";
  } else if (obj === false) {
    return "False";
  } else if (obj instanceof Object) {
    const desc = []; // use join() later
    for (let key in obj) {
      let kvStr = `'${key}': `;
      let value = obj[key];
      if (value === obj) {
        kvStr = kvStr + "{...}";
      } else {
        if (typeof value === "string" || value instanceof String) {
          kvStr = `${kvStr}'${value}'`;
        } else {
          kvStr = kvStr + describe(value);
        }
      }
      desc.push(kvStr);
    }
    return `{${desc.join(", ")}}`;
  }
}

// convert a Javascript error class to a Calcium exception class
// and register to globals
function registerExceptionClass(jsErrorClass, env) {
  const jsErrorObj = new jsErrorClass(); // index is not used
  // an exception has the same name to a Javascript error class.
  const exceptionClassObj = new ClassObj(
    jsErrorObj.name,
    builtin.type.exception,
    {}
  );
  // used in the internal when an exception raised but not handled
  exceptionClassObj.jsClass = jsErrorClass;
  env.builtin.register(exceptionClassObj.name, exceptionClassObj);
}

function wrapDescriptionByParen(obj) {
  if (obj instanceof BinaryOperation || obj instanceof UnaryOperation) {
    return `(${describe(obj)})`;
  } else {
    return describe(obj);
  }
}

function wrapString(obj) {
  if (typeof obj === "string" || obj instanceof String) {
    return `'${obj}'`;
  } else {
    return obj;
  }
}

// represents the kind of block
Calcium.BlockKind = {
  IFS: 0,
  IF_ELIF_ELSE: 1,
  FOR_RANGE: 2,
  FOR_EACH: 3,
  WHILE: 4,
  CALL: 5,
  CLASS_DEF: 6,
  TRY: 7,
  EXCEPT: 8,
};

// a public object used to make built-ins
const builtin = {
  type: {},
  name: {},
};

// built-in names
builtin.name.DICT = "dict";
builtin.name.EXCEPTION = "Exception";
builtin.name.HASATTR = "hasattr";
builtin.name.INIT = "__init__";
builtin.name.INT = "int";
builtin.name.ISINSTANCE = "isinstance";
builtin.name.ISSUBCLASS = "issubclass";
builtin.name.LEN = "len";
builtin.name.LIST = "list";
builtin.name.PRINT = "print";
builtin.name.STR = "str";
builtin.name.SUPER = "super";

// built-in types
builtin.type.object = new ClassObj("object", null);

builtin.type.builtin_function_or_method = new ClassObj(
  "builtin_function_or_method",
  builtin.type.object
);

const _attributesOfException = {}; // used by built-in Exception class

// __init__ method of Exception class
_attributesOfException[builtin.name.INIT] = new BuiltinFuncObj(
  builtin.name.INIT,
  (args, env) => {
    const self = env.evaluate(args[0]);
    self.attributes.index = env.evaluate(args[1]);
    self.attributes.message = env.evaluate(args[2]);
    return null;
  }
);

builtin.type.exception = new ClassObj(
  builtin.name.EXCEPTION,
  builtin.type.object,
  _attributesOfException
);

builtin.type.function = new ClassObj("function", builtin.type.object);

builtin.type.instance_method = new ClassObj(
  "instancemethod",
  builtin.type.object
);

builtin.type.module = new ClassObj("module", builtin.type.object);

builtin.type.super = new ClassObj("super", builtin.type.object);

// publish
Calcium.Expression = {
  Variable,
  Attribute,
  Subscript,
  BinaryOperation,
  UnaryOperation,
};

// built-in methods' name which may be aliased
const methodNames = {
  __init__: {},
  append: {},
  find: {},
  insert: {},
  isdigit: {},
  keys: {},
  pop: {},
  replace: {},
  split: {},
};

// commands
class Assignment {
  constructor(lhs, rhs) {
    this.lhs = lhs;
    this.rhs = rhs;
  }
  execute(env) {
    const value = env.evaluate(this.rhs);
    this.lhs.assign(value, env);
  }
}

class Break {
  constructor() {}
  execute(env) {
    for (;;) {
      let block = env.popBlock();
      if (
        block.kind === Calcium.BlockKind.IFS ||
        block.kind === Calcium.BlockKind.IF_ELIF_ELSE ||
        block.kind === Calcium.BlockKind.TRY ||
        block.kind === Calcium.BlockKind.EXCEPT
      ) {
        env.shiftIndent(-1);
        continue;
      } else if (
        block.kind === Calcium.BlockKind.WHILE ||
        block.kind === Calcium.BlockKind.FOR_RANGE ||
        block.kind === Calcium.BlockKind.FOR_EACH
      ) {
        env.shiftIndent(-1);
        break;
      } else {
        // CALL, CLASS_DEF, etc.
        const error = new InvalidBreakError();
        env.raiseException(error.name);
        return null;
      }
    }
  }
}

class Call {
  constructor(lhs, funcRef, args) {
    this.lhs = lhs;
    this.funcRef = funcRef;
    this.args = args;
  }
  execute(env) {
    const calledObj = env.evaluate(this.funcRef);
    if (calledObj instanceof FuncObj || calledObj instanceof MethodObj) {
      invoke(calledObj, this.args, this.lhs, env);
    } else if (calledObj instanceof BuiltinFuncObj) {
      const returnedValue = calledObj.body(this.args, env);
      if (this.lhs !== null) {
        this.lhs.assign(returnedValue, env);
      }
    } else if (calledObj instanceof BuiltinMethodObj) {
      this.args.unshift(calledObj.instance);
      const returnedValue = calledObj.funcObj.body(this.args, env);
      if (this.lhs !== null) {
        this.lhs.assign(returnedValue, env);
      }
    } else if (calledObj instanceof ClassObj) {
      const instance = new Instance(calledObj);
      try {
        let init = instance.getAttribute(builtin.name.INIT);
        invoke(init, this.args, this.lhs, env);
      } catch (e) {
        for (let alternativeInitName in methodNames[builtin.name.INIT]) {
          let init = instance.getAttribute(alternativeInitName);
          if (init) {
            // execute as __init__
            init.funcObj.name = builtin.name.INIT;
            invoke(init, this.args, this.lhs, env);
            return;
          }
        }
        // __init__ was not found.
        this.lhs.assign(instance, env);
        return; // Successful
      }
    } else {
      const error = new CannotInvokeFunctionError();
      env.raiseException(error.name);
      return null;
    }
  }
}

class ClassDef {
  constructor(className, superclassName) {
    this.className = className;
    this.superclassName = superclassName;
  }
  execute(env) {
    let superclass;
    if (
      this.superclassName === null ||
      this.superclassName === builtin.type.object.name
    ) {
      superclass = builtin.type.object;
    } else {
      superclass = env.lookUp(this.superclassName);
      if (env.hasException) return;
      if (!(superclass instanceof ClassObj)) {
        const error = new SuperclassNotValidError();
        env.raiseException(error.name, [this.superclassName]);
        return null;
      }
    }
    const begin = (env) => {
      const nestingScope = env.searchNestingScope();
      const newContext = new ClassScope(nestingScope);
      env.switchContext(newContext);
      return true;
    };
    const currentContext = env.context;
    const className = this.className;
    const end = (env) => {
      // context must be ClassScope.
      const attributes = env.context.attributes;
      // Switch to the context in which this ClassDef was executed.
      env.switchContext(currentContext);
      const classObj = new ClassObj(className, superclass, attributes);
      env.register(classObj.name, classObj);
      env.shiftIndent(-1);
    };
    const block = new Block(
      Calcium.BlockKind.CLASS_DEF,
      env.address,
      begin,
      end
    );
    env.beginBlock(block);
  }
}

class Comment {
  constructor(options) {
    this.options = options;
  }
  execute() {
    /* Do nothing. */
  }
}

class Continue {
  constructor() {}
  execute(env) {
    for (;;) {
      let block = env.popBlock();
      if (
        block.kind === Calcium.BlockKind.WHILE ||
        block.kind === Calcium.BlockKind.FOR_RANGE ||
        block.kind === Calcium.BlockKind.FOR_EACH
      ) {
        env.beginBlock(block);
        break;
      } else if (
        block.kind === Calcium.BlockKind.IFS ||
        block.kind === Calcium.BlockKind.IF_ELIF_ELSE ||
        block.kind === Calcium.BlockKind.TRY ||
        block.kind === Calcium.BlockKind.EXCEPT
      ) {
        env.shiftIndent(-1);
        continue;
      } else {
        const error = new InvalidContinueError();
        env.raiseException(error.name);
        return null;
      }
    }
  }
}

class Elif {
  constructor(condition) {
    this.condition = condition;
  }
  execute(env) {
    const isSatisfied = env.evaluate(this.condition);
    if (isSatisfied) {
      executeConditionalBlock(env);
    }
  }
}

class Else {
  constructor() {}
  execute(env) {
    executeConditionalBlock(env);
  }
}

class EndOfCode {
  constructor() {}
  execute(env) {
    if (env.hasException) {
      const error = new ExceptionNotHandledError(
        "Exception was not handled(" +
          env.exception.attributes.index +
          "): " +
          env.exception.selfClass.name
      );
      error.exception = env.exception;
      throw error;
    }
  }
}

class Except {
  constructor(typeName, objName) {
    this.typeName = typeName;
    this.objName = objName;
  }
  execute(env) {
    // It is already confirmed that this block is executed.
    const self = this;
    const begin = (env) => {
      if (!env.hasException) return false;
      env.register(self.objName, env.exception);
      // Clear handled exception.
      env.exception = null;
      return true;
    };
    const end = (env) => env.shiftIndent(-1);
    const block = new Block(Calcium.BlockKind.EXCEPT, env.address, begin, end);
    env.beginBlock(block);
  }
}

class ForEach {
  constructor(elementName, iterable) {
    this.elementName = elementName;
    this.iterable = iterable;
  }
  execute(env) {
    let iterableObj = env.evaluate(this.iterable);
    if (typeof iterableObj === "string") {
      iterableObj = new String(iterableObj);
    }
    if (
      !(
        iterableObj instanceof Array ||
        iterableObj instanceof String ||
        (typeof iterableObj === "object" &&
          !(
            iterableObj instanceof Instance ||
            iterableObj instanceof ClassObj ||
            iterableObj instanceof FuncObj ||
            iterableObj instanceof MethodObj ||
            iterableObj instanceof Super ||
            iterableObj instanceof BuiltinFuncObj ||
            iterableObj instanceof Module
          ) &&
          iterableObj)
      )
    ) {
      const error = new ObjectNotIterableError();
      env.raiseException(error.name);
      return;
    }
    let begin;
    if (iterableObj instanceof Array || iterableObj instanceof String) {
      const loopCounter = new LoopCounter(0, iterableObj.length, 1);
      const elementName = this.elementName;
      begin = (env) => {
        const nextIndex = loopCounter.next();
        if (nextIndex !== null) {
          env.register(elementName, iterableObj[nextIndex]);
          return true;
        } else {
          return false;
        }
      };
    } else {
      const keys = Object.keys(iterableObj);
      const loopCounter = new LoopCounter(0, keys.length, 1);
      const elementName = this.elementName;
      begin = (env) => {
        const nextIndex = loopCounter.next();
        if (nextIndex !== null) {
          env.register(elementName, iterableObj[keys[nextIndex]]);
          return true;
        } else {
          return false;
        }
      };
    }
    const end = () => {
      /* Do nothing */
    };
    const block = new Block(
      Calcium.BlockKind.FOR_EACH,
      env.address,
      begin,
      end
    );
    env.beginBlock(block);
  }
}

class ForRange {
  constructor(varName, start, stop, step) {
    this.varName = varName;
    this.start = start;
    this.stop = stop;
    this.step = step;
  }
  execute(env) {
    let loopCounter;
    const stopValue = env.evaluate(this.stop);
    if (this.start === null && this.step === null) {
      // e.g. for i in range(10):
      loopCounter = new LoopCounter(0, stopValue, 1);
    } else if (this.start !== null && this.step === null) {
      // e.g. for i in range(3, 7):
      const startValue = env.evaluate(this.start);
      loopCounter = new LoopCounter(startValue, stopValue, 1);
    } else {
      // e.g. for i in range(2, 20, 2):
      const startValue = env.evaluate(this.start);
      const stepValue = env.evaluate(this.step);
      loopCounter = new LoopCounter(startValue, stopValue, stepValue);
    }
    const varName = this.varName;
    const begin = (env) => {
      const nextValue = loopCounter.next();
      if (nextValue !== null) {
        env.register(varName, nextValue);
        return true;
      } else {
        return false;
      }
    };
    const end = () => {};
    const block = new Block(
      Calcium.BlockKind.FOR_RANGE,
      env.address,
      begin,
      end
    );
    env.beginBlock(block);
  }
}

class FuncDef {
  constructor(name, params) {
    this.name = name;
    this.params = params; // An array of params' name.
  }
  execute(env) {
    const definedAddress = env.address;
    // When currently in a ClassDef block,
    // the context that this function will be
    // executed is nesting scope of the class scope.
    // This behavior is identical to Python.
    const nestingScope = env.searchNestingScope();
    const funcObj = new FuncObj(
      this.name,
      this.params,
      nestingScope,
      definedAddress
    );
    env.register(this.name, funcObj);
  }
}

class If {
  constructor(condition) {
    this.condition = condition;
  }
  execute(env) {
    const isSatisfied = env.evaluate(this.condition);
    if (isSatisfied) {
      executeConditionalBlock(env);
    }
  }
}

class Ifs {
  constructor() {}
  execute(env) {
    const begin = () => true;
    const end = (env) => env.shiftIndent(-1);
    const block = new Block(Calcium.BlockKind.IFS, env.address, begin, end);
    env.beginBlock(block);
  }
}

class Import {
  constructor(moduleName) {
    this.moduleName = moduleName;
  }
  execute(env) {
    const moduleObj = env.lookUp(this.moduleName);
    if (moduleObj instanceof Module) {
      moduleObj.isImported = true;
    }
  }
}

class Pass {
  constructor() {}
  execute() {
    /* Do nothing. */
  }
}

class Raise {
  constructor(exceptionName, args) {
    this.exceptionName = exceptionName;
    this.args = args;
  }
  execute(env) {
    env.raiseException(this.exceptionName, this.args);
  }
}

class Return {
  constructor(expression) {
    this.expression = expression;
  }
  execute(env) {
    env.returnedValue = env.evaluate(this.expression);
    for (;;) {
      try {
        let block = env.popBlock();
        switch (block.kind) {
          case Calcium.BlockKind.CALL:
            block.end(env);
            return;
          case Calcium.BlockKind.IFS:
          case Calcium.BlockKind.IF_ELIF_ELSE:
          case Calcium.BlockKind.WHILE:
          case Calcium.BlockKind.TRY:
          case Calcium.BlockKind.EXCEPT:
          case Calcium.BlockKind.FOR_RANGE:
          case Calcium.BlockKind.FOR_EACH:
            continue;
          default:
            throw new Error();
        }
      } catch (e) {
        const error = new InvalidReturnError();
        env.raiseException(error.name);
        return null;
      }
    }
  }
}

class Try {
  constructor() {}
  execute(env) {
    const begin = () => true;
    const end = (env) => env.shiftIndent(-1);
    const block = new Block(Calcium.BlockKind.TRY, env.address, begin, end);
    env.beginBlock(block);
  }
}

class While {
  constructor(condition) {
    this.condition = condition;
  }
  execute(env) {
    const conditionExpr = this.condition;
    const begin = (env) => {
      const conditionValue = env.evaluate(conditionExpr);
      if (conditionValue) {
        return true;
      } else {
        return false;
      }
    };
    const end = () => {};
    const block = new Block(Calcium.BlockKind.WHILE, env.address, begin, end);
    env.beginBlock(block);
  }
}

function convertFullWidthNumbers(str) {
  return (
    str.replace(/１/g, '1')
    .replace(/２/g, '2')
    .replace(/３/g, '3')
    .replace(/４/g, '4')
    .replace(/５/g, '5')
    .replace(/６/g, '6')
    .replace(/７/g, '7')
    .replace(/８/g, '8')
    .replace(/９/g, '9')
    .replace(/０/g, '0')
  );
}

function executeConditionalBlock(env) {
  const begin = () => true;
  const end = (env) => {
    env.shiftIndent(-2); // Same indent as Ifs command.
    env.popBlock(); // Pop Ifs block.
  };
  const block = new Block(
    Calcium.BlockKind.IF_ELIF_ELSE,
    env.address,
    begin,
    end
  );
  env.beginBlock(block);
}

function invoke(calledObj, args, lhs, env) {
  let funcObj = calledObj;
  let getReturnedValue = (env) => env.returnedValue;
  if (calledObj instanceof MethodObj) {
    funcObj = calledObj.funcObj;
    if (funcObj.name === builtin.name.INIT) {
      getReturnedValue = () => calledObj.instance;
    }
    args.unshift(calledObj.instance); // Insert self
  }
  // Store the address to return
  const callerAddress = env.address.clone();
  const argsDict = {};
  for (let i = 0; i < args.length; ++i) {
    let paramName = funcObj.params[i];
    let argValue = env.evaluate(args[i]);
    argsDict[paramName] = argValue;
  }
  const newContext = new FuncScope(funcObj.nestingScope, argsDict);
  env.pushCallStack(newContext);

  const begin = () => true;
  const end = (env) => {
    env.popCallStack();
    if (lhs !== null) {
      lhs.assign(getReturnedValue(env), env);
    }
    env.returnedValue = null;
    env.jumpTo(callerAddress);
  };

  const block = new Block(Calcium.BlockKind.CALL, funcObj.address, begin, end);
  env.beginBlock(block);
}

// control a loop
class LoopCounter {
  constructor(start, stop, step) {
    this.start = start;
    this.stop = stop;
    this.step = step;
    this.now = null;
  }
  next() {
    if (
      (this.step > 0 && this.start >= this.stop) ||
      (this.step < 0 && this.start <= this.stop)
    ) {
      return null;
    } else if (this.now === null) {
      this.now = this.start;
      return this.start;
    } else {
      this.now += this.step;
      if (this.step > 0) {
        return this.now >= this.stop ? null : this.now;
      } else if (this.step < 0) {
        return this.now <= this.stop ? null : this.now;
      } else {
        return null;
      }
    }
  }
}

// error classes
class AttributeNotExistError extends Error {
  constructor(message, index, attrName) {
    super(message);
    this.index = index;
    this.attrName = attrName;
    this.name = "AttributeNotExistError";
  }
}

class CannotAccessAttributeError extends Error {
  constructor(message, index, attrName) {
    super(message);
    this.index = index;
    this.attrName = attrName;
    this.name = "CannotAccessAttributeError";
  }
}

class CannotApplySubscriptError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "CannotApplySubscriptError";
  }
}

class CannotInvokeFunctionError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "CannotInvokeFunctionError";
  }
}

class CannotParseAsIntError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "CannotParseAsIntError";
  }
}

class CannotPopFromListError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "CannotPopFromListError";
  }
}

class ExceptionNotHandledError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "ExceptionNotHandledError";
  }
}

class InconsistentBlockError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "InconsistentBlockError";
  }
}

class InvalidArgumentsForSuperError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "InvalidArgumentsForSuperError";
  }
}

class InvalidBreakError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "InvalidBreakError";
  }
}

class InvalidContinueError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "InvalidContinueError";
  }
}

class InvalidExceptionError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "InvalidExceptionError";
  }
}

class InvalidOperationError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "InvalidOperationError";
  }
}

class InvalidReturnError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "InvalidReturnError";
  }
}

class ModuleNotImportedError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "ModuleNotImportedError";
  }
}

class NameNotFoundError extends Error {
  constructor(message, index, varName) {
    super(message);
    this.index = index;
    this.varName = varName;
    this.name = "NameNotFoundError";
  }
}

class ObjectNotIterableError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "ObjectNotIterableError";
  }
}

class SubscriptNotAllowedError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "SubscriptNotAllowedError";
  }
}

class SuperCallFailedError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "SuperCallFailedError";
  }
}

class SuperclassNotValidError extends Error {
  constructor(message, index) {
    super(message);
    this.index = index;
    this.name = "SuperclassNotValidError";
  }
}

class ValueNotFoundError extends Error {
  constructor(message, index, key) {
    super(message);
    this.index = index;
    this.key = key;
    this.name = "ValueNotFoundError";
  }
}

Calcium.Error = {
  AttributeNotExistError,
  CannotAccessAttributeError,
  CannotApplySubscriptError,
  CannotInvokeFunctionError,
  CannotParseAsIntError,
  CannotPopFromListError,
  ExceptionNotHandledError,
  InconsistentBlockError,
  InvalidArgumentsForSuperError,
  InvalidBreakError,
  InvalidContinueError,
  InvalidExceptionError,
  InvalidOperationError,
  InvalidReturnError,
  ModuleNotImportedError,
  NameNotFoundError,
  ObjectNotIterableError,
  SubscriptNotAllowedError,
  SuperCallFailedError,
  SuperclassNotValidError,
  ValueNotFoundError,
};

module.exports = Calcium;
