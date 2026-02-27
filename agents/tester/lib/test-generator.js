import fs from "fs";
import path from "path";

export async function generateTest(filePath, type = "unit") {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);

  const generators = {
    ".js": generateJS,
    ".ts": generateTS,
    ".jsx": generateJSX,
    ".tsx": generateTSX,
  };

  const generator = generators[ext] || generateJS;
  return generator(baseName, content, type);
}

function generateJS(name, content, type) {
  const functions = extractFunctions(content);

  if (type === "unit") {
    return {
      file: `${name}.test.js`,
      content: generateUnitTestJS(functions, name),
    };
  }

  return { file: `${name}.test.js`, content: "// Test template" };
}

function generateTS(name, content, type) {
  const functions = extractFunctions(content);

  return {
    file: `${name}.test.ts`,
    content: generateUnitTestTS(functions, name),
  };
}

function generateJSX(name, content, type) {
  return {
    file: `${name}.test.jsx`,
    content: generateReactTest(name),
  };
}

function generateTSX(name, content, type) {
  return {
    file: `${name}.test.tsx`,
    content: generateReactTest(name),
  };
}

function extractFunctions(content) {
  const functionRegex =
    /(?:function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\(|(\w+)\s*:\s*(?:async\s*)?\()/g;
  const functions = [];
  let match;

  while ((match = functionRegex.exec(content)) !== null) {
    functions.push(match[1] || match[2] || match[3]);
  }

  return functions;
}

function generateUnitTestJS(functions, name) {
  let content = `import { describe, it, expect } from 'jest';\n`;
  content += `import * as ${name} from './${name}.js';\n\n`;

  content += `describe('${name}', () => {\n`;

  if (functions.length > 0) {
    functions.forEach((fn) => {
      content += `  it('${fn} should work', () => {\n`;
      content += `    expect(true).toBe(true);\n`;
      content += `  });\n\n`;
    });
  } else {
    content += `  it('should be defined', () => {\n`;
    content += `    expect(${name}).toBeDefined();\n`;
    content += `  });\n`;
  }

  content += `});\n`;

  return content;
}

function generateUnitTestTS(functions, name) {
  return generateUnitTestJS(functions, name);
}

function generateReactTest(name) {
  return `import { render, screen } from '@testing-library/react';
import ${name} from './${name}';

describe('${name}', () => {
  it('renders correctly', () => {
    render(<${name} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
`;
}
