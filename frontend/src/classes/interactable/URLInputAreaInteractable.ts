import { URLInputAreaModel } from './URLInputAreaModel';
import Interactable from '../../components/Town/Interactable';
import TownController from '../TownController';
import TownGameScene from '../../components/Town/TownGameScene';
import Phaser from 'phaser';

export default class URLInputAreaInteractable extends Interactable {
  private _model: URLInputAreaModel;

  constructor(scene: TownGameScene, model: URLInputAreaModel, townController?: TownController) {
    super(scene, model.id);
    this._model = model;

    if (townController) this.townController = townController;

    // Add visual rectangle directly to the scene
    const graphics = scene.add.graphics();
    graphics.fillStyle(0x0000ff, 0.5);
    graphics.fillRect(0, 0, 100, 50);
  }

  getModel(): URLInputAreaModel {
    return this._model;
  }

  overlap() {
    
    console.log(`Player is overlapping with ${this._model.id}`);
  }

  overlapExit() {
    console.log(`Player left ${this._model.id}`);
  }

  interact() {
    console.log('Interacted with URL input area:', this._model.id);
  }

  updateModel(model: URLInputAreaModel) {
    this._model = model;
  }

  getType(): 'URLInputArea' {
    return 'URLInputArea';
  }
}