import { act } from "react-dom/test-utils";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import React from "react";

import AddChassisForm from "./AddChassisForm";

const mockStore = configureStore();

describe("AddChassisForm", () => {
  let initialState;
  beforeEach(() => {
    initialState = {
      config: {
        items: [{ name: "maas_name", value: "MAAS" }],
      },
      domain: {
        items: [
          {
            id: 0,
            name: "maas",
          },
        ],
        loaded: true,
      },
      general: {
        powerTypes: {
          data: [
            {
              name: "manual",
              description: "Manual",
              fields: [],
              chassis: true,
            },
            {
              name: "dummy",
              description: "Dummy power type",
              fields: [
                {
                  name: "power_address",
                  label: "IP address",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
              ],
              chassis: true,
            },
            {
              driver_type: "power",
              name: "vmware",
              description: "VMware",
              fields: [
                {
                  name: "power_vm_name",
                  label: "VM Name (if UUID unknown)",
                  required: false,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "node",
                },
                {
                  name: "power_uuid",
                  label: "VM UUID (if known)",
                  required: false,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "node",
                },
                {
                  name: "power_address",
                  label: "VMware IP",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
                {
                  name: "power_user",
                  label: "VMware username",
                  required: true,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
                {
                  name: "power_pass",
                  label: "VMware password",
                  required: true,
                  field_type: "password",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
                {
                  name: "power_port",
                  label: "VMware API port (optional)",
                  required: false,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
                {
                  name: "power_protocol",
                  label: "VMware API protocol (optional)",
                  required: false,
                  field_type: "string",
                  choices: [],
                  default: "",
                  scope: "bmc",
                },
              ],
              missing_packages: [],
              chassis: true,
              queryable: true,
            },
          ],
          loaded: true,
        },
      },
      machine: {
        errors: {},
        saved: false,
        saving: false,
      },
    };
  });

  it("fetches the necessary data on load if not already loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = false;
    const store = mockStore(state);
    mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <AddChassisForm />
        </MemoryRouter>
      </Provider>
    );
    const expectedActions = ["FETCH_DOMAIN", "FETCH_GENERAL_POWER_TYPES"];
    const actions = store.getActions();
    expectedActions.forEach((expectedAction) => {
      expect(actions.some((action) => action.type === expectedAction));
    });
  });

  it("displays a spinner if data has not loaded", () => {
    const state = { ...initialState };
    state.domain.loaded = false;
    state.general.powerTypes.loaded = false;
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            { pathname: "/machines/chassis/add", key: "testKey" },
          ]}
        >
          <AddChassisForm />
        </MemoryRouter>
      </Provider>
    );
    expect(wrapper.find("Spinner").length).toBe(1);
  });

  it("correctly dispatches action to add chassis", async () => {
    const state = { ...initialState };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/machines/add", key: "testKey" }]}
        >
          <AddChassisForm />
        </MemoryRouter>
      </Provider>
    );

    // Select vmware from power types dropdown
    await act(async () => {
      wrapper
        .find("select[name='power_type']")
        .props()
        .onChange({ target: { name: "power_type", value: "vmware" } });
    });
    wrapper.update();

    // Submit the form with unformatted power parameters
    await act(async () =>
      wrapper
        .find("Formik")
        .props()
        .onSubmit({
          domain: "maas",
          power_parameters: {
            power_address: "192.168.1.1",
            power_pass: "secret",
            power_port: "8000",
            power_protocol: "abc123",
            power_user: "user1",
          },
          power_type: "vmware",
        })
    );

    // Expect the power_id param to be removed when action is dispatched.
    expect(
      store.getActions().find((action) => action.type === "ADD_MACHINE_CHASSIS")
    ).toStrictEqual({
      type: "ADD_MACHINE_CHASSIS",
      payload: {
        params: {
          chassis_type: "vmware",
          domain: "maas",
          hostname: "192.168.1.1",
          password: "secret",
          port: "8000",
          protocol: "abc123",
          username: "user1",
        },
      },
    });
  });
});
