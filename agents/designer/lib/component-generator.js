const componentSpecs = {
  button: {
    variants: ["primary", "secondary", "outline", "ghost"],
    sizes: ["sm", "md", "lg"],
    states: ["default", "hover", "active", "disabled", "loading"],
    accessibility: "需支援鍵盤導航和螢幕閱讀器",
  },
  input: {
    types: ["text", "email", "password", "search", "number"],
    states: ["default", "focus", "error", "disabled", "readonly"],
    features: ["label", "placeholder", "helper text", "error message"],
  },
  card: {
    variants: ["elevated", "outlined", "filled"],
    sections: ["header", "body", "footer"],
    features: ["image", "title", "description", "actions"],
  },
  modal: {
    types: ["dialog", "drawer", "bottom-sheet"],
    features: ["overlay", "close button", "title", "body", "actions"],
    accessibility: "需支援 ESC 關閉和焦點管理",
  },
};

export async function generateComponent(name, type) {
  const spec = componentSpecs[type] || componentSpecs.card;

  return {
    name,
    type,
    spec,
    code: generateCode(name, type, spec),
    usage: `import { ${capitalize(name)} } from './components/${name}';`,
  };
}

function generateCode(name, type, spec) {
  const capName = capitalize(name);

  return {
    react: `<${capName} type="${type}">Content</${capName}>`,
    vue: `<${capName} type="${type}">Content</${capName}>`,
    html: `<div class="${name} ${type}">Content</div>`,
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
