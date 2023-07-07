import { Title, Text, Input, Button, Paper } from '@mantine/core';
import config from '../config.json';
import { ControlBox } from './ControlBox';

export function Controls() {
  return (
    <>
      <Title>Controls</Title>
      <br />

      {config.functionInfo.map((e, key) => (
        <div key={key}>
          <ControlBox name={e.name} params={e.params} />
        </div>
      ))}
    </>
  );
}



