import type { SourceFile } from './link'
import type { TestCase } from './types'

/**
 * Builds the Python program that runs an exercise's checks.
 *
 * Everything happens inside Pyodide and only a JSON string crosses back, which
 * avoids marshalling Python objects into JavaScript. The student's module is
 * imported from Pyodide's virtual filesystem, so several files that import
 * each other work the way they would on disk, with no specifier rewriting.
 */

/** Directory the student's files are written to inside Pyodide. */
export const EXERCISE_DIR = '/exercise'

/** Strips the extension so `solution.py` becomes the importable `solution`. */
export const moduleNameFor = (filename: string): string => filename.replace(/\.py$/, '').replace(/^\.?\//, '')

/** Python literal for a JavaScript string, safe for embedding in source. */
export const pyString = (value: string): string => JSON.stringify(value)

/**
 * The harness, as Python source.
 *
 * Each check runs with the student's module in scope, both as `module` and
 * with its public names unpacked, so a check can say `total(...)` or
 * `solution.total(...)`. An AssertionError is a failed check; anything else is
 * reported with its exception type, which is usually more useful.
 */
export const buildHarness = (entry: string, tests: TestCase[]): string => {
  const moduleName = moduleNameFor(entry)
  const checks = tests
    .map(test => `    {"name": ${pyString(test.name)}, "src": ${pyString(test.testFunction)}},`)
    .join('\n')

  return `
import sys, json, io, importlib, traceback

if ${pyString(EXERCISE_DIR)} not in sys.path:
    sys.path.insert(0, ${pyString(EXERCISE_DIR)})

_checks = [
${checks}
]

_buffer = io.StringIO()
_real_stdout, _real_stderr = sys.stdout, sys.stderr
sys.stdout = _buffer
sys.stderr = _buffer

_outcomes = []
_load_error = None

try:
    _module = importlib.import_module(${pyString(moduleName)})
    # Reload so a second run sees edited source rather than the cached module.
    _module = importlib.reload(_module)

    _scope = {"module": _module}
    _scope.update({k: v for k, v in vars(_module).items() if not k.startswith("__")})

    for _check in _checks:
        try:
            exec(_check["src"], dict(_scope))
            _outcomes.append({"name": _check["name"], "passed": True, "message": None})
        except AssertionError as _e:
            _outcomes.append({
                "name": _check["name"],
                "passed": False,
                "message": str(_e) or "Assertion failed",
            })
        except Exception as _e:
            _outcomes.append({
                "name": _check["name"],
                "passed": False,
                "message": f"{type(_e).__name__}: {_e}",
            })
except Exception as _e:
    _load_error = f"{type(_e).__name__}: {_e}"
finally:
    sys.stdout, sys.stderr = _real_stdout, _real_stderr

json.dumps({"outcomes": _outcomes, "loadError": _load_error, "stdout": _buffer.getvalue()})
`.trim()
}

export type HarnessResult = {
  outcomes: { name: string; passed: boolean; message: string | null }[]
  loadError: string | null
  stdout: string
}

/** A file the student wrote, ready to place in Pyodide's filesystem. */
export const filesToWrite = (files: SourceFile[]): { path: string; content: string }[] =>
  files.map(file => ({ path: `${EXERCISE_DIR}/${file.filename}`, content: file.content }))

/** True when this exercise should run through Pyodide rather than the Worker. */
export const isPython = (language: string | undefined): boolean => language === 'python'
