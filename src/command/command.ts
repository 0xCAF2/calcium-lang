import Environment from "../runtime/environment";

/**
 * Each class that implements `Command` has own behaviors.
 */
export default interface Command {
  execute(env: Environment): void;
}
