# Logging

Logging is a crucial aspect of software development, especially when it comes to debugging and monitoring the behavior of your applications. In this section, we'll delve into Effect's logging utilities and explore their advantages over traditional methods like console.log.

## Advantages Over Traditional Logging

Effect's logging utilities offer several advantages over traditional logging methods like console.log:

1. Dynamic Log Level Control: With Effect's logging, you have the ability to change the log level dynamically. This means you can control which log messages get displayed based on their severity. For example, you can configure your application to log only warnings or errors, which can be extremely helpful in production environments to reduce noise.

2. Custom Logging Output: Effect's logging utilities allow you to change how logs are handled. You can direct log messages to various destinations, such as a service or a file, using a custom logger. This flexibility ensures that logs are stored and processed in a way that best suits your application's requirements.

3. Fine-Grained Logging: Effect enables fine-grained control over logging on a per-part basis of your program. You can set different log levels for different parts of your application, tailoring the level of detail to each specific component. This can be invaluable for debugging and troubleshooting, as you can focus on the information that matters most.

4. Environment-Based Logging: Effect's logging utilities can be combined with deployment environments to achieve granular logging strategies. For instance, during development, you might choose to log everything at a trace level and above for detailed debugging. In contrast, your production version could be configured to log only errors or critical issues, minimizing the impact on performance and noise in production logs.

5. Additional Features: Effect's logging utilities come with additional features such as the ability to measure time spans, alter log levels on a per-effect basis, and integrate spans for performance monitoring.

Now, let's dive into the specific logging utilities provided by Effect.

## log

The Effect.log function outputs a log message at the default INFO level.

```ts
import { Effect } from "effect"

const program = Effect.log("Application started")

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message="Application started"
_/
```

When you use the default logger with Effect.log, it incorporates several important details into each log entry:

* timestamp: The timestamp when the log message was generated.
* level: The log level at which the message is logged.
* fiber: The identifier of the fiber executing the program.
* message: The log content, which can include multiple items.
* span: (Optional) The duration of the span in milliseconds.

> For information on how to tailor the logging setup to meet specific needs, such as integrating a custom logging framework or adjusting log formats, please consult the section on customizing loggers

You can log multiple messages simultaneously:

```ts
import { Effect } from "effect"

const program = Effect.log("message1", "message2", "message3")

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message=message1 message=message2 message=message3
_/
```

For added context, you can also include one or more Cause instances in your logs, which provide detailed error information under an additional cause annotation:

```ts
import { Effect, Cause } from "effect"

const program = Effect.log(
"message1",
"message2",
Cause.die("Oh no!"),
Cause.die("Oh uh!")
)

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message=message1 message=message2 cause="Error: Oh no!
Error: Oh uh!"
_/
```

## Log Levels

### logDebug

By default, DEBUG messages are not printed.

However, you can configure the default logger to enable them using Logger.withMinimumLogLevel and setting the minimum log level to LogLevel.Debug.

Here's an example that demonstrates how to enable DEBUG messages for a specific task (task1):

```ts
// Using Effect.gen

import { Effect, Logger, LogLevel } from "effect"

const task1 = Effect.gen(function* () {
yield* Effect.sleep("2 seconds")
yield\* Effect.logDebug("task1 done")
}).pipe(Logger.withMinimumLogLevel(LogLevel.Debug))

const task2 = Effect.gen(function* () {
yield* Effect.sleep("1 second")
yield\* Effect.logDebug("task2 done")
})

const program = Effect.gen(function* () {
yield* Effect.log("start")
yield* task1
yield* task2
yield\* Effect.log("done")
})

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO message=start
timestamp=... level=DEBUG message="task1 done" <-- 2 seconds later
timestamp=... level=INFO message=done <-- 1 second later
_/
```

In the above example, we enable DEBUG messages specifically for task1 by using the Logger.withMinimumLogLevel function.

By using Logger.withMinimumLogLevel(effect, level), you have the flexibility to selectively enable different log levels for specific effects in your program. This allows you to control the level of detail in your logs and focus on the information that is most relevant to your debugging and troubleshooting needs.

### logInfo

By default, INFO messages are printed.

```ts
// Using Effect.gen

import { Effect } from "effect"

const program = Effect.gen(function* () {
yield* Effect.logInfo("start")
yield* Effect.sleep("2 seconds")
yield* Effect.sleep("1 second")
yield\* Effect.logInfo("done")
})

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO message=start
timestamp=... level=INFO message=done <-- 3 seconds later
_/
```

In the above example, the Effect.log function is used to log an INFO message with the content "start" and "done". These messages will be printed during the execution of the program.

### logWarning

By default, WARN messages are printed.

```ts
// Using Effect.gen

import { Effect, Either } from "effect"

const task = Effect.fail("Oh uh!").pipe(Effect.as(2))

const program = Effect.gen(function* () {
const failureOrSuccess = yield* Effect.either(task)
if (Either.isLeft(failureOrSuccess)) {
yield\* Effect.logWarning(failureOrSuccess.left)
return 0
} else {
return failureOrSuccess.right
}
})

Effect.runFork(program)
/_
Output:
timestamp=... level=WARN fiber=#0 message="Oh uh!"
_/
```

### logError

By default, ERROR messages are printed.

```ts
// Using Effect.gen

import { Effect, Either } from "effect"

const task = Effect.fail("Oh uh!").pipe(Effect.as(2))

const program = Effect.gen(function* () {
const failureOrSuccess = yield* Effect.either(task)
if (Either.isLeft(failureOrSuccess)) {
yield\* Effect.logError(failureOrSuccess.left)
return 0
} else {
return failureOrSuccess.right
}
})

Effect.runFork(program)
/_
Output:
timestamp=... level=ERROR fiber=#0 message="Oh uh!"
_/
```

### logFatal

By default, FATAL messages are printed.

```ts
// Using Effect.gen

import { Effect, Either } from "effect"

const task = Effect.fail("Oh uh!").pipe(Effect.as(2))

const program = Effect.gen(function* () {
const failureOrSuccess = yield* Effect.either(task)
if (Either.isLeft(failureOrSuccess)) {
yield\* Effect.logFatal(failureOrSuccess.left)
return 0
} else {
return failureOrSuccess.right
}
})

Effect.runFork(program)
/_
Output:
timestamp=... level=FATAL fiber=#0 message="Oh uh!"
_/
```

## Custom Annotations

Enhance your log outputs by incorporating custom annotations with the Effect.annotateLogs function. This function allows you to append additional metadata to each log entry of an effect, enhancing traceability and context.

Here's how to apply a single annotation as a key/value pair:

```ts
import { Effect } from "effect"

const program = Effect.gen(function* () {
yield* Effect.log("message1")
yield\* Effect.log("message2")
}).pipe(Effect.annotateLogs("key", "value")) // Annotation as key/value pair

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message=message1 key=value
timestamp=... level=INFO fiber=#0 message=message2 key=value
_/
```

To apply multiple annotations at once, you can pass an object containing several key/value pairs:

```ts
import { Effect } from "effect"

const program = Effect.gen(function* () {
yield* Effect.log("message1")
yield\* Effect.log("message2")
}).pipe(Effect.annotateLogs({ key1: "value1", key2: "value2" }))

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message=message1 key2=value2 key1=value1
timestamp=... level=INFO fiber=#0 message=message2 key2=value2 key1=value1
_/
```

Annotations can also be applied with a scoped lifetime using Effect.annotateLogsScoped. This method confines the application of annotations to logs within a specific Scope of your effect computation:

```ts
import { Effect } from "effect"

const program = Effect.gen(function* () {
yield* Effect.log("no annotations")
yield* Effect.annotateLogsScoped({ key: "value" })
yield* Effect.log("message1") // Annotation is applied to this log
yield\* Effect.log("message2") // Annotation is applied to this log
}).pipe(Effect.scoped, Effect.andThen(Effect.log("no annotations again")))

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message="no annotations"
timestamp=... level=INFO fiber=#0 message=message1 key=value
timestamp=... level=INFO fiber=#0 message=message2 key=value
timestamp=... level=INFO fiber=#0 message="no annotations again"
_/
```

## Log Spans

Effect also provides support for log spans, allowing you to measure the duration of specific operations or tasks within your program.

```ts
//Using Effect.gen

import { Effect } from "effect"

const program = Effect.gen(function* () {
yield* Effect.sleep("1 second")
yield\* Effect.log("The job is finished!")
}).pipe(Effect.withLogSpan("myspan"))

Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message="The job is finished!" myspan=1011ms
_/
```

In the above example, a log span is created using the Effect.withLogSpan(label) function. It measures the duration of the code block within the span. The resulting duration is then automatically recorded as an annotation within the log message.

## Disabling Default Logging

If you ever find yourself needing to turn off default logging, perhaps during test execution, there are various ways to achieve this within the Effect framework. In this section, we'll explore different methods to disable default logging.

### Using withMinimumLogLevel

Effect provides a convenient function called withMinimumLogLevel that allows you to set the minimum log level, effectively disabling logging:

```ts
import { Effect, Logger, LogLevel } from "effect"

const program = Effect.gen(function* () {
yield* Effect.log("Executing task...")
yield\* Effect.sleep("100 millis")
console.log("task done")
})

// Logging enabled (default)
Effect.runFork(program)
/_
Output:
timestamp=... level=INFO fiber=#0 message="Executing task..."
task done
_/

// Logging disabled using withMinimumLogLevel
Effect.runFork(program.pipe(Logger.withMinimumLogLevel(LogLevel.None)))
/_
Output:
task done
_/
```

By setting the log level to LogLevel.None, you effectively disable logging, and only the final result will be displayed.

### Using a Layer

Another approach to disable logging is by creating a layer that sets the minimum log level to LogLevel.None, effectively turning off all logging:

```ts
import { Effect, Logger, LogLevel } from "effect"

const program = Effect.gen(function* () {
yield* Effect.log("Executing task...")
yield\* Effect.sleep("100 millis")
console.log("task done")
})

const layer = Logger.minimumLogLevel(LogLevel.None)

// Logging disabled using a layer
Effect.runFork(program.pipe(Effect.provide(layer)))
/_
Output:
task done
_/
```

### Using a Custom Runtime

You can also disable logging by creating a custom runtime that includes the configuration to turn off logging:

```ts
import { Effect, Logger, LogLevel, ManagedRuntime } from "effect"

const program = Effect.gen(function* () {
yield* Effect.log("Executing task...")
yield\* Effect.sleep("100 millis")
console.log("task done")
})

const customRuntime = ManagedRuntime.make(
Logger.minimumLogLevel(LogLevel.None)
)

customRuntime.runPromise(program)
/_
Output:
task done
_/
```

In this approach, you create a custom runtime that incorporates the configuration to disable logging, and then you execute your program using this custom runtime.

## Loading the Log Level from Configuration

To retrieve the log level from a configuration and incorporate it into your program, utilize the layer produced by Logger.minimumLogLevel:

```ts
import {
Effect,
Config,
Logger,
Layer,
ConfigProvider,
LogLevel
} from "effect"

// Simulate a program with logs
const program = Effect.gen(function* () {
yield* Effect.logError("ERROR!")
yield* Effect.logWarning("WARNING!")
yield* Effect.logInfo("INFO!")
yield\* Effect.logDebug("DEBUG!")
})

// Load the log level from the configuration as a layer
const LogLevelLive = Config.logLevel("LOG_LEVEL").pipe(
Effect.andThen((level) => Logger.minimumLogLevel(level)),
Layer.unwrapEffect
)

// Configure the program with the loaded log level
const configured = Effect.provide(program, LogLevelLive)

// Test the configured program using ConfigProvider.fromMap
const test = Effect.provide(
configured,
Layer.setConfigProvider(
ConfigProvider.fromMap(new Map([["LOG_LEVEL", LogLevel.Warning.label]]))
)
)

Effect.runFork(test)
/_
Output:
... level=ERROR fiber=#0 message=ERROR!
... level=WARN fiber=#0 message=WARNING!
_/
```

To evaluate the configured program, you can utilize ConfigProvider.fromMap for testing (refer to Testing Services for more details).

## Custom loggers

In this section, we will learn how to define a custom logger and set it as the default logger.

First, let's define our custom logger using Logger.make:

```ts
//CustomLogger.ts
import { Logger } from "effect"

export const logger = Logger.make(({ logLevel, message }) => {
globalThis.console.log(`[${logLevel.label}] ${message}`)
})
// Assuming we have defined the following program:

// program.ts
import { Effect } from "effect"

const task1 = Effect.gen(function* () {
yield* Effect.sleep("2 seconds")
yield\* Effect.logDebug("task1 done")
})

const task2 = Effect.gen(function* () {
yield* Effect.sleep("1 second")
yield\* Effect.logDebug("task2 done")
})

export const program = Effect.gen(function* () {
yield* Effect.log("start")
yield* task1
yield* task2
yield\* Effect.log("done")
})

/* To replace the default logger, we simply need to create a specific layer using Logger.replace and provide it to our program using Effect.provide before executing it:
*/

// index.ts
import { Effect, Logger, LogLevel } from "effect"
import \* as CustomLogger from "./CustomLogger"
import { program } from "./program"

// Replace the default logger with the custom logger
const layer = Logger.replace(Logger.defaultLogger, CustomLogger.logger)

Effect.runFork(
program.pipe(
Logger.withMinimumLogLevel(LogLevel.Debug),
Effect.provide(layer)
)
)
// This is what we see printed on the console after executing the program:

// Terminal
[INFO] start
[DEBUG] task1 done
[DEBUG] task2 done
[INFO] done
```

## Built-in Loggers

### json

The json logger formats log entries as JSON objects, making them easy to integrate with logging systems that consume JSON data.

```ts
import { Effect, Logger } from "effect"

const program = Effect.log("message1", "message2").pipe(
Effect.annotateLogs({ key1: "value1", key2: "value2" }),
Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.json)))
// {"message":["message1","message2"],"logLevel":"INFO","timestamp":"...","annotations":{"key2":"value2","key1":"value1"},"spans":{"myspan":0},"fiberId":"#0"}
```

### logFmt

This logger outputs logs in a human-readable format that is easy to read during development or in a production console.

```ts
import { Effect, Logger } from "effect"

const program = Effect.log("message1", "message2").pipe(
Effect.annotateLogs({ key1: "value1", key2: "value2" }),
Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.logFmt)))
// timestamp=... level=INFO fiber=#0 message=message1 message=message2 myspan=0ms key2=value2 key1=value1
```

### structured

The structured logger provides detailed log outputs, structured in a way that retains comprehensive traceability of the events, suitable for deeper analysis and troubleshooting.

```ts
import { Effect, Logger } from "effect"

const program = Effect.log("message1", "message2").pipe(
Effect.annotateLogs({ key1: "value1", key2: "value2" }),
Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.structured)))
/_
{
message: [ 'message1', 'message2' ],
logLevel: 'INFO',
timestamp: '2024-07-09T14:05:41.623Z',
cause: undefined,
annotations: { key2: 'value2', key1: 'value1' },
spans: { myspan: 0 },
fiberId: '#0'
}
_/
```

### pretty

The pretty logger utilizes the capabilities of the console API to generate visually engaging and color-enhanced log outputs. This feature is particularly useful for improving the readability of log messages during development and debugging processes.

```ts
import { Effect, Logger } from "effect"

const program = Effect.log("message1", "message2").pipe(
Effect.annotateLogs({ key1: "value1", key2: "value2" }),
Effect.withLogSpan("myspan")
)

Effect.runFork(program.pipe(Effect.provide(Logger.pretty)))
/_
green --v v-- bold and cyan
[07:51:54.434] INFO (#0) myspan=1ms: message1
message2
v-- bold
key2: value2
key1: value1
_/
```

Log levels are colored as follows:

| Log Level | Color |
|--------|:------------------|
| Trace | Gray |
| Debug | Blue |
| Info | Green |
| Warning | Yellow |
| Error | Red |
| Fatal | White on Red |
