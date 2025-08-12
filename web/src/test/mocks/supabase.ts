type SelectResult<T> = { data: T; error: null } | { data: null; error: { message: string } };

type InsertResult = { data: { id?: string; entry_date: string } | null; error: { message: string } | null };

export function createSupabaseMock<T>(opts: {
  selectResult?: SelectResult<T>;
  insertResult?: InsertResult;
}) {
  const { selectResult, insertResult } = opts;

  const chainSelect = {
    eq() {
      return chainSelect;
    },
    order() {
      return chainSelect;
    },
    limit() {
      return Promise.resolve(selectResult ?? { data: [] as unknown as T, error: null });
    },
    maybeSingle() {
      return Promise.resolve(selectResult ?? { data: null as unknown as T, error: null } as SelectResult<T>);
    },
  };

  return {
    from() {
      return {
        select() {
          return chainSelect;
        },
        insert() {
          return {
            select() {
              return {
                single() {
                  return Promise.resolve(
                    insertResult ?? { data: { entry_date: "1970-01-01" }, error: null }
                  );
                },
              };
            },
          };
        },
      };
    },
  };
}
