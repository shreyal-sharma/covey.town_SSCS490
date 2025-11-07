import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import useTownController from '../../../hooks/useTownController';
import React from 'react';
import { InteractableID } from '../../../types/CoveyTownSocket';
import { useInteractable, useInteractableAreaController } from '../../../classes/TownController';
import JukeboxAreaController from '../../../classes/interactable/JukeboxAreaController';
import JukeboxAreaInteractable from './JukeboxArea';
import { useCallback } from 'react';

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
    );
  }
  return <></>;
}
