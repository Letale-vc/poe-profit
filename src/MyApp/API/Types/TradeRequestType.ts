export interface TradeRequestType {
  query: TradeQueryType;
  sort?: Sort;
}

export interface TradeQueryType {
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
  min?: number | null;
  max?: number | null;
  weight?: number;
}

interface Value2 {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
}

interface Quality {
  min?: number | null;
  max?: number | null | null;
}

interface GemLevel {
  min?: number | null;
  max?: number | null | null;
}

interface Ilvl {
  min?: number | null;
  max?: number | null | null;
}

interface GemLevelProgress {
  min?: number | null;
  max?: number | null | null;
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
  min?: number | null;
  max?: number | null;
}

interface ScourgeTier {
  min?: number | null;
  max?: number | null;
}

interface StoredExperience {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
}

interface HeistEscapeRoutes {
  min?: number | null;
  max?: number | null;
}

interface HeistRewardRooms {
  max?: number | null;
  min?: number | null;
}

interface HeistLockpicking {
  min?: number | null;
  max?: number | null;
}

interface HeistPerception {
  min?: number | null;
  max?: number | null;
}

interface HeistCounterThaumaturgy {
  min?: number | null;
  max?: number | null;
}

interface HeistAgility {
  min?: number | null;
  max?: number | null;
}

interface HeistEngineering {
  min?: number | null;
  max?: number | null;
}

interface HeistMaxWings {
  min?: number | null;
  max?: number | null;
}

interface HeistMaxEscapeRoutes {
  min?: number | null;
  max?: number | null;
}

interface HeistMaxRewardRooms {
  min?: number | null;
  max?: number | null;
}

interface HeistBruteForce {
  min?: number | null;
  max?: number | null;
}

interface HeistDemolition {
  min?: number | null;
  max?: number | null;
}

interface HeistTrapDisarmament {
  min?: number | null;
  max?: number | null;
}

interface HeistDeception {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
}

interface MapIiq {
  min?: number | null;
  max?: number | null;
}

interface AreaLevel {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
}

interface MapPacksize {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
}

interface Dex {
  min?: number | null;
  max?: number | null;
}

interface Class {
  option?: string;
}

interface Str {
  min?: number | null;
  max?: number | null;
}

interface Int {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
  r?: number;
  g?: number;
  b?: number;
  w?: number;
}

interface Links {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
}

interface Es {
  min?: number | null;
  max?: number | null;
}

interface Block {
  min?: number | null;
  max?: number | null;
}

interface Ev {
  min?: number | null;
  max?: number | null;
}

interface Ward {
  min?: number | null;
  max?: number | null;
}

interface BaseDefencePercentile {
  min?: number | null;
  max?: number | null;
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
  min?: number | null;
  max?: number | null;
}

interface Crit {
  min?: number | null;
  max?: number | null;
}

interface Pdps {
  min?: number | null;
  max?: number | null;
}

interface Aps {
  min?: number | null;
  max?: number | null;
}

interface Dps {
  min?: number | null;
  max?: number | null;
}

interface Edps {
  min?: number | null;
  max?: number | null;
}

interface Sort {
  price?: string;
}
