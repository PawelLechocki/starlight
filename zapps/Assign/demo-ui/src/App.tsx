import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Text, Title, Grid, Center } from '@mantine/core';
import { Controls } from './Components/Controls';
import { CommitmentTable } from './Components/CommitmentTable';
import config from './config.json'

function App() {
  return (
    <>
      <Container size={'xl'} mt={25}>
        <Title>{`🌟 Starlight - ${config.name} Demo UI`}</Title>
        <Grid mt={50} gutter={125}>
      <Grid.Col span={4}>
        <Controls/>
      </Grid.Col>
      <Grid.Col span={8}>
        <CommitmentTable/>
      </Grid.Col>
    </Grid>
      </Container>
    </>
  );
}

export default App;
