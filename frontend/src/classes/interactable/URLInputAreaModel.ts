import { Interactable, InteractableID, PlayerID } from '../../types/CoveyTownSocket';

export interface URLInputAreaModel extends Interactable {
  type: 'URLInputArea'; 
  id: InteractableID;
  friendlyName: string;
  url: string;
  occupants: PlayerID[];
}
