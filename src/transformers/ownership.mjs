/* eslint-disable no-param-reassign */

import fs from 'fs';
import pathjs from 'path';
import NodePath from '../traverse/NodePath.mjs';
import logger from '../utils/logger.mjs';
import explode from './visitors/explode.mjs';
import nullifiedVisitor from './visitors/ownership/nullifiedVisitor.mjs';

/**
 * Inspired by the Transformer
 * https://github.com/jamiebuilds/the-super-tiny-compiler
 */

function transformation1(ast) {
  const state = {
    stopTraversal: false,
    skipSubnodes: false,
  };

  // We'll start by calling the traverser function with our ast and a visitor.
  // The newAST will be mutated through this traversal process.
  ast.traverse(explode(nullifiedVisitor), state);
  logger.info('All states nullifiable and nullifications marked');

  // At the end of our transformer function we'll return the new ast that we
  // just created.
  return ast;
}

// A transformer function which will accept an ast.
export default function ownership(ast, options) {
  logger.info('Performing ownership checks on the zsol AST...');
  const newAST = transformation1(ast);
  //  const newASTFilePath = pathjs.join(options.circuitsDirPath, `${options.inputFileName}_ast.json`);
  //  fs.writeFileSync(newASTFilePath, JSON.stringify(newAST, null, 4));

  // generate the circuit files from the newly created circuit AST:
  // logger.info('Generating files from the .zok AST...');
  // const circuitFileData = codeGenerator(newAST);
  //
  // // save the circuit files to the output dir:
  // logger.info(`Saving .zok files to the zApp output directory ${options.circuitsDirPath}...`);
  // for (const fileObj of circuitFileData) {
  //   const filepath = pathjs.join(options.outputDirPath, fileObj.filepath);
  //   const dir = pathjs.dirname(filepath);
  //   console.log(`About to save to ${filepath}...`)
  //   if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // required to create the nested folders for common import files.
  //   fs.writeFileSync(filepath, fileObj.file);
  // }
  logger.info('Owners assigned.');
  return newAST;
}
