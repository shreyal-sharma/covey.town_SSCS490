import { ITiledMapObject } from '@jonbell/tiled-map-type-guard';
import {
  InteractableCommand,
  JukeboxArea as JukeboxAreaModel,
  InteractableCommandReturnType,
  Song,
  TownEmitter,
  BoundingBox,
  Player,
} from '../types/CoveyTownSocket';
import InteractableArea from './InteractableArea';
import InvalidParametersError from '../lib/InvalidParametersError';

export default class JukeboxArea extends InteractableArea {
  public songQueue: Song[];

  /**
   * Creates a new JukeboxArea.
   *
   * @param jukeboxAreaModel model containing this area's current queue and its ID
   * @param coordinates the bounding box that defines this conversation area
   * @param townEmitter a broadcast emitter that can be used to emit updates to players
   */
  public constructor(
    { songQueue, id }: Omit<JukeboxAreaModel, 'type'>,
    coordinates: BoundingBox,
    townEmitter: TownEmitter,
  ) {
    super(id, coordinates, townEmitter);
    this.songQueue = songQueue;
    this._periodicEmitAreaChanged();
  }

  /**
   * Creates a new JukeboxArea model that contains the state of the JukeboxArea to send to the client.
   *
   * @returns
   */
  public toModel(): JukeboxAreaModel {
    return {
      type: 'JukeboxArea',
      id: this.id,
      occupants: this.occupantsByID,
      songQueue: this.songQueue,
    };
  }

  /**
   * Creates a new JukeboxArea object that will represent a Jukebox Area object in the town map.
   * @param mapObject An ITiledMapObject that represents a rectangle in which this jukebox area exists
   * @param broadcastEmitter An emitter that can be used by this conversation area to broadcast updates
   * @returns
   */
  public static fromMapObject(
    mapObject: ITiledMapObject,
    broadcastEmitter: TownEmitter,
  ): JukeboxArea {
    const { name, width, height } = mapObject;
    if (!width || !height) {
      throw new Error(`Malformed jukebox area ${name}`);
    }
    const rect: BoundingBox = { x: mapObject.x, y: mapObject.y, width, height };
    return new JukeboxArea({ id: name, occupants: [], songQueue: [] }, rect, broadcastEmitter);
  }

  /**
   * Handles Jukebox commands. In this case, SearchSong, QueueSong, InitiateSongSkipVote and VoteForSongSkip.
   *
   * @param command command to handle
   * @returns a command response
   * @throws InvalidParameterError
   */
  public handleCommand<CommandType extends InteractableCommand>(
    command: CommandType,
  ): InteractableCommandReturnType<CommandType> {
    if (command.type === 'SearchSong') {
      if (command.title == null && command.artist == null) {
        throw new InvalidParametersError('Empty search parameters');
      }

      throw new Error('Not implemented');
    }
    if (command.type === 'QueueSong') {
      this._queueSong(this._urlToSong(command.url, command.player));
      return undefined as InteractableCommandReturnType<CommandType>;
    }
    if (command.type === 'InitiateSongSkipVote') {
      throw new Error('Not implemented');
    }
    if (command.type === 'VoteForSongSkip') {
      throw new Error('Not implemented');
    }

    throw new InvalidParametersError('Unknown command type');
  }

  /**
   * Converts a song url to a Song.
   * @param url url of the song
   * @param queuedBy the player who queued the song
   */
  private _urlToSong(url: string, queuedBy?: Player): Song {
    // TODO: perform validation of url, as well as access YouTube API in order
    // to retrieve duration/title/artist/thumbnail.
    return {
      url,
      thumbnail: '',
      duration: 30000,
      title: '',
      artist: '',
      queuedBy,
    };
  }

  /**
   * Adds a song to the queue. If the added song is the only one in the queue,
   * we set its startedAt time and set up a callback for when it ends.
   * @param song the song to queue
   */
  private _queueSong(song: Song) {
    this.songQueue.push(song);
    if (this.songQueue.length === 1) {
      this.songQueue[0].startedAt = Date.now();

      setTimeout(() => this._songEnd(), this.songQueue[0].duration);
    }

    this._emitAreaChanged();
  }

  /**
   * Runs whenever a song finishes playing. Removes the finished song from the
   * queue. If another song is present, start playing it and call ourselves
   * recursively when the song completes.
   */
  private _songEnd() {
    // remove zeroth song from song queue
    this.songQueue.shift();
    if (this.songQueue.length >= 1) {
      this.songQueue[0].startedAt = Date.now();

      setTimeout(() => this._songEnd(), this.songQueue[0].duration);

      this._emitAreaChanged();
    }
  }

  /**
   * Emits an area update once a second. This allows users who join mid-song
   * to get a synchronization update and start playing music. This also allows
   * for periodic synchronization between the frontend and backend.
   */
  private _periodicEmitAreaChanged() {
    const period = 1000; // 1000 ms is one second

    this._emitAreaChanged();
    setTimeout(() => this._periodicEmitAreaChanged(), period);
  }
}
