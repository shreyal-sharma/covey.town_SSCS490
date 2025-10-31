import { mock, mockClear } from 'jest-mock-extended';
import { nanoid } from 'nanoid';
import JukeboxArea from './JukeboxArea';
import {
  JukeboxArea as JukeboxAreaModel,
  PlayerID,
  Song,
  TownEmitter,
} from '../types/CoveyTownSocket';
import Player from '../lib/Player';
import { getLastEmittedEvent } from '../TestUtils';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

describe('JukeboxArea', () => {
  const testAreaBox = { x: 100, y: 100, width: 100, height: 100 };
  let testArea: JukeboxArea;
  const townEmitter = mock<TownEmitter>();
  let newPlayer: Player;
  const id = nanoid();
  const songQueue: Song[] = [];
  const occupants: PlayerID[] = [];

  const testSong: Song = {
    url: '',
    duration: 1000,
    thumbnail: '',
    title: '',
    artist: '',
  };

  beforeEach(() => {
    mockClear(townEmitter);
    testArea = new JukeboxArea({ id, songQueue, occupants }, testAreaBox, townEmitter);
    newPlayer = new Player(nanoid(), mock<TownEmitter>());
    testArea.add(newPlayer);
  });

  describe('remove', () => {
    it('Removes the player from the list of occupants and emits an interactableUpdate event', () => {
      // Add another player so that we are not also testing what happens when the last player leaves
      const extraPlayer = new Player(nanoid(), mock<TownEmitter>());
      testArea.add(extraPlayer);
      testArea.remove(newPlayer);

      expect(testArea.occupantsByID).toEqual([extraPlayer.id]);
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({
        id,
        songQueue: [],
        occupants: [extraPlayer.id],
        type: 'JukeboxArea',
      });
    });
  });

  describe('add', () => {
    it('Adds the player to the occupants list', () => {
      expect(testArea.occupantsByID).toEqual([newPlayer.id]);
    });

    it('Emits an interactableUpdate event', () => {
      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate).toEqual({
        id,
        songQueue: [],
        occupants: [newPlayer.id],
        type: 'JukeboxArea',
      });
    });

    test('toModel sets the ID, songQueue, and occupants', () => {
      const model = testArea.toModel();
      expect(model).toEqual({
        id,
        songQueue,
        occupants: [newPlayer.id],
        type: 'JukeboxArea',
      });
    });

    describe('fromMapObject', () => {
      it('Throws an error if the width or height are missing', () => {
        expect(() =>
          JukeboxArea.fromMapObject(
            { id: 1, name: nanoid(), visible: true, x: 0, y: 0 },
            townEmitter,
          ),
        ).toThrowError();
      });
      it('Creates a new viewing area using the provided boundingBox and id, with isPlaying defaulting to false and progress to 0, and emitter', () => {
        const x = 30;
        const y = 20;
        const width = 10;
        const height = 20;
        const name = 'name';
        const val = JukeboxArea.fromMapObject(
          { x, y, width, height, name, id: 10, visible: true },
          townEmitter,
        );
        expect(val.boundingBox).toEqual({ x, y, width, height });
        expect(val.id).toEqual(name);
        expect(val.songQueue).toEqual([]);
        expect(val.occupantsByID).toEqual([]);
      });
    });
  });

  describe('_queueSong', () => {
    it('Adds a song to the queue. For the first song added, sets its startedAt and set up songEnd callback, otherwise do nothing. Check that interactableUpdate event is sent.', () => {
      // @ts-expect-error (access to private method)
      testArea._queueSong(testSong);
      expect(testArea.songQueue[0].url).toEqual(testSong.url);
      expect(testArea.songQueue[0].artist).toEqual(testSong.artist);
      expect(testArea.songQueue[0].title).toEqual(testSong.title);
      expect(testArea.songQueue[0].duration).toEqual(testSong.duration);
      expect(testArea.songQueue[0].thumbnail).toEqual(testSong.thumbnail);
      expect(testArea.songQueue[0].startedAt).toBeGreaterThan(0);

      const lastEmittedUpdate = getLastEmittedEvent(townEmitter, 'interactableUpdate');
      expect(lastEmittedUpdate.id).toEqual(id);
      expect((lastEmittedUpdate as JukeboxAreaModel).songQueue[0].url).toEqual(testSong.url);

      jest.runAllTimers();
      expect(testArea.songQueue).toHaveLength(0);
      expect(getLastEmittedEvent(townEmitter, 'interactableUpdate')).toEqual({
        id,
        songQueue: [],
        occupants: [newPlayer.id],
        type: 'JukeboxArea',
      });
    });

    it('Test multiple songs added to the queue.', () => {
      // @ts-expect-error (access to private method)
      testArea._queueSong(testSong);
      // @ts-expect-error (access to private method)
      testArea._queueSong(testSong);

      expect(testArea.songQueue[0].url).toEqual(testSong.url);
      expect(testArea.songQueue[0].artist).toEqual(testSong.artist);
      expect(testArea.songQueue[0].title).toEqual(testSong.title);
      expect(testArea.songQueue[0].duration).toEqual(testSong.duration);
      expect(testArea.songQueue[0].thumbnail).toEqual(testSong.thumbnail);
      expect(testArea.songQueue[0].startedAt).toBeGreaterThan(0);
      expect(testArea.songQueue[1].url).toEqual(testSong.url);
      expect(testArea.songQueue[1].artist).toEqual(testSong.artist);
      expect(testArea.songQueue[1].title).toEqual(testSong.title);
      expect(testArea.songQueue[1].duration).toEqual(testSong.duration);
      expect(testArea.songQueue[1].thumbnail).toEqual(testSong.thumbnail);
      expect(testArea.songQueue[1].startedAt).toBeGreaterThan(0);

      jest.runOnlyPendingTimers();

      expect(testArea.songQueue).toHaveLength(1);

      jest.runAllTimers();

      expect(testArea.songQueue).toHaveLength(0);
    });
  });
});
