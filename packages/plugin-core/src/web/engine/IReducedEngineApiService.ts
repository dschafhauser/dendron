import {
  BulkResp,
  BulkWriteNotesOpts,
  EngineDeleteNoteResp,
  EngineDeleteOpts,
  EngineWriteOptsV2,
  FindNoteOpts,
  NoteChangeEntry,
  NoteProps,
  NotePropsMeta,
  QueryNotesOpts,
  RenameNoteOpts,
  RenameNotePayload,
  RespV2,
} from "@dendronhq/common-all";

// Subset of IEngineAPIService
export interface IReducedEngineAPIService {
  /**
   * Get NoteProps by id. If note doesn't exist, return undefined
   */
  getNote: (id: string) => Promise<NoteProps | undefined>;
  /**
   * Find NoteProps by note properties. If no notes match, return empty list
   */
  findNotes: (opts: FindNoteOpts) => Promise<NoteProps[]>;
  /**
   * Find NoteProps metadata by note properties. If no notes metadata match, return empty list
   */
  findNotesMeta: (opts: FindNoteOpts) => Promise<NotePropsMeta[]>;

  bulkWriteNotes(
    opts: BulkWriteNotesOpts
  ): Promise<BulkResp<NoteChangeEntry[]>>;

  writeNote(
    note: NoteProps,
    opts?: EngineWriteOptsV2 | undefined
  ): Promise<RespV2<NoteChangeEntry[]>>;

  deleteNote(
    id: string,
    opts?: EngineDeleteOpts | undefined
  ): Promise<EngineDeleteNoteResp>;

  renameNote(opts: RenameNoteOpts): Promise<RespV2<RenameNotePayload>>;

  queryNotes(opts: QueryNotesOpts): Promise<RespV2<NoteProps[]>>;
}
