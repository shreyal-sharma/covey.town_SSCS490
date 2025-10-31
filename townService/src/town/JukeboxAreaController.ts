import { BroadcastOperator } from 'socket.io';
import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';

import Player from '../lib/Player';
import InteractableArea from './InteractableArea';
import {
  TownEmitter,
  JukeboxArea,
  InteractableCommand,
  InteractableCommandReturnType,
  Song,
  ServerToClientEvents,
  SocketData,
} from '../types/CoveyTownSocket';

export default class JukeboxAreaController extends InteractableArea {
  private _jukeboxState: JukeboxArea;

  constructor(
    id: string,
    jukeboxModel: JukeboxArea,
    boundingBox: { x: number; y: number; width: number; height: number },
    townEmitter: BroadcastOperator<ServerToClientEvents, SocketData>,
  ) {
    super(id, boundingBox, townEmitter);
    this._jukeboxState = { ...jukeboxModel };
  }

  public get songQueue(): Song[] {
    return this._jukeboxState.songQueue;
  }

  public get elapsedTimeSec(): number {
    return this._jukeboxState.elapsedTimeSec;
  }

  public set elapsedTimeSec(value: number) {
    this._jukeboxState.elapsedTimeSec = value;
    this._emitAreaChanged();
  }

  public override toModel(): JukeboxArea {
    return {
      ...this._jukeboxState,
      occupants: Object.keys(this.occupantsByID), // ensure it's a string[]
    };
  }

  public override handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
    player: Player,
  ): InteractableCommandReturnType<CommandType> {
    switch (command.type) {
      case 'JukeboxAreaUpdate': {
        if (command.update.songQueue) {
          this._jukeboxState.songQueue = command.update.songQueue;
        }
        if (typeof command.update.elapsedTimeSec === 'number') {
          this._jukeboxState.elapsedTimeSec = command.update.elapsedTimeSec;
        }
        this._emitAreaChanged();
        return undefined as InteractableCommandReturnType<CommandType>;
      }

      case 'QueueSong': {
        const newSong: Song = {
          url: command.url,
          queuedBy: command.player,
          title: '',
          artist: '',
          thumbnail: '',
          duration: 0,
        };
        this._jukeboxState.songQueue.push(newSong);
        this._emitAreaChanged();
        return undefined as InteractableCommandReturnType<CommandType>;
      }

      case 'InitiateSongSkipVote':
      case 'VoteForSongSKip':
      case 'SearchSong': {
        return undefined as InteractableCommandReturnType<CommandType>;
      }

      default: {
        return undefined as InteractableCommandReturnType<CommandType>;
      }
    }
  }

  static fromMapObject(
    mapObject: ITiledMapObject,
    townEmitter: TownEmitter,
  ): JukeboxAreaController {
    const { x = 0, y = 0, width = 0, height = 0, name } = mapObject;
    const boundingBox = { x, y, width, height };
    const jukeboxModel: JukeboxArea = {
      id: name,
      type: 'JukeboxArea',
      songQueue: [],
      elapsedTimeSec: 0,
      occupants: [],
      timeWhenLastAreaUpdateWasSent: 0,
    };
    return new JukeboxAreaController(name, jukeboxModel, boundingBox, townEmitter);
  }
}
