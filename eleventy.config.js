import fs from "fs-extra";
import htmlmin from "html-minifier";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import pluginWebC from "@11ty/eleventy-plugin-webc";
import postcss from "postcss";
import postcssImport from "postcss-import";
import postcssNested from "postcss-nested";
import postcssEach from "postcss-each";
import autoprefixer from "autoprefixer";

export default function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginWebC, {
    components: "src/_components/**/*.webc"
  });

  // Make CSS mo-betta
  eleventyConfig.addTemplateFormats("css");

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (inputContent) {
      const result = await postcss([
        postcssImport,
        postcssNested,
        postcssEach,
        autoprefixer
      ]).process(inputContent, { from: undefined, to: undefined });

      return async () => result.css;
    }
  });

  // Markdown support
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    renderHref: false,
    tabIndex: false
  });

  eleventyConfig.setLibrary("md", markdownLibrary);

  // 404 handling
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: (err, bs) => {
        bs.addMiddleware("*", (req, res) => {
          const content_404 = fs.readFileSync("_site/404.html");
          console.log(content_404);
          res.writeHead(404, { "Content-Type": "text/html; charset=UTF-8" });
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  // HTML minification
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }
    return content;
  });

  // Passthrough static stuffs
  eleventyConfig.addPassthroughCopy({
    static: "/"
  });
  eleventyConfig.setServerPassthroughCopyBehavior("copy");

  return {
    dir: {
      input: "src",
      includes: "",
      layouts: "layouts",
      output: "dist"
    },
    markdownTemplateEngine: "njk"
  };
}
