import { MemoryRouter, Route } from "react-router-dom";
import { mount } from "enzyme";
import React from "react";

import { Nav } from "./Nav";

describe("Nav", () => {
  it("renders", () => {
    const wrapper = mount(
      <MemoryRouter
        initialEntries={[{ pathname: "/settings", key: "testKey" }]}
        initialIndex={0}
      >
        <Route component={(props) => <Nav {...props} />} path="/settings" />
      </MemoryRouter>
    );
    expect(wrapper.find("SideNav").exists()).toBe(true);
  });
});
