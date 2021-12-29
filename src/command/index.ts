import Environment from "../runtime/environment";
import Keyword from "../keyword";

import Comment from "./comment";

interface Command {
  execute(env: Environment): void;
}

export default Command;

export { Comment };
