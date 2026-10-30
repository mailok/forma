import type { Handle } from "remix/component";

export class Model<Events extends ModelEventMap> {
  #events = new EventTarget();

  listen<Type extends ModelEventType<Events>>(
    owner: SignalOwner,
    types: Type[],
    listener: (event: ModelEvent<Events, Type>) => void,
  ): void {
    for (const type of types) {
      this.#events.addEventListener(
        type,
        (event) => {
          listener({
            type,
            detail: (event as CustomEvent<Events[Type]>).detail,
          } as ModelEvent<Events, Type>);
        },
        { signal: owner.signal },
      );
    }
  }

  updateOn(handle: UpdatableHandle, types: ModelEventType<Events>[]): void {
    this.listen(handle, types, () => void handle.update());
  }

  protected dispatch<Type extends ModelEventType<Events>>(
    type: Type,
    ...[detail]: DetailArguments<Events[Type]>
  ): void {
    this.#events.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

// Each key is an event name; its value is the payload type, or void for none.
export type ModelEventMap = object;

export type ModelEventType<Events extends ModelEventMap> = Extract<
  keyof Events,
  string
>;

// A discriminated union lets listeners of several events narrow detail by type,
// which a CustomEvent cannot do because its type is a plain string.
export type ModelEvent<
  Events extends ModelEventMap,
  Type extends ModelEventType<Events>,
> = {
  [Name in Type]: { type: Name; detail: Events[Name] };
}[Type];

interface SignalOwner {
  signal: AbortSignal;
}

type UpdatableHandle = Pick<Handle, "signal" | "update">;

type DetailArguments<Detail> = [Detail] extends [void] ? [] : [detail: Detail];
