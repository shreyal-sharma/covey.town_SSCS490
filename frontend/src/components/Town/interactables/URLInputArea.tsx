import React, { useEffect, useState } from 'react';
import { Input, Button, Box, Heading } from '@chakra-ui/react';
import URLInputAreaController from '../../../classes/interactable/URLInputAreaController';

interface URLInputAreaProps {
  controller: URLInputAreaController;
}

const URLInputArea: React.FC<URLInputAreaProps> = ({ controller }) => {
  const [url, setUrl] = useState('');
  const [model, setModel] = useState(controller.model);

  useEffect(() => {
  const listener = (updatedModel: typeof model) => setModel(updatedModel);

  controller.addListener('modelChange', listener);

  return () => {
    controller.removeListener('modelChange', listener);
  };
}, [controller]);

  const handleSubmit = () => {
    if (!url.trim()) return;

    console.log(`Submitting URL: ${url}`);

    controller.updateModel({ ...controller.model, url });

    setUrl('');
  };

  return (
    <Box
      padding="10px"
      border="1px solid pink"
      borderRadius="8px"
      backgroundColor="pink.50"
    >
      <Heading size="sm" mb={2}>
        {controller.friendlyName}
      </Heading>
      <Input
        placeholder="Enter song URL"
        value={url}
        onChange={e => setUrl(e.target.value)}
        mb={2}
        size="sm"
      />
      <Button colorScheme="pink" size="sm" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
};

export default URLInputArea;
