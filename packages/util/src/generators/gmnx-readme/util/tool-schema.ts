export interface ToolSchema {
  readonly $schema: 'http://json-schema.org/schema';
  readonly $id: string;
  readonly cli: 'nx';
  readonly type: 'object';
  readonly title: string;
  readonly description?: string;
  readonly examples?: readonly ToolSchemaExample[];
  readonly properties: ToolSchemaProperties;
  readonly required?: readonly string[];
  readonly additionalProperties?: boolean;
}

export interface ToolSchemaExample {
  readonly command: string;
  readonly description: string;
}

export interface ToolSchemaProperties {
  readonly [key: string]: ToolSchemaAnyProperty;
}

export type ToolSchemaPropertyType = 'string' | 'integer' | 'array';

export interface ToolSchemaPropertyBase {
  readonly type: ToolSchemaPropertyType;
}

export interface ToolSchemaPropertyString extends ToolSchemaPropertyBase {
  readonly type: 'string';
  readonly description: string;
  readonly enum: readonly string[];
  readonly alias?: string;
  readonly default?: string;
  readonly $default?: ToolSchemaPropertyDefault;
  readonly 'x-prompt'?: string;
}

export interface ToolSchemaPropertyInteger extends ToolSchemaPropertyBase {
  readonly type: 'integer';
  readonly minimum?: number;
  readonly maximum?: number;
}

export interface ToolSchemaPropertyArray extends ToolSchemaPropertyBase {
  readonly type: 'array';
  readonly items: {
    readonly type: 'string';
  };
}

export type ToolSchemaAnyProperty =
  | ToolSchemaPropertyString
  | ToolSchemaPropertyInteger
  | ToolSchemaPropertyArray;

export interface ToolSchemaPropertyDefault {
  readonly $source: string;
  readonly index?: number;
}
