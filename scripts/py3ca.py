import sys
import ast
import json
import traceback

VERSION = '0.1.0'

PROPERTY_INDENT = 'indent'
PROPERTY_KEYWORD = 'keyword'
PROPERTY_KIND = 'kind'
PROPERTY_CONTAINER = 'container'
PROPERTY_INDEX_OR_KEY = 'indexOrKey'
PROPERTY_NAME = 'name'
PROPERTY_LHS = 'lhs'
PROPERTY_RHS = 'rhs'

KEYWORD_COMMENT = '#'
KEYWORD_VARIABLE = 'var'
KEYWORD_ATTRIBUTE = 'attr'
KEYWORD_SUBSCRIPT = 'sub'
KEYWORD_ASSIGNMENT = '='
KEYWORD_FOR_RANGE = 'forrange'
KEYWORD_FOR_EACH = 'foreach'
KEYWORD_WHILE = 'while'
KEYWORD_BREAK = 'break'
KEYWORD_CONTINUE = 'continue'
KEYWORD_IF = 'if'
KEYWORD_IFS = 'ifs'
KEYWORD_ELIF = 'elif'
KEYWORD_ELSE = 'else'
KEYWORD_CALL = 'call'
KEYWORD_RETURN = 'return'
KEYWORD_FUNC_DEF = 'def'
KEYWORD_CLASS_DEF = 'class'
KEYWORD_TRY = 'try'
KEYWORD_EXCEPT = 'except'
KEYWORD_RAISE = 'raise'
KEYWORD_END_OF_CODE = 'end'
KEYWORD_PASS = 'pass'

OBJECT_TYPE_NAME = 'object'

class Py3CaVisitor(ast.NodeVisitor):
    def __init__(self, indent_spaces='  '):
        super().__init__()
        self.lines = []
        self.indents = []
        self.keyword = KEYWORD_COMMENT
        self.count_of_nested_if = 0
        self.indent_spaces = indent_spaces
        self.indent_offset = len(indent_spaces)
    
    def get_indent(self, node):
        return node.col_offset // self.indent_offset \
            + 1 + self.count_of_nested_if
    
    def output_command(self, indent, keyword, elements={}):
        self.indents.append(indent)
        line = {
            PROPERTY_INDENT: indent,
            PROPERTY_KEYWORD: keyword,
        }
        line.update(elements)
        self.lines.append(json.JSONEncoder(ensure_ascii=False).encode(line))

    def output_first_line(self):
        self.output_command(1, KEYWORD_COMMENT, {'version': VERSION})
    
    def output_end_of_code(self):
        self.output_command(1, KEYWORD_END_OF_CODE)
    
    def output_node(self, node, keyword, elements={}):
        indent = self.get_indent(node)
        self.output_command(indent, keyword, elements)
    
    def output_call(self, node, indent, lhs=None):
        assert isinstance(node, ast.Call), \
            'Not call node: line {}'.format(node.lineno)
        elems = []
        if lhs is not None:
            elems.append(self.visit(lhs))
        else:
            elems.append(None)
        # self.get_call returns a tuple.
        func_ref, args = self.get_call(node)
        elems.append(func_ref)
        elems.append(args)
        self.output_command(indent, KEYWORD_CALL, elems)
    
    def get_call(self, node):
        return self.visit(node.func), \
            self.get_arguments(node.args)
    
    def get_arguments(self, args):
        return [self.visit(arg) for arg in args]
    
    def output_for_range(self, node):
        elems = [
            node.target.id,
            [self.visit(arg) for arg in node.iter.args]
        ]
        self.output_node(node, KEYWORD_FOR_RANGE, elems)
    
    def output_for_each(self, node):
        elems = [
            node.target.id,
            self.visit(node.iter)
        ]
        self.output_node(node, KEYWORD_FOR_EACH, elems)
    
    def output_elif_or_else(self, node, indent):
        if hasattr(node.orelse[0], 'test') and \
            node.orelse[0].col_offset == \
            node.col_offset + self.indent_offset:
            # eg.
            # else:
            #     if condition:
            self.output_command(indent, KEYWORD_ELSE)
            for stmt in node.orelse:
                self.visit(stmt)
        elif hasattr(node.orelse[0], 'test'):
            self.output_elif(node.orelse[0], indent)
        else:
            self.output_command(indent, KEYWORD_ELSE)
            for stmt in node.orelse:
                self.visit(stmt)
    
    def output_elif(self, node, indent):
        # Should not call output_node()
        self.output_command(
            indent,
            KEYWORD_ELIF,
            [self.visit(node.test)]
        )
        for stmt in node.body:
            self.visit(stmt)
        if len(node.orelse) != 0:
            self.output_elif_or_else(node, indent)
    
    def get_bin_op(self, node, op, left, right):
        return [
            self.get_operator(op),
            self.visit(left),
            self.visit(right)
        ]
    
    def get_operator(self, op):
        if isinstance(op, ast.Add):
            return '+'
        elif isinstance(op, ast.Sub):
            return '-'
        elif isinstance(op, ast.Mult):
            return '*'
        elif isinstance(op, ast.Pow):
            return '**'
        elif isinstance(op, ast.Div):
            return '/'
        elif isinstance(op, ast.FloorDiv):
            return '//'
        elif isinstance(op, ast.Mod):
            return '%'
        elif isinstance(op, ast.BitAnd):
            return '&'
        elif isinstance(op, ast.BitOr):
            return '|'
        elif isinstance(op, ast.BitXor):
            return '^'
        elif isinstance(op, ast.LShift):
            return '<<'
        elif isinstance(op, ast.RShift):
            return '>>'
        elif isinstance(op, ast.And):
            return 'and'
        elif isinstance(op, ast.Or):
            return 'or'
        elif isinstance(op, ast.Eq):
            return '=='
        elif isinstance(op, ast.NotEq):
            return '!='
        elif isinstance(op, ast.Lt):
            return '<'
        elif isinstance(op, ast.LtE):
            return '<='
        elif isinstance(op, ast.Gt):
            return '>'
        elif isinstance(op, ast.GtE):
            return '>='
        elif isinstance(op, ast.Is):
            return 'is'
        elif isinstance(op, ast.IsNot):
            return 'is not'
        elif isinstance(op, ast.In):
            return 'in'
        elif isinstance(op, ast.NotIn):
            return 'not in'
    
    # Visit
    def visit_Module(self, node):
        self.output_first_line()
        for stmt in node.body:
            self.visit(stmt)
        self.output_end_of_code()
    
    def visit_FunctionDef(self, node):
        elems = [
            node.name,
            [arg.arg for arg in node.args.args]
        ]
        self.output_node(node, KEYWORD_FUNC_DEF, elems)
        for stmt in node.body:
            self.visit(stmt)
    
    def visit_ClassDef(self, node):
        elems = [node.name]
        if len(node.bases) > 0:
            elems.append(node.bases[0].id)
        else:
            elems.append(OBJECT_TYPE_NAME)
        self.output_node(node, KEYWORD_CLASS_DEF, elems)
        for stmt in node.body:
            self.visit(stmt)
    
    def visit_Assign(self, node):
        assert len(node.targets) == 1, \
            'invalid lhs: line {}'.format(node.lineno)
        elems = {}
        if isinstance(node.value, ast.Call):
            self.output_call(
                node.value,
                self.get_indent(node),
                node.targets[0]
            )
        else:
            elems[PROPERTY_LHS] = self.visit(node.targets[0])
            elems[PROPERTY_RHS] = self.visit(node.value)
            self.output_node(node, KEYWORD_ASSIGNMENT, elems)

    def visit_AugAssign(self, node):
        if isinstance(node.op, ast.Add):
            keyword = '+='
        elif isinstance(node.op, ast.Sub):
            keyword = '-='
        elif isinstance(node.op, ast.Mult):
            keyword = '*='
        elems = [
            self.visit(node.target),
            self.visit(node.value)
        ]
        self.output_node(node, keyword, elems)
    
    def visit_Tuple(self, node):
        return [self.visit(e) for e in node.elts]
    
    def visit_For(self, node):
        if isinstance(node.iter, ast.Call):
            self.output_for_range(node)
        else:
            self.output_for_each(node)
        for stmt in node.body:
            self.visit(stmt)
    
    def visit_While(self, node):
        elems = [self.visit(node.test)]
        self.output_node(node, KEYWORD_WHILE, elems)
        for stmt in node.body:
            self.visit(stmt)
    
    def visit_If(self, node):
        self.output_node(node, KEYWORD_IFS)
        self.count_of_nested_if += 1
        self.output_node(node, KEYWORD_IF, [self.visit(node.test)])
        for stmt in node.body:
            self.visit(stmt)
        if len(node.orelse) != 0:
            indent = self.get_indent(node)
            self.output_elif_or_else(node, indent)
        self.count_of_nested_if -= 1
    
    def visit_Pass(self, node):
        self.output_command(self.get_indent(node), KEYWORD_PASS)
    
    def visit_Return(self, node):
        elems = []
        if hasattr(node, 'value'):
            if node.value is None:
                elems.append(None)
            else:
                elems.append(self.visit(node.value))
        else:
            elems.append(None)
        self.output_command(self.get_indent(node), KEYWORD_RETURN, elems)
    
    def visit_Break(self, node):
        self.output_command(self.get_indent(node), KEYWORD_BREAK)
    
    def visit_Continue(self, node):
        self.output_command(self.get_indent(node), KEYWORD_CONTINUE)
    
    def visit_Try(self, node):
        self.output_command(self.get_indent(node), KEYWORD_TRY)
        for stmt in node.body:
            self.visit(stmt)
        for ex in node.handlers:
            elems = []
            if ex.type != None:
                # Allowed one type only
                elems.append(ex.type.id)
            if ex.name != None:
                elems.append(ex.name)
            self.output_command(
                self.get_indent(ex),
                KEYWORD_EXCEPT,
                elems
            )
            for stmt in ex.body:
                self.visit(stmt)
    
    def visit_Raise(self, node):
        elems = []
        assert isinstance(node.exc, ast.Call)
        typename = node.exc.func.id
        elems.append(typename)
        elems.append(self.get_arguments(node.exc.args))
        self.output_command(self.get_indent(node), KEYWORD_RAISE, elems)
    
    def visit_Compare(self, node):
        return self.get_bin_op(
            node,
            node.ops[0],
            node.left,
            node.comparators[0]
        )
    
    def visit_BinOp(self, node):
        return self.get_bin_op(
            node,
            node.op,
            node.left,
            node.right
        )
    
    def visit_BoolOp(self, node):
        if isinstance(node.op, ast.And):
            op = 'and'
        else:
            op = 'or'
        elems = [
            op,
            self.visit(node.values[0]),
            self.visit(node.values[1])
        ]
        count = len(node.values)
        i = 2
        while i < count:
            elems = [
                op,
                elems,
                self.visit(node.values[i])
            ]
            i += 1
        return elems
    
    def visit_UnaryOp(self, node):
        elems = []
        if isinstance(node.op, ast.Not):
            keyword = 'not'
        elif isinstance(node.op, ast.USub):
            keyword = '-_'
            if isinstance(node.operand, ast.Num):
                # Return by a literal with - sign
                return -node.operand.n
        elif isinstance(node.op, ast.Invert):
            keyword = '~'
        # if keyword not exist, then error will be raised
        elems.append(keyword)
        elems.append(self.visit(node.operand))
        return elems
    
    def visit_List(self, node):
        return [self.visit(e) for e in node.elts]
    
    def visit_Dict(self, node):
        obj = {}
        for k, v in zip(node.keys, node.values):
            obj[self.visit(k)] = self.visit(v)
        return obj
    
    def visit_Num(self, node):
        return node.n
    
    def visit_Str(self, node):
        return node.s.replace('\n', '\\n')
    
    def visit_Name(self, node):
        return {
            PROPERTY_KIND: KEYWORD_VARIABLE,
            PROPERTY_NAME: node.id,
        }
    
    def visit_NameConstant(self, node):
        return node.value
    
    def visit_Attribute(self, node):
        attrs = [node.attr]
        childnode = node.value
        while isinstance(childnode, ast.Attribute):
            attrs.append(childnode.attr)
            childnode = childnode.value
        attrs.reverse()
        attrs.insert(0, childnode.id)
        attrs.insert(0, KEYWORD_ATTRIBUTE)
        return attrs
    
    def visit_Subscript(self, node):
        if isinstance(node.slice.value, ast.Num):
            index_or_key = node.slice.value.n
        elif isinstance(node.slice.value, ast.Str):
            index_or_key = node.slice.value.s
        else:
            index_or_key = self.visit(node.slice.value)
        value = self.visit(node.value)
        return {
            PROPERTY_KIND: KEYWORD_SUBSCRIPT,
            PROPERTY_CONTAINER: value,
            PROPERTY_INDEX_OR_KEY: index_or_key,
        }

    def visit_Expr(self, node):
        if isinstance(node.value, ast.Call):
            self.output_call(node.value, self.get_indent(node))
    
    def generic_visit(self, node):
        super().generic_visit(node)

def convert(src):
    try:
        module_node = ast.parse(src)
        visitor = Py3CaVisitor()
        visitor.visit(module_node)
        lines = []
        for indent, line in zip(visitor.indents, visitor.lines):
            lines.append('{}{}'.format('  ' * indent, line))
        code = (',\n').join(lines)
        return '[\n{}\n]\n'.format(code)
    except Exception:
        return traceback.format_exc()

if __name__ == '__main__':
    filename = sys.argv[1]
    with open(filename, encoding='utf-8') as fin:
        json_array = convert(fin.read())
        print(json_array)

