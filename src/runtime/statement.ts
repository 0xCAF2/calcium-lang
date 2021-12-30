import { Any } from "../parser/jsonElement";
import Keyword from "../keyword";

type Statement = [number, unknown[], Keyword.Command, ...Any[]];

export default Statement;
