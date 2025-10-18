import InteractableAreaController, { BaseInteractableEventMap } from './InteractableAreaController';
import { URLInputAreaModel } from './URLInputAreaModel';

export default class URLInputAreaController extends InteractableAreaController<
  BaseInteractableEventMap,
  URLInputAreaModel
> {
  private _model: URLInputAreaModel;

  constructor(model: URLInputAreaModel) {
    super(model.id);
    this._model = model;
  }

  get model(): URLInputAreaModel {
    return this._model;
  }

  set model(updatedModel: URLInputAreaModel) {
    this._model = updatedModel;
    this.emit('friendlyNameChange', this.friendlyName);
  }

  updateModel(updatedModel: URLInputAreaModel) {
    this.model = updatedModel;
  }

  protected _updateFrom(newModel: URLInputAreaModel): void {
    this._model = newModel;
    this.emit('friendlyNameChange', this.friendlyName);
  }

  /** IMPLEMENT ABSTRACT METHOD REQUIRED BY InteractableAreaController */
  toInteractableAreaModel(): URLInputAreaModel {
    return this._model;
  }

  isActive(): boolean {
    return true;
  }

  get friendlyName(): string {
    return this._model.friendlyName;
  }

  get type(): string {
    return 'URLInputArea';
  }
}
