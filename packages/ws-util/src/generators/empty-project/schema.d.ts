export interface EmptyProjectGeneratorSchema {
  readonly name: string;
  readonly directory?: string;
  readonly tags?: string;
  readonly srcDir: string;
}
