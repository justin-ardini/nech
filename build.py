#!/usr/bin/python

input_path = 'src/'
output_path = 'www/script.js'

import re, os, sys, time

defaults = [
	'Object',
	'Array',
	'Function',
	'String',
	'Number',
	'Boolean',
	'Date',
	'RegExp',
	'Image',
	'XMLHttpRequest',
	'Float32Array'
]

class CompileError(Exception):
	def __init__(self, text):
		Exception.__init__(self, text)

class Source:
	def __init__(self, path):
		self.path = path
		self.name = os.path.basename(path)
		self.code = '// %s\n%s' % (self.name, open(path, 'r').read())

		# pick out x in every 'function x('
		self.definitions = re.findall(r'\bfunction (\w+)\(', self.code)

		# pick out y in every '__extends__(x, y);' and 'new y('
		self.dependencies = re.findall(r'\b__extends__\(\w+, (\w+)\);', self.code)
		self.dependencies += re.findall(r'new (\w+)\(', self.code)

		# anything with dependencies depends on __extends__
		if self.dependencies: self.dependencies.append('__extends__')

		# remove duplicates for pretty-printing
		self.dependencies = set(self.dependencies)

		# the browser environment defines some objects
		self.dependencies -= set(defaults)

def print_dependencies(sources):
	print 'definitions = {'
	for source in sources:
		if source.definitions:
			print '    %s => %s' % (source.name, ', '.join(source.definitions))
	print '}'
	print 'dependencies = {'
	for source in sources:
		if source.dependencies:
			print '    %s => %s' % (source.name, ', '.join(source.dependencies))
	print '}'

def sources():
	return [os.path.join(base, f) for base, folders, files in \
		os.walk(input_path) for f in files if f.endswith('.js')]

def compile(sources):
	sources = [Source(path) for path in sources]

	# check that all dependencies are defined in only one place
	for source in sources:
		for dependency in source.dependencies:
			definitions = [s.name for s in sources for d in s.definitions if d == dependency]
			if len(definitions) > 1:
				raise CompileError('%s is defined in %s' % (dependency, ' and '.join(definitions)))
			if len(definitions) < 1:
				raise CompileError('could not find dependency %s' % dependency)

	# map definitions => Source object
	lookup = {}
	for source in sources:
		for definition in source.definitions:
			lookup[definition] = source

	# order based on dependencies
	new_sources = []
	while len(sources) > 0:
		# find a source that doesn't need any other source in sources
		free_source = None
		for source in sources:
			if not any(d in s.definitions for s in sources for d in source.dependencies if s != source):
				free_source = source
				break

		# if we couldn't find a free source, then there is a circular dependency
		if free_source is None:
			raise CompileError('circular dependency between ' +
				' and '.join(source.name for source in sources))

		# add the free source to the new order
		new_sources.append(free_source)
		sources.remove(free_source)

	return '\n'.join(source.code for source in new_sources)

def build():
	try:
		data = '(function() {\n\n' + compile(sources()) + '\n})();\n'
		print 'built %s (%u lines)' % (output_path, len(data.split('\n')))
	except CompileError, e:
		print 'compile error:', str(e)
		error = str(e).replace('\\', '\\\\').replace('\n', '\\n').replace('"', '\\"')
		data = 'window.onload = function(){ alert("compile error: %s"); };' % error
	open(output_path, 'w').write(data)

def stat():
	return [os.stat(file).st_mtime for file in sources()]

def monitor():
	a = stat()
	while True:
		time.sleep(0.5)
		b = stat()
		if a != b:
			a = b
			build()

if __name__ == '__main__':
	build()
	if 'release' not in sys.argv:
		monitor()
