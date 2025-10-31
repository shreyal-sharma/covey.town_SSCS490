import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import Player from '../lib/Player';
import JukeboxAreaController from '../town/JukeboxAreaController';
import { defaultLocation, getLastEmittedEvent } from '../TestUtils';
import { TownEmitter } from '../types/CoveyTownSocket';
import {
  JukeboxArea,
  InteractableCommand,
  Song,
  ServerToClientEvents,
  SocketData,
} from '../types/CoveyTownSocket';
import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';

describe('JukeboxAreaController', () => {
  const id = nanoid();
  const boundingBox = { x: 100, y: 100, width: 100, height: 100 };
  const townEmitter = mock<TownEmitter>();
  let jukeboxArea: JukeboxAreaController;
  let player: Player;

  beforeEach(() => {
    mockClear(townEmitter);
    const jukeboxModel: JukeboxArea = {
      id,
      type: 'JukeboxArea',
      songQueue: [],
      elapsedTimeSec: 0,
      occupants: [],
      timeWhenLastAreaUpdateWasSent: 0,
    };
    jukeboxArea = new JukeboxAreaController(id, jukeboxModel, boundingBox, townEmitter);
    player = new Player(nanoid(), mock<TownEmitter>());
  });

  describe('add and remove players', () => {
    it('adds a player to occupantsByID and updates their location', () => {
      jukeboxArea.add(player);
      expect(jukeboxArea.occupantsByID).toEqual([player.id]);
      const lastMove = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastMove.location.interactableID).toEqual(id);
    });

    it('removes a player from occupantsByID and clears location', () => {
      jukeboxArea.add(player);
      mockClear(townEmitter);
      jukeboxArea.remove(player);
      expect(jukeboxArea.occupantsByID).toEqual([]);
      const lastMove = getLastEmittedEvent(townEmitter, 'playerMoved');
      expect(lastMove.location.interactableID).toBeUndefined();
    });
  });

  describe('song queue management', () => {
    it('queues a song correctly via command', () => {
      const command: InteractableCommand = {
        type: 'QueueSong',
        url: 'https://example.com/song.mp3',
        player: player.id,
        interactableID: id,
        commandID: nanoid(),
      } as any;
      jukeboxArea.handleCommand(command, player);
      expect(jukeboxArea.songQueue.length).toBe(1);
      expect(jukeboxArea.songQueue[0].url).toBe('https://example.com/song.mp3');
      expect(jukeboxArea.songQueue[0].queuedBy).toBe(player.id);
    });

    it('updates elapsedTimeSec via command', () => {
      const command: InteractableCommand = {
        type: 'JukeboxAreaUpdate',
        update: { elapsedTimeSec: 42 },
        interactableID: id,
        commandID: nanoid(),
      } as any;
      jukeboxArea.handleCommand(command, player);
      expect(jukeboxArea.elapsedTimeSec).toBe(42);
    });

    it('updates entire song queue via command', () => {
      const command: InteractableCommand = {
        type: 'JukeboxAreaUpdate',
        update: { songQueue: [{ url: 'a', queuedBy: player.id, title: '', artist: '', thumbnail: '', duration: 0 }] },
        interactableID: id,
        commandID: nanoid(),
      } as any;
      jukeboxArea.handleCommand(command, player);
      expect(jukeboxArea.songQueue.length).toBe(1);
      expect(jukeboxArea.songQueue[0].url).toBe('a');
    });
  });

  describe('toModel', () => {
    it('returns the correct model with occupants as string[]', () => {
      jukeboxArea.add(player);
      const model = jukeboxArea.toModel();
      expect(model.occupants).toEqual([player.id]);
      expect(model.songQueue).toEqual(jukeboxArea.songQueue);
      expect(model.type).toBe('JukeboxArea');
    });
  });

  describe('fromMapObject factory', () => {
    it('creates a JukeboxAreaController from a map object', () => {
      const mapObject: ITiledMapObject = {
  id: 1,
  name: 'jukebox1',
  type: 'JukeboxArea',
  x: 10,
  y: 20,
  width: 30,
  height: 40,
  rotation: 0,
  visible: true,
  gid: undefined,
  properties: [],
  class: undefined,
  template: undefined,
};
      const area = JukeboxAreaController.fromMapObject(mapObject, townEmitter);
      expect(area).toBeInstanceOf(JukeboxAreaController);
      expect(area.toModel().id).toBe('jukebox1');
      expect(area.toModel().occupants).toEqual([]);
      expect(area.toModel().songQueue).toEqual([]);
    });
  });
});
