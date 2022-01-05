import Command from "./command";
import Environment from "../runtime/environment";
import { InternalType } from "../type";
import { object, type } from "../factory";
import { default as Sym } from "../symbol";
import { CannotInherit } from "../error";
import { Block, Kind, Result } from "../runtime/block";
import Namespace from "../runtime/namespace";
import createClassObj from "../factory/classObj";

export default class Class implements Command {
  constructor(
    public readonly name: string,
    public readonly superclassName?: string
  ) {}
  execute(env: Environment) {
    let superclass: InternalType;
    if (
      this.superclassName === undefined ||
      this.superclassName === Reflect.get(object, Sym.name)
    ) {
      superclass = object;
    } else {
      const obj = env.context.lookUp(this.name);
      if (obj && Reflect.get(obj, Sym.class) === type) {
        superclass = obj;
      } else {
        throw new CannotInherit(this.superclassName);
      }
    }
    const previousContext = env.context;
    const block = new Block(
      Kind.ClassDef,
      env.address,
      (env) => {
        const classScope = new Namespace(env.context.nestingScope, true);
        env.context = classScope;
        return true;
      },
      (env) => {
        const attributes = env.context;
        env.context = previousContext;
        const classObj = createClassObj({
          className: this.name,
          superclass,
          attributes,
        });
        env.context.register(this.name, classObj);
        env.address.shift(-1);
        return Result.Exited;
      }
    );
    block.enter(env);
  }
}
