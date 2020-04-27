export interface Node<TData> {
  /**
   * Local ID
   */
  id: string;
  /**
   * Absolute unique id
   */
  logicalId: string;
  data: TData;
  // currently string, in the future, this might be a tree of nodes
  body?: string;
  parent: NodeStub<TData> | null;
  children: NodeStub<TData>[];
}

type NodeStub<TData> = Omit<Node<TData>, "parent" | "children" | "body">;
export type NodeStubDict<TData> = { [logicalId: string]: NodeStub<TData> };
export type NodeDict<TData> = { [logicalId: string]: Node<TData> };

function fromStubs<TData>(stubs: NodeStubDict<TData>): NodeDict<TData> {
  const keys = Object.keys(stubs).sort();
  const out: NodeDict<TData> = {};
  const helper = (i: number, parent: Node<TData>) => {
    while (i < keys.length && keys[i].startsWith(parent.logicalId)) {
      parent.children.push({ ...stubs[keys[i]] });
      out[keys[i]] = {
        ...stubs[keys[i]],
        parent: { ...stubs[parent.logicalId] },
        children: [],
      };
      i++;
      helper(i, out[keys[i]]);
    }
  };
  out[keys[0]] = { ...stubs[keys[0]], parent: null, children: [] };
  helper(1, out[keys[0]]);
  return out;
}

interface NodeData {
  title: string;
  desc: string;
}
export interface SchemaData extends NodeData {
  aliases?: string[];
  kind?: SchemaNodeKind;
  // match: SchemaNodeMatchRule[];
  choices?: { [key: string]: SchemaNodeStub };
  // links: SchemaNodeLink[];
  /**
   * If namespace exists, display it here
   */
  //namespace?: string;
  //   language:
  //     kind: namespace
  //     choices:
  //         python:
  //         ruby:
  //         ts:
  //     children:
  //         data
  //         flow
}

export interface NoteData extends NodeData {}
export type NoteNode = Node<NoteData>;
export type NoteNodeStub = NodeStub<NoteData>;
export type NoteNodeDict = { [key: string]: NoteNode };
export type NoteStubDict = { [key: string]: NoteNodeStub };

export type SchemaDataKey = keyof SchemaData;

export type RequiredSchemaDataKey = "title" | "desc";
export const RequiredSchemaDataKeyValues: RequiredSchemaDataKey[] = [
  "title",
  "desc",
];

export type OptionalSchemaDataKey = Exclude<
  keyof SchemaData,
  RequiredSchemaDataKey
>;
export type SchemaNodeDict = { [key: string]: SchemaNode };
export type SchemaNodeKind = "namespace";
export type SchemaNodeStub = NodeStub<SchemaData>;
export type SchemaNode = Node<SchemaData>;

export type SchemaYAMLRaw = {
  name: string;
  schema: { [key: string]: SchemaYAMLEntryRaw } | { root: SchemaYAMLEntryRaw };
};
export type SchemaYAMLEntryRaw = SchemaData & {
  children: { [key: string]: any };
};

/*
global:
  schema:
    output:
      aliases: [out]
      desc: anything I want to put out. formerly known as report
    usecase:
      alias: use
      desc: describes a way something is used
    gotcha:
      desc: something novel
    journal:
      desc: continuously updated
      kind: namespace
      choices:
        meet: 
        design:
        changelog:
    internal:
      desc: internal impletation
    templates:
      alias: temp
      desc: re-usable templates
    notes:
      desc: notes on something
    todo:
      desc: "things to update"
      children:
        tasks:
        questions:
    questions:
      desc: "questions i have"
    ref:
      desc: catchall
*/

type NodeType = "stub" | "full";
type DataType = "schema" | "note";

type NodeGetResp<T> = {
  item: Node<T> | NodeStub<T>;
  nodeType: NodeType;
  dataType: DataType;
};

type NodeGetRootResp<T> = {
  item: Node<T>;
  dataType: DataType;
};

interface NodeQueryResp<T> {
  items: NodeGetResp<T>[];
  nodeType: NodeType;
  dataType: DataType;
}
interface Scope {
  username: string;
}

export interface NodeStorageAPI {
  /**
   * Get node based on logicalId
   */
  get: <T>(
    scope: Scope,
    logicalId: string,
    nodeType: NodeType,
    dataType: DataType
  ) => Promise<NodeGetResp<T>>;

  getRoot: <T>(scope: Scope, dataType: DataType) => Promise<NodeGetRootResp<T>>;

  /**
   * Get node based on query
   */
  query: <T>(
    scope: Scope,
    queryString: string,
    nodeType: NodeType,
    dataType: DataType
  ) => Promise<NodeQueryResp<T>>;
  /**
   * Write node to db
   */
  write: <T>(scope: Scope, node: Node<T>, dataType: DataType) => Promise<void>;
}
