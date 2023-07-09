import { Title, ActionIcon, ScrollArea, Text } from '@mantine/core';
import { Refresh } from 'tabler-icons-react';
import { Prism } from '@mantine/prism';
import { useState } from 'react';

interface Commitment {
  _id: string;
  name: string;
  mappingKey: string;
  secretKey: string;
  preimage: {
    stateVarId: string;
    value: string;
    salt: string;
    publicKey: string;
  };
  isNullified: boolean;
  nullifier: string;
}

export function CommitmentTable() {
  const [commitments, setCommitments] = useState<Commitment[]>([]);

  async function fetchCommitments() {
    try {
      const response = await fetch('/getAllCommitments', {
        method: 'GET',
      });

      const commitments = await response.json();

      setCommitments(commitments.commitments);

      console.log(commitments);
    } catch (err) {
      alert("Error fetching commitments. Is the apiservice running?")
      console.log(err);
    }
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
        }}
      >
        <Title>Commitments</Title>
        <Text></Text>
        <ActionIcon
          onClick={fetchCommitments}
          style={{
            alignSelf: 'center',
            marginLeft: '10px',
          }}
        >
          <Refresh />
        </ActionIcon>
      </div>
      <Text>The commitments are sorted from oldest to the most recent ones.</Text>
      <br />
      <ScrollArea h={750}>
        {!commitments
          ? ''
          : commitments.map((commitment: Commitment, key) => (
              <div key={key}>
                <Prism language="json" noCopy>
                  {JSON.stringify(commitment, null, 2)}
                </Prism>
                <br />
              </div>
            ))}
      </ScrollArea>
    </>
  );
}

// {
//     "_id": "0x2b34ccdd57cf1f44dad54aa6bf6b2e8f14ce589e258f538c6a4d903315d73f5f",
//     "name": "a",
//     "mappingKey": null,
//     "secretKey": "0x0020b87caad44f0e223eb87f161fea673c52e1e405f1cbb23c7b0368ed4a3c5a",
//     "preimage": {
//         "stateVarId": "0x0000000000000000000000000000000000000000000000000000000000000003",
//         "value": "10",
//         "salt": "0x00485d838511ee28ea23e77e13b70af198fecf1d7daccc6c50defaddffd9af21",
//         "publicKey": "0x22ef125f3313172f9c05736b4f5729cc547f4582117de702bff16bec49aba5c3"
//     },
//     "isNullified": true,
//     "nullifier": "0x2f81807eecd359ae0a996a73cd2fc83cc045cea4a2491b2c8d84ea214b13194d"
// }
