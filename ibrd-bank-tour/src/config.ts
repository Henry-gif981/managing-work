import { PARAMS } from './util/params';

/**
 * Small grey "Source · Section x · p. n" lines under cards and scenes (live and print).
 * Off by default (update 3); `?tags=1` switches them back on for the group's own checking.
 * The tags stay in the data (slides, beats, facts.ts) either way.
 */
export const SHOW_SOURCE_TAGS: boolean = false || PARAMS.tags;
