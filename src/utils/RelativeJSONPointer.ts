export type ParsedPointer = [number, ...Array<string>] | string[];

export class InvalidPointerError extends Error {
  pointer: string;

  constructor(pointer: string, message: string) {
    super(message);
    this.pointer = pointer;
    Object.setPrototypeOf(this, InvalidPointerError.prototype);
  }
}

/**
 * Escapes a reference token
 * @param value The JSON pointer token
 */
export function escape(value: string): string {
  if (value === null || value === undefined || typeof value !== "string") {
    return value;
  }
  return value.replace(/~/g, "~0").replace(/\//g, "~1");
}

/**
 * Unescapes a reference token
 * @param value Escaped JSON pointer token
 */
export function unescape(value: string): string {
  if (value === null || value === undefined || typeof value !== "string") {
    return value;
  }
  return value.replace(/~0/g, "~").replace(/~1/g, "/");
}

/**
 * Appends reference tokens to a base JSON pointer.
 * @param base JSON pointer to append tokens onto
 * @param tokens Tokens to append to the JSON pointer
 */
export function append(base: string, tokens: string | string[]): string {
  if (base === null || base === undefined || typeof base !== "string") {
    return base;
  }
  if (
    tokens === null ||
    tokens === undefined ||
    (typeof tokens !== "string" && !Array.isArray(tokens))
  ) {
    return base;
  }

  if (base.endsWith("/")) {
    base = base.slice(0, base.length - 1);
  }
  tokens = Array.isArray(tokens) ? tokens : [tokens];
  for (const token of tokens) {
    base += "/" + escape(token);
  }
  return base;
}

/**
 * Parse a JSON pointer string into an array of reference tokens
 * @param pointer
 */
export function parse(pointer: string | undefined): ParsedPointer {
  if (!pointer) {
    return [];
  }

  if (pointer === "") {
    return [];
  }

  if (/^\d+\/.*$/.test(pointer)) {
    const [parentDepth, ...tokens] = pointer.split("/");
    return [parseInt(parentDepth, 10), ...tokens.map(unescape)];
  }

  if (!pointer.startsWith("/")) {
    throw new InvalidPointerError(pointer, "pointer must start with a /");
  }

  return pointer.slice(1).split("/").map(unescape);
}

export function isValid(pointer: any) {
  if (
    pointer === undefined ||
    pointer === null ||
    typeof pointer !== "string"
  ) {
    return false;
  }

  try {
    parse(pointer);
    return true;
  } catch (err) {
    if (err instanceof InvalidPointerError) {
      return false;
    }
    throw err;
  }
}

export function startsWith(pointer: string, searchPointer: string): boolean {
  const pointerComponents = parse(pointer);
  const searchComponents = parse(searchPointer);

  // pointer must be longer than or equal to search length
  if (pointerComponents.length < searchComponents.length) {
    return false;
  }

  for (let i = 0; i < searchComponents.length; i++) {
    if (pointerComponents[i] !== searchComponents[i]) {
      return false;
    }
  }

  return true;
}

/**
 * Computes a JSON pointer from a set of reference tokens
 * @param tokens
 */
export function compile(tokens: ParsedPointer): string {
  if (!Array.isArray(tokens)) {
    return "";
  }
  if (tokens.length === 0) {
    return "";
  }
  if (isRelativePointer(tokens)) {
    return `${tokens[0]}/${tokens.map(escape).join("/")}`;
  } else {
    return "/" + tokens.map(escape).join("/");
  }
}

/**
 * Gets the parent pointer for the provided pointer
 * @param pointer
 * @returns
 */
export function parent(pointer: string): string | undefined {
  if (pointer === "") {
    return undefined;
  }
  const tokens = parse(pointer);
  tokens.pop();
  return compile(tokens);
}

export function isRelativePointer(
  pointer: ParsedPointer
): pointer is [number, ...Array<string>] {
  return pointer.length > 0 && typeof pointer[0] === "number";
}

/**
 * Evaluates the JSON pointer against the root document provided.
 * @param pointer JSON pointer to evaluate
 * @param root JSON document to evaluate the pointer against.
 */
export function evaluate(
  pointer: string,
  root: any,
  startingPointer?: string
): any | undefined {
  let tokens = parse(pointer);
  if (isRelativePointer(tokens)) {
    if (!startingPointer) {
      throw new InvalidPointerError(
        pointer,
        "pointer is relative but no starting pointer was provided"
      );
    }

    const parentDepth = tokens[0];
    let rootPointer = startingPointer;
    for (let i = 0; i < parentDepth; i++) {
      rootPointer = parent(rootPointer);
    }

    pointer = append(rootPointer, tokens.slice(1) as string[]);
    tokens = parse(pointer);
  }
  let value = root;
  for (const token of tokens) {
    if (value && typeof value === "object") {
      value = value && token in value ? value[token] : undefined;
    } else {
      break;
    }
  }
  return value;
}

export function set<T = any>(
  root: T,
  targetPointer: string,
  targetValue: any
): T {
  const tokens = parse(targetPointer);
  if (tokens.length === 0) {
    return targetValue as T;
  }

  let value: any = root;
  while (tokens.length > 1) {
    const token = tokens.shift() as string;
    value =
      value && typeof value === "object" && token in value
        ? value[token]
        : undefined;
    if (!value) {
      return root;
    }
  }

  if (!value || typeof value !== "object") {
    return root;
  }

  value[tokens[0]] = targetValue;
  return root;
}

export function deletePointer<T = any>(
  root: T,
  targetPointer: string
): boolean {
  const tokens = parse(targetPointer);
  if (tokens.length === 0) {
    return false;
  }

  let value: any = root;
  while (tokens.length > 1) {
    const token = tokens.shift() as string;
    value =
      value && typeof value === "object" && token in value
        ? value[token]
        : undefined;
    if (!value) {
      return false;
    }
  }

  if (!value || typeof value !== "object") {
    return false;
  }

  delete value[tokens[0]];
  return true;
}

const exports = {
  escape,
  unescape,
  append,
  parse,
  parent,
  compile,
  evaluate,
  set,
  startsWith,
  deletePointer,
  isValid,
};

export default exports;
