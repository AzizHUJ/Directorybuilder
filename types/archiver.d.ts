declare module "archiver" {
  import { Stream } from "stream";

  type EntryData = { name: string } & Record<string, unknown>;

  interface Archiver extends Stream {
    append(source: any, data: EntryData): this;
    pipe(stream: NodeJS.WritableStream): NodeJS.WritableStream;
    finalize(): Promise<void>;
    on(event: "error", listener: (error: Error) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;
  }

  interface ArchiverOptions {
    zlib?: { level?: number };
  }

  function archiver(format: string, options?: ArchiverOptions): Archiver;

  export default archiver;
  export { Archiver, ArchiverOptions, EntryData };
}
