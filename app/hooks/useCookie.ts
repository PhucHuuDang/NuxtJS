import type { Ref } from "vue";
import type { CookieParseOptions, CookieSerializeOptions } from "cookie-es";
import type { CookieRef } from "#app";

export interface CookieOptions<T = any>
  extends Omit<
    CookieSerializeOptions & CookieParseOptions,
    "decode" | "encode"
  > {
  decode?(value: string): T;
  encode?(value: T): string;

  default?: () => T | Ref<T>;

  watch?: boolean | "shallow";

  readonly?: boolean;
}
// export function useCookie<T = string | null | undefined>(
//   name: string,
//   options?: CookieOptions<T>
// ): CookieRef<T>;
