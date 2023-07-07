import { Title, Text, TextInput, Button, Paper, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import config from '../config.json';
import axios from 'axios';

export function ControlBox(functionInfo: functionInfo) {
  const [buttonLoading, setButtonLoading] = useState(false);

  const formObj: { initialValues: any } = {
    initialValues: {},
  };

  useEffect(() => {
    // Set keys in the formObj
    functionInfo.params.forEach(param => {
      formObj.initialValues[param.name] = '';
    });
    console.log(`formObj for ${functionInfo.name}`);
    console.log(formObj);
  }, []);

  const form = useForm(formObj);

  async function handleSubmission(values: any) {
    setButtonLoading(true)
    // change param later
    await new Promise(resolve => setTimeout(resolve, 1500));

    await axios.post(`/${functionInfo.name}`, values)

    setButtonLoading(false);
  }

  return (
    <>
      <Paper withBorder p="lg">
        <Title order={2}>{functionInfo.name}</Title>

        <form onSubmit={form.onSubmit(values => handleSubmission(values))}>
          <>
            {functionInfo.params.map((param, key) => (
              <div key={key}>
                <Text>{`${param.name} (${param.type})`}</Text>
                {/* Add support for numbers etc. later */}
                {param.type.includes('uint') ? <NumberInput mb={10} {...form.getInputProps(param.name)} /> : <TextInput mb={10} {...form.getInputProps(param.name)} />}
              </div>
            ))}
          </>

          <Button loading={buttonLoading} type="submit">Submit</Button>
        </form>
      </Paper>
      <br />
    </>
  );
}
