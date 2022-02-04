import python2calcium
import os
import os.path

testpyfile_dir = "./testfile"
testts_dir = "../test"

testfiles = os.listdir(testpyfile_dir)

for filename in testfiles:
    if "." not in filename:
        continue
    filepath = os.path.join(testpyfile_dir, filename)
    with open(filepath) as fin:
        code = python2calcium.convert(fin.read())
        testpath = os.path.join(testts_dir, filename.replace(".py", ".spec.ts"))
        with open(testpath, "w") as fout:
            fout.write(
                """
import * as Calcium from "../src";

it("{}", () => {{
  const code = {} as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {{
    console.log(desc);
    expect(desc).toMatch('True\\n');
  }});
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
}});
""".format(
                    filename, code[:-1]
                )
            )
