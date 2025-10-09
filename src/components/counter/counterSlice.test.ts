import type { AppStore } from "../../app/store"
import { makeStore } from "../../app/store"
import {
  counterSlice,
  decrement,
  increment,
  incrementByAmount,
  selectCount,
} from "./counterSlice"

type LocalTestContext = {
  store: AppStore
}

describe("counter reducer", () => {
  beforeEach<LocalTestContext>(context => {
    const store = makeStore()

    context.store = store
  })

  it("should handle initial state", () => {
    expect(counterSlice.reducer(undefined, { type: "unknown" })).toStrictEqual({
      value: 0,
      status: "idle",
    })
  })

  it<LocalTestContext>("should handle increment", ({ store }) => {
    expect(selectCount(store.getState())).toBe(3)

    store.dispatch(increment())

    expect(selectCount(store.getState())).toBe(4)
  })

  it<LocalTestContext>("should handle decrement", ({ store }) => {
    expect(selectCount(store.getState())).toBe(3)

    store.dispatch(decrement())

    expect(selectCount(store.getState())).toBe(2)
  })

  it<LocalTestContext>("should handle incrementByAmount", ({ store }) => {
    expect(selectCount(store.getState())).toBe(3)

    store.dispatch(incrementByAmount(2))

    expect(selectCount(store.getState())).toBe(5)
  })
})
