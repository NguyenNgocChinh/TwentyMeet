import { FC, PropsWithChildren } from "react";

export type FCC<T = object> = FC<PropsWithChildren<T>>;

export type OmitStrict<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type valueOf<T> = T[keyof T];
export type PartialRequire<O, K extends keyof O> = {
  [P in K]-?: O[P];
} & O;

export type RequireOne<T, K extends keyof T = keyof T> = K extends keyof T
  ? PartialRequire<T, K>
  : never;

export type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type DeepNonNullable<T> = {
  [P in keyof T]-?: NonNullable<T[P]>;
};

export type TObject = Record<string | number, unknown>;

export type TOption = {
  label: string;
  value: string | number;
};

export type TApiRes<T> = {
  code: number;
  data: T;
  error: unknown;
  message: string;
  success: boolean;
};
