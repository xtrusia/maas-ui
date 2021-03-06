import { define, extend, random, sequence } from "cooky-cutter";

import type { Controller } from "app/store/controller/types";
import type { Device } from "app/store/device/types";
import type { Machine } from "app/store/machine/types";
import type {
  Pod,
  PodDetails,
  PodHint,
  PodHintExtras,
  PodStoragePool,
} from "app/store/pod/types";
import type { Model } from "app/store/types/model";
import { BaseNode, SimpleNode, TestStatus } from "app/store/types/node";
import { model, modelRef } from "./model";

const testStatus = define<TestStatus>({
  status: 0,
  pending: 0,
  running: 0,
  passed: 0,
  failed: 0,
});

const actions = () => [];
const architectures = () => ["amd64/generic", "i386"];
const extra_macs = () => [];
const capabilities = () => [
  "composable",
  "dynamic_local_storage",
  "over_commit",
  "storage_pools",
];
const fabrics = () => [];
const ip_addresses = () => [];
const link_speeds = () => [];
const permissions = () => ["edit", "delete", "compose"];
const service_ids = () => [];
const spaces = () => [];
const storage_pools = () => [podStoragePool(), podStoragePool()];
const storage_tags = () => [];
const subnets = () => [];
const tags = () => [];
const hints = () => ({ ...podHint(), ...podHintExtras() });

const simpleNode = extend<Model, SimpleNode>(model, {
  actions,
  domain: modelRef,
  hostname: `test-machine-${random}`,
  fqdn: "test.maas",
  link_type: "",
  node_type_display: "",
  permissions,
  system_id: random.toString(),
  tags,
});

export const device = extend<SimpleNode, Device>(simpleNode, {
  extra_macs,
  fabrics,
  ip_address: "192.168.1.100",
  ip_assignment: "dynamic",
  link_speeds,
  node_type_display: "Device",
  owner: "admin",
  parent: null,
  primary_mac: "de:ad:be:ef:ba:c1",
  spaces,
  subnets,
  zone: modelRef,
});

const node = extend<SimpleNode, BaseNode>(simpleNode, {
  architecture: "amd64/generic",
  description: "a test node",
  cpu_count: 1,
  cpu_speed: 0,
  cpu_test_status: testStatus,
  distro_series: "",
  interface_test_status: testStatus,
  locked: false,
  memory: 1,
  memory_test_status: testStatus,
  network_test_status: testStatus,
  osystem: "ubuntu",
  other_test_status: testStatus,
  pool: modelRef,
  status: "Allocated",
  status_message: "",
  status_code: 10,
  storage_test_status: testStatus,
});

export const machine = extend<BaseNode, Machine>(node, {
  commissioning_status: testStatus,
  description: "a test machine",
  extra_macs,
  fabrics,
  has_logs: false,
  ip_addresses,
  link_speeds,
  link_type: "machine",
  node_type_display: "Machine",
  numa_nodes_count: 1,
  owner: "admin",
  physical_disk_count: 1,
  pod: modelRef,
  power_state: "on",
  power_type: "manual",
  pxe_mac_vendor: "Unknown vendor",
  pxe_mac: "de:ad:be:ef:aa:b1",
  spaces,
  sriov_support: false,
  storage_tags,
  storage: 8,
  subnets,
  testing_status: testStatus,
  vlan: null,
  zone: modelRef,
});

export const controller = extend<BaseNode, Controller>(node, {
  description: "a test controller",
  last_image_sync: "Thu, 02 Jul. 2020 22:55:00",
  link_type: "controller",
  node_type_display: "Controller",
  node_type: 4,
  service_ids,
  version_long: "2.9.0~alpha1 (8668-g.71d5929ae) (snap)",
  version_short: "2.9.0~alpha1",
  version: "2.9.0~alpha1-8668-g.71d5929ae",
});

export const podHint = define<PodHint>({
  cores: 8,
  local_storage: 10000000000,
  local_storage_gb: "1000",
  memory: 8000,
  memory_gb: "8",
});

const podHintExtras = define<PodHintExtras>({
  cpu_speed: 1000,
  iscsi_storage: -1,
  iscsi_storage_gb: "-0.0",
  local_disks: -1,
});

export const podStoragePool = define<PodStoragePool>({
  available: 700000000000,
  total: 1000000000000,
  used: 300000000000,
  name: () => `storage-pool-${random()}`,
  path: () => `/path/to/${random()}`,
  id: sequence,
  type: "lvm",
});

export const pod = extend<Model, Pod>(model, {
  architectures,
  available: podHint,
  capabilities,
  composed_machines_count: 1,
  cpu_over_commit_ratio: 10,
  cpu_speed: 1000,
  created: "Wed, 19 Feb. 2020 11:59:19",
  default_macvlan_mode: "",
  default_storage_pool: "b85e27c9-9d53-4821-ad64-153c53767ce9",
  hints,
  host: "",
  ip_address: (i: number) => `192.168.1.${i}`,
  memory_over_commit_ratio: 8,
  name: (i: number) => `pod${i}`,
  permissions,
  pool: 1,
  power_address: "qemu+ssh://ubuntu@127.0.0.1/system",
  power_pass: "",
  owners_count: 1,
  storage_pools,
  tags,
  total: podHint,
  type: "virsh",
  updated: "Fri, 03 Jul. 2020 02:44:12",
  used: podHint,
  zone: 1,
});

export const podDetails = extend<Pod, PodDetails>(pod, {
  attached_vlans: () => [],
  boot_vlans: () => [],
});
