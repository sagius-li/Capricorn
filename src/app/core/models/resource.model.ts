export class DSAttribute {
  SystemName: string;
  DisplayName?: string;
  Description?: string;
  Type?: string;
  RegEx?: string;
  PermissionHint?: string;
  Value?: any;
  Values?: Array<any>;
  ResolvedValue?: DSResource;
  ResolvedValues?: Array<DSResource>;
  IsMultivalued?: boolean;
  IsReadOnly?: boolean;
  IsRequired?: boolean;
  IsDirty?: boolean;
  IsNull?: boolean;
}

export class DSResource {
  ObjectID: string;
  ObjectType?: string;
  DisplayName?: string;
  HasPermissionHints?: boolean;
  Attributes?: { [key: string]: DSAttribute };
}

export class DSResourceSet {
  TotalCount: number;
  HasMoreItems: boolean;
  Resources: Array<DSResource>;
}
