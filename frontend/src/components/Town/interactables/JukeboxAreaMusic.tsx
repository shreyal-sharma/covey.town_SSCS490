import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Box,
  HStack,
  Text,
  Button,
} from '@chakra-ui/react';
import useTownController from '../../../hooks/useTownController';
import React from 'react';
import { InteractableID } from '../../../types/CoveyTownSocket';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import JukeboxAreaController from '../../../classes/interactable/JukeboxAreaController';
import JukeboxAreaInteractable from './JukeboxArea';
import { useCallback } from 'react';

// Props for the skip vote button
export type SkipVoteButtonProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function JukeboxArea({ interactableID }: { interactableID: InteractableID }): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const jukeboxAreaController =
    useInteractableAreaController<JukeboxAreaController>(interactableID);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const townController = useTownController();

  return (
    <>
      <h1>Hello, World!</h1>
    </>
  );
}

export function SkipVoteButton({ visible, onConfirm, onCancel }: SkipVoteButtonProps) {
  return (
    <Box
      position='fixed'
      bottom='16px'
      left='20px'
      zIndex={1100}
      display={visible ? 'flex' : 'none'}
      bg='white'
      border='1px solid #E4E7E9'
      borderRadius='12px'
      boxShadow='md'
      px='12px'
      py='10px'
      alignItems='center'
      gap='10px'>
      <Text fontWeight='semibold' mr='4px'>
        Skip song?
      </Text>
      <HStack spacing='8px'>
        <Button size='sm' onClick={onConfirm}>
          Confirm
        </Button>
        <Button size='sm' variant='outline' onClick={onCancel}>
          Cancel
        </Button>
      </HStack>
    </Box>
  );
}
/**
 * A wrapper component for the JukeboxArea component.
 */
export default function JukeboxAreaWrapper(): JSX.Element {
  const jukeboxArea = useInteractable<JukeboxAreaInteractable>('jukeboxArea');
  const townController = useTownController();
  const closeModal = useCallback(() => {
    if (jukeboxArea) {
      townController.interactEnd(jukeboxArea);
    }
  }, [townController, jukeboxArea]);
  if (jukeboxArea) {
    return (
      <>
        <Modal isOpen={true} onClose={closeModal} closeOnOverlayClick={false} size='xl'>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{jukeboxArea.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <JukeboxArea interactableID={jukeboxArea.id} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
  return (
    <>
      <SkipVoteButton
        visible={true} //TO DO change to actual logic
        onConfirm={() => {
          /* call your skip-vote mutation */
        }}
        onCancel={() => {
          /* optional: hide or just no-op */
        }}
      />
    </>
  );
}
