import ast from './contracts/Assign_ast.json' assert { type: 'json' };
import fs from 'fs'

export function prepareReactContractInfo() {
  let boilerplate = {
    name: '',
    functionInfo: [],
  };

  boilerplate.name = ast.files[0].nodes[2].name;

  ast.files[0].nodes[2].nodes.forEach(e => {
    if (e.nodeType === 'FunctionDefinition') {
      let paramName;
      let paramType;

      let functionInfoPayload = { name: e.name, params: [] };

      e.parameters.parameters.forEach(e => {
        if (e.nodeType === 'VariableDeclaration') {
          paramName = e.name;
          paramType = e.typeDescriptions.typeString;

          functionInfoPayload.params.push({ name: paramName, type: paramType });
        }
      });

      boilerplate.functionInfo.push(functionInfoPayload);
    }
  });

  console.log(boilerplate);
  fs.writeFile('demo-ui/src/config.json', JSON.stringify(boilerplate), (error) => {
    if (error) {
        throw error;
    }
});
}

prepareReactContractInfo();