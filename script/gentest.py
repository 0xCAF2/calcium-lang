import python2calcium
import os
import os.path

testfile_dirname = './testfile'
test_dirpath = '../test'

testfiles = os.listdir(testfile_dirname)

for filename in testfiles:
    filepath = os.path.join(testfile_dirname, filename)
    with open(filepath) as fin:
        code = python2calcium.convert(fin.read())
        testpath = os.path.join(
            test_dirpath, filename.replace('.py', '.spec.ts'))
        with open(testpath, 'w') as fout:
            fout.write('''
import * as Calcium from "../src";

it("{}", () => {{
  const code = {} as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {{
    console.log(desc);
  }});
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
}});
'''.format(filename, code[:-1]))
