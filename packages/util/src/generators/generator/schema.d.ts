export interface GeneratorSchema {
  readonly project: string;
  readonly name: string;
  readonly description?: string;
  readonly unitTestRunner: 'jest' | 'none';
}
