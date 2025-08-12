const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const csso = require('csso');

const root = __dirname;
const srcDir = path.join(root, 'src');
const distDir = path.join(root, 'dist');

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

['index.html', 'manifest.json', 'service-worker.js', 'icon.svg'].forEach((file) => {
  fs.copyFileSync(path.join(root, file), path.join(distDir, file));
});

const copyAndMinifyCss = () => {
  const cssSrcDir = path.join(srcDir, 'css');
  const cssDistDir = path.join(distDir, 'src', 'css');
  fs.mkdirSync(cssDistDir, { recursive: true });
  fs.readdirSync(cssSrcDir).forEach((file) => {
    const css = fs.readFileSync(path.join(cssSrcDir, file), 'utf8');
    const minified = csso.minify(css).css;
    fs.writeFileSync(path.join(cssDistDir, file), minified);
  });
};

const copyAndMinifyJs = async () => {
  const jsSrcDir = path.join(srcDir, 'js');
  const jsDistDir = path.join(distDir, 'src', 'js');
  fs.mkdirSync(jsDistDir, { recursive: true });
  for (const file of fs.readdirSync(jsSrcDir)) {
    const js = fs.readFileSync(path.join(jsSrcDir, file), 'utf8');
    const result = await minify(js);
    fs.writeFileSync(path.join(jsDistDir, file), result.code);
  }
};

const build = async () => {
  copyAndMinifyCss();
  await copyAndMinifyJs();
};

build();
