export interface TradeQueryType {
  query: Query;
  sort?: Sort;
}

interface Query {
  status?: Status;
  name?: string | Name;
  type?: string | Type;
  term?: string;
  stats?: Stat[];
  filters?: Filters;
}
interface Name {
  discriminator?: string;
  option?: string;
}
interface Type {
  discriminator?: string;
  option?: string;
}
interface Status {
  option?: string;
}

interface Stat {
  type?: string;
  filters?: Filter[];
  disabled?: boolean;
  value?: Value2;
}

interface Filter {
  id?: string;
  value?: Value;
  disabled?: boolean;
}

interface Value {
  min?: number;
  max?: number;
  weight?: number;
}

interface Value2 {
  min?: number;
  max?: number;
}

interface Filters {
  misc_filters?: MiscFilters;
  type_filters?: TypeFilters;
  trade_filters?: TradeFilters;
  heist_filters?: HeistFilters;
  map_filters?: MapFilters;
  req_filters?: ReqFilters;
  socket_filters?: SocketFilters;
  armour_filters?: ArmourFilters;
  weapon_filters?: WeaponFilters;
}

interface MiscFilters {
  filters?: Filters2;
  disabled?: boolean;
}

interface Filters2 {
  stack_size?: StackSize;
  quality?: Quality;
  gem_level?: GemLevel;
  ilvl?: Ilvl;
  gem_level_progress?: GemLevelProgress;
  gem_alternate_quality?: GemAlternateQuality;
  fractured_item?: FracturedItem;
  searing_item?: SearingItem;
  identified?: Identified;
  mirrored?: Mirrored;
  crafted?: Crafted;
  synthesised_item?: SynthesisedItem;
  tangled_item?: TangledItem;
  corrupted?: Corrupted;
  split?: Split;
  veiled?: Veiled;
  talisman_tier?: TalismanTier;
  scourge_tier?: ScourgeTier;
  stored_experience?: StoredExperience;
}

interface StackSize {
  min?: number;
  max?: number;
}

interface Quality {
  min?: number;
  max?: number;
}

interface GemLevel {
  min?: number;
  max?: number;
}

interface Ilvl {
  min?: number;
  max?: number;
}

interface GemLevelProgress {
  min?: number;
  max?: number;
}

interface GemAlternateQuality {
  option?: string;
}

interface FracturedItem {
  option?: string;
}

interface SearingItem {
  option?: string;
}

interface Identified {
  option?: string;
}

interface Mirrored {
  option?: string;
}

interface Crafted {
  option?: string;
}

interface SynthesisedItem {
  option?: string;
}

interface TangledItem {
  option?: string;
}

interface Corrupted {
  option?: string;
}

interface Split {
  option?: string;
}

interface Veiled {
  option?: string;
}

interface TalismanTier {
  min?: number;
  max?: number;
}

interface ScourgeTier {
  min?: number;
  max?: number;
}

interface StoredExperience {
  min?: number;
  max?: number;
}

interface TypeFilters {
  filters?: Filters3;
  disabled?: boolean;
}

interface Filters3 {
  category?: Category;
  rarity?: Rarity;
}

interface Category {
  option?: string;
}

interface Rarity {
  option?: string;
}

interface TradeFilters {
  filters?: Filters4;
  disabled?: boolean;
}

interface Filters4 {
  price?: Price;
  collapse?: Collapse;
  indexed?: Indexed;
}

interface Price {
  option?: string;
  min?: number;
  max?: number;
}

interface Collapse {
  option?: string;
}

interface Indexed {
  option?: string;
}

interface HeistFilters {
  disabled?: boolean;
  filters?: Filters5;
}

interface Filters5 {
  heist_wings?: HeistWings;
  heist_escape_routes?: HeistEscapeRoutes;
  heist_reward_rooms?: HeistRewardRooms;
  heist_lockpicking?: HeistLockpicking;
  heist_perception?: HeistPerception;
  heist_counter_thaumaturgy?: HeistCounterThaumaturgy;
  heist_agility?: HeistAgility;
  heist_engineering?: HeistEngineering;
  heist_max_wings?: HeistMaxWings;
  heist_max_escape_routes?: HeistMaxEscapeRoutes;
  heist_max_reward_rooms?: HeistMaxRewardRooms;
  heist_brute_force?: HeistBruteForce;
  heist_demolition?: HeistDemolition;
  heist_trap_disarmament?: HeistTrapDisarmament;
  heist_deception?: HeistDeception;
  heist_objective_value?: HeistObjectiveValue;
}

interface HeistWings {
  min?: number;
  max?: number;
}

interface HeistEscapeRoutes {
  min?: number;
  max?: number;
}

interface HeistRewardRooms {
  max?: number;
  min?: number;
}

interface HeistLockpicking {
  min?: number;
  max?: number;
}

interface HeistPerception {
  min?: number;
  max?: number;
}

interface HeistCounterThaumaturgy {
  min?: number;
  max?: number;
}

interface HeistAgility {
  min?: number;
  max?: number;
}

interface HeistEngineering {
  min?: number;
  max?: number;
}

interface HeistMaxWings {
  min?: number;
  max?: number;
}

interface HeistMaxEscapeRoutes {
  min?: number;
  max?: number;
}

interface HeistMaxRewardRooms {
  min?: number;
  max?: number;
}

interface HeistBruteForce {
  min?: number;
  max?: number;
}

interface HeistDemolition {
  min?: number;
  max?: number;
}

interface HeistTrapDisarmament {
  min?: number;
  max?: number;
}

interface HeistDeception {
  min?: number;
  max?: number;
}

interface HeistObjectiveValue {
  option?: string;
}

interface MapFilters {
  disabled?: boolean;
  filters?: Filters6;
}

interface Filters6 {
  map_tier?: MapTier;
  map_iiq?: MapIiq;
  area_level?: AreaLevel;
  map_uberblighted?: MapUberblighted;
  map_series?: MapSeries;
  map_blighted?: MapBlighted;
  map_iir?: MapIir;
  map_packsize?: MapPacksize;
}

interface MapTier {
  min?: number;
  max?: number;
}

interface MapIiq {
  min?: number;
  max?: number;
}

interface AreaLevel {
  min?: number;
  max?: number;
}

interface MapUberblighted {
  option?: string;
}

interface MapSeries {
  option?: string;
}

interface MapBlighted {
  option?: string;
}

interface MapIir {
  min?: number;
  max?: number;
}

interface MapPacksize {
  min?: number;
  max?: number;
}

interface ReqFilters {
  disabled?: boolean;
  filters?: Filters7;
}

interface Filters7 {
  lvl?: Lvl;
  dex?: Dex;
  class?: Class;
  str?: Str;
  int?: Int;
}

interface Lvl {
  min?: number;
  max?: number;
}

interface Dex {
  min?: number;
  max?: number;
}

interface Class {
  option?: string;
}

interface Str {
  min?: number;
  max?: number;
}

interface Int {
  min?: number;
  max?: number;
}

interface SocketFilters {
  disabled?: boolean;
  filters?: Filters8;
}

interface Filters8 {
  sockets?: Sockets;
  links?: Links;
}

interface Sockets {
  min?: number;
  max?: number;
  r?: number;
  g?: number;
  b?: number;
  w?: number;
}

interface Links {
  min?: number;
  max?: number;
  r?: number;
  g?: number;
  b?: number;
  w?: number;
}

interface ArmourFilters {
  disabled?: boolean;
  filters?: Filters9;
}

interface Filters9 {
  ar?: Ar;
  es?: Es;
  block?: Block;
  ev?: Ev;
  ward?: Ward;
  base_defence_percentile?: BaseDefencePercentile;
}

interface Ar {
  min?: number;
  max?: number;
}

interface Es {
  min?: number;
  max?: number;
}

interface Block {
  min?: number;
  max?: number;
}

interface Ev {
  min?: number;
  max?: number;
}

interface Ward {
  min?: number;
  max?: number;
}

interface BaseDefencePercentile {
  min?: number;
  max?: number;
}

interface WeaponFilters {
  disabled?: boolean;
  filters?: Filters10;
}

interface Filters10 {
  damage?: Damage;
  crit?: Crit;
  pdps?: Pdps;
  aps?: Aps;
  dps?: Dps;
  edps?: Edps;
}

interface Damage {
  min?: number;
  max?: number;
}

interface Crit {
  min?: number;
  max?: number;
}

interface Pdps {
  min?: number;
  max?: number;
}

interface Aps {
  min?: number;
  max?: number;
}

interface Dps {
  min?: number;
  max?: number;
}

interface Edps {
  min?: number;
  max?: number;
}

interface Sort {
  price?: string;
}
