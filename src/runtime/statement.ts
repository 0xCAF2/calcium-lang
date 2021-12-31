import * as JSONElementType from "../parser/jsonElement";
import * as Kw from "../keyword";

/**
 * a JSON array that represents one line in Calcium
 */
type Statement = [number, unknown[], Kw.Command, ...JSONElementType.Any[]];

export default Statement;
