const {readFile, getLinks, mdLinks, readFolder, validateLinks} = require ('../index.js')
//, dirFile, , , docOrFolder,  ,

describe('readFile', () => {
  it('readFile: deberia ser una funcion', () => {
    expect(typeof (readFile)).toBe('function');
  })
  it('readFile: deberia retortar una promesa', () => {
    const path = 'prueba.md';
    const result = readFile(path);
    expect(result).toBeInstanceOf(Promise);
  })
});

describe('readFolder', () => {
  it('readFolder: debería ser una función', () => {
    expect(typeof readFolder).toBe('function');
  });
  it('readFolder: deberia retornar true', () => {
    const result = readFolder('./prueba');
    expect(result).toBeTruthy();
  })
})

describe('mdLinks', () => {
  it('debería ser una función', () => {
    expect(typeof mdLinks).toBe('function');
  });
})

describe('getLinks', () => {
  it('getLinks: deberia ser una funcion', () => {
expect(typeof (getLinks)).toBe('function')  });
});

describe("validateLinks", () => {
  it("deberia retortar una funcion", () => {
  expect(typeof validateLinks).toBe("function");
  });
  it("deberia retortar una promesa", () => {
  const path = "prueba.md";
  const result = mdLinks(path);
  expect(result).toBeInstanceOf(Promise);
  });
});