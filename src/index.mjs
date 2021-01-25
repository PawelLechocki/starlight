import Listr from 'listr';
import removeDecorators from './parse/removeDecorators.mjs';
import redecorate from './parse/redecorate.mjs';
import compile from './solc.mjs';

import checks from './transformers/checks.mjs';
import ownership from './transformers/ownership.mjs';
import toCircuit from './transformers/toCircuit.mjs';
import toContract from './transformers/toContract.mjs';
import toOrchestration from './transformers/toOrchestration.mjs';

// Original funtion before listr - might choose to revert back to this simple function.
const zappify = options => {
  const { deDecoratedFile, toRedecorate } = removeDecorators(options);

  const solAST = compile(deDecoratedFile, options);

  const zsolAST = redecorate(solAST, toRedecorate, options);

  let path = checks(zsolAST, options);

  path = ownership(path, options);

  if (options.isTest && options.testType === 'prelim') return path;

  // toOrchestration(zsolAST, options);
  //
  // toCircuit(zsolAST, options);
  //
  // toContract(zsolAST, options);

  if (options.isTest) return path.scope.indicators;

  return path;
};

// const tasks = new Listr([
//   {
//     title: '.zsol => .sol',
//     task: ctx => {
//       const { options } = ctx;
//       const { desprinkledFile, toResprinkle } = desprinkle(options);
//       ctx.desprinkledFile = desprinkledFile;
//       ctx.toResprinkle = toResprinkle;
//     },
//   },
//   {
//     title: '.sol => .sol AST',
//     task: ctx => {
//       const { desprinkledFile, options } = ctx;
//       const solAST = compile(desprinkledFile, options);
//       ctx.solAST = solAST;
//     },
//   },
//   {
//     title: '.sol AST => .zsol AST',
//     task: ctx => {
//       const { solAST, toResprinkle, options } = ctx;
//       const zsolAST = resprinkle(solAST, toResprinkle, options);
//       ctx.zsolAST = zsolAST;
//     },
//   },
//   {
//     title: '.zsol AST => circuit AST => .zok files',
//     task: ctx => {
//       const { zsolAST, options } = ctx;
//       toCircuit(zsolAST, options);
//     },
//   },
// ]);

// const zappify = options => {
//   const ctx = { options };
//   tasks.run(ctx).catch(err => {
//     throw new Error(err);
//   });
// };

export default zappify;
