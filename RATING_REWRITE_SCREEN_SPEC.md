# Rating Rewrite — Screen-by-Screen Spec

## Goal
Create one coherent **System → Rating** module in Configurator that brings together:

- current **Business → Rates**
  - Zone Rates
  - Distance Rates
  - Flight Rates
  - Extra Charges
  - Accessorial Groups
- current buried **System rating components**
  - Break Types
  - Break Groups
  - Unit Types
  - service/rating-method setup
- scheduled-rating work
  - Routed / Multi-leg
  - Bulk Distribution

The rewrite should use the existing product pattern of:
- **main list/table in centre**
- **right-hand drawer for detail/edit**
- **full-screen editor only for genuinely complex builders**

---

## Proposed left nav

### System
- Rating
  - Overview
  - Rate Cards
  - On-Demand
    - Zone Rates
    - Distance Rates
  - Air Freight
    - Flight Rates
  - Scheduled / Routed
    - Routed / Multi-leg
    - Bulk Distribution
  - Charges & Accessorials
    - Extra Charges
    - Accessorial Groups
  - Break Pricing
    - Break Types
    - Break Groups
  - Units & Measures
  - Service Rating Setup

---

## Global patterns

### A. Main layout
- **Left rail:** Rating nav
- **Centre:** list / cards / table / overview panels
- **Right drawer:** add, edit, inspect, link components
- **Sticky page header:** title, summary, search, quick actions

### B. Rate setup drawer pattern
Because rating setup has many linked parts, every add/edit drawer should use progress steps.

## Standard progress steps
1. **Scope**
   - client
   - rate card
   - service
   - vehicle
   - active/inactive
2. **Method**
   - zone / distance / flight / routed / bulk
3. **Pricing**
   - method-specific fields
4. **Linked Components**
   - extra charges
   - accessorial groups
   - break groups
   - units
   - location/zip constraints
5. **Effective Dates & Rules**
   - start date
   - end date
   - fuel flags
   - conditional notes
6. **Review**
   - summary
   - missing dependencies
   - conflicts / overlap warnings

### C. Linked components panel
In every rate drawer show a visible linked-components summary:
- **Uses Rate Card:** Default Auckland Metro
- **Uses Extra Charge:** After-hours surcharge
- **Uses Break Group:** Air Cargo Weight Breaks
- **Uses Accessorial Group:** Medical Handling Bundle
- **Location Scope:** 18 zip codes

This avoids hiding critical dependencies behind separate screens.

### D. Dependency health states
Use a small health/status pattern:
- **Connected** — green
- **Partial / optional** — orange
- **Missing / required** — red
- **Not applicable** — muted

---

# Screen-by-screen

## 1. Rating Overview
### Purpose
Give tenants/admins a front door into rating instead of dropping them into raw rate tables.

### Centre content
Overview cards:
- Rate Cards
- On-Demand Rates
- Air Freight Rates
- Scheduled / Routed
- Charges & Accessorials
- Break Pricing
- Service Rating Setup

Each card shows:
- active count
- draft/incomplete count
- last updated
- quick action

### Right drawer
Drawer opens on card click and shows:
- what the section controls
- linked downstream dependencies
- quick actions
- recent changes

### Key actions
- New Rate Card
- Add On-Demand Rate
- Add Flight Rate
- Open Routed Builder
- Add Extra Charge

---

## 2. Rate Cards
### Purpose
Commercial wrapper around rates, versioning, dates, copy/history.

### Centre list
Columns:
- Name
- Client
- Scope summary
- Uplift summary
- Active
- Start / End
- Version count / history
- Last updated

### Right drawer
Sections:
- General
- Scope
- Uplifts
- Linked Charges
- Effective Dates
- History

### Key fields
- name
- client
- optional service/vehicle scope
- charge flat uplift
- charge % uplift
- driver flat uplift
- driver % uplift
- apply fuel
- linked extra charge
- start / end dates
- active

### Notes
This is where the current rate-card adjustment logic belongs, not scattered in modal-only controls.

---

## 3. On-Demand → Zone Rates
### Purpose
Zone-to-zone pricing for courier/distribution flows.

### Centre list
Columns:
- Name
- Client
- Rate Card
- Service
- Vehicle
- From Zone
- To Zone
- Charge Rate
- Driver Rate
- Fuel
- Extra Charge
- Active

### Right drawer
Progress steps:
1. Scope
2. Method
3. Pricing
4. Linked Components
5. Effective Dates & Rules
6. Review

### Step details
#### Scope
- name
- client
- rate card
- service
- vehicle

#### Method
- fixed as **Zone Rate**
- from zone
- to zone

#### Pricing
- charge rate
- driver rate
- apply fuel charge

#### Linked Components
- extra charge
- accessorial group
- optional break group if future zone-weight combo is needed

#### Effective Dates & Rules
- start date
- end date
- active
- notes

#### Review
- summary
- overlap check with existing zone pair
- missing dependency flags

---

## 4. On-Demand → Distance Rates
### Purpose
Flag-fall + mileage / distance-based rating.

### Centre list
Columns:
- Name
- Client
- Rate Card
- Service
- Vehicle
- Distance Included
- Base Charge
- Driver Base
- Per Distance Unit
- Driver Per Distance Unit
- Fuel flags
- Extra Charge
- Active

### Right drawer
Progress steps:
1. Scope
2. Method
3. Pricing
4. Linked Components
5. Effective Dates & Rules
6. Review

### Step details
#### Scope
- name
- client
- rate card
- service
- vehicle

#### Method
- fixed as **Distance Rate**
- distance included
- start distance
- end distance
- only in zips

#### Pricing
- base charge
- base charge driver pay
- per mile/km
- per mile/km driver pay
- apply base fuel
- apply distance fuel

#### Linked Components
- extra charge
- location scope
- zip/postcode list or group
- optional break group if weight overlay applies later

#### Effective Dates & Rules
- start/end dates
- active
- conditional rules

#### Review
- summary
- duplicate-range detection
- location constraint health

### Note
Distance rates should keep the current **Locations** concept, but inside the same drawer flow as a dedicated step rather than a hidden secondary tab.

---

## 5. Air Freight → Flight Rates
### Purpose
Door-to-door air pricing with flight-specific surcharge logic.

### Centre list
Columns:
- Name
- Client
- Rate Card
- Service
- Vehicle
- Flight Base Charge
- Security Surcharge
- Critical Surcharge
- Cargo Breakpoint
- Fuel flags
- Extra Charge
- Active

### Right drawer
Progress steps:
1. Scope
2. Method
3. Pricing
4. Linked Components
5. Effective Dates & Rules
6. Review

### Step details
#### Scope
- name
- client
- rate card
- service
- vehicle

#### Method
- fixed as **Flight Rate**
- optional airport/sector scope later

#### Pricing
- flight base charge
- apply base fuel
- cargo surcharge weight breakpoint
- cargo surcharge below charge
- cargo surcharge above rate
- apply cargo fuel
- airline security surcharge
- apply security fuel
- critical service surcharge
- apply critical fuel

#### Linked Components
- extra charge
- accessorial group
- **break group** for cargo/weight handling
- **unit type** for weight unit clarity

#### Effective Dates & Rules
- start/end dates
- active
- notes

#### Review
- summary
- missing break-group/unit warnings

### Note
Air Freight should prominently surface break groups and unit types because that logic is currently buried in System.

---

## 6. Scheduled / Routed → Routed / Multi-leg
### Purpose
For scheduled/routed work already being designed with Dane.

### Centre list
Columns:
- Name
- Client
- Rate Card
- Route Type
- Legs
- Stops
- Pricing Basis
- Effective Dates
- Active

### Right drawer
Summary drawer only:
- route name
- client
- rate card
- leg summary
- pricing summary
- linked services
- component health
- open full editor button

### Full editor
This should open the richer scheduled-rating builder.

### Builder steps
1. Route Scope
2. Leg Definition
3. Pricing by Leg
4. Shared Modifiers
5. Linked Components
6. Review & Publish

### Leg structure
Per leg:
- leg type (pickup / linehaul / delivery / transfer)
- basis (flat / distance / zone / per stop / per consignment)
- charge
- driver pay
- linked accessorials

---

## 7. Scheduled / Routed → Bulk Distribution
### Purpose
Hub/DC inbound + outbound clustered delivery pricing.

### Centre list
Columns:
- Name
- Client
- Distribution Centre
- Rate Card
- Outbound Basis
- Zone/Cluster Count
- Route Count
- Active

### Right drawer
Summary drawer:
- DC / hub
- inbound pricing summary
- outbound pricing summary
- postcode/zone grouping summary
- open full editor

### Full editor steps
1. Scope
2. Inbound to DC
3. Outbound Pricing Basis
4. Zone / Postcode Clustering
5. Linked Components
6. Review

### Key fields
- DC location
- inbound fee
- outbound flat / zone / route basis
- postcode groups
- distance from DC grouping
- linked extra charges/accessorials

---

## 8. Charges & Accessorials → Extra Charges
### Purpose
Reusable surcharge and ancillary charge definitions.

### Centre list
Columns:
- Name
- Charge Type
- Unit Type
- Base / Per Unit / %
- Min / Max
- Availability
- Active

### Right drawer
Sections:
- General
- Calculation
- Availability
- Linked Usage
- Audit

### Key fields
- name
- description
- internal tag
- charge type
- unit type
- base rate
- rate per unit
- percentage rate
- minimum charge
- maximum charge
- minimum quantity
- free allowance
- allowance unit
- conditional note
- calculation order
- available at booking/dispatch/courier
- active

### Note
This is current System functionality brought into a logical commercial home.

---

## 9. Charges & Accessorials → Accessorial Groups
### Purpose
Bundle/group related accessorial charges for reuse.

### Centre list
Columns:
- Name
- Member Count
- Rate Card
- Active
- Last Updated

### Right drawer
Sections:
- General
- Members
- Usage
- Audit

### Key fields
- name
- active
- member list
- ordering
- linked rate cards / rate types / services

---

## 10. Break Pricing → Break Types
### Purpose
Define the underlying measure type for break logic.

### Centre list
Columns:
- Name
- Unit of Measure
- Usage Count

### Right drawer
Small edit drawer:
- name
- unit of measure
- linked break groups

---

## 11. Break Pricing → Break Groups
### Purpose
Define tiered pricing structures used by air freight and future break-based rates.

### Centre list
Columns:
- Name
- Break Type
- Use Average
- Driver %
- Break Count
- Usage Count

### Right drawer
Sections:
- General
- Break Table
- Linked Usage
- Audit

### Break table columns
- start value
- end value
- base charge
- extra value rate
- increment unit
- increment rate
- driver %

### Note
This should feel like a proper rating component screen, not an obscure technical maintenance page.

---

## 12. Units & Measures
### Purpose
Define reusable unit types for charges and break logic.

### Centre list
Columns:
- Code
- Name
- Category
- Active
- Usage Count

### Right drawer
- code
- name
- description
- category
- active
- linked rates/charges

---

## 13. Service Rating Setup
### Purpose
Tie operational services to rating behaviour.

### Centre list
Columns:
- Service
- Rating Method
- Tracking
- Auto-dispatch Eval
- Client Scope
- Active/Entry Flags

### Right drawer
Sections:
- General
- Rating Behaviour
- Operational Flags
- Linked Rates
- Audit

### Key fields
- service name
- code
- rating method
- service tracking
- client scope
- auto-dispatch enabled
- MFV / FAF if still required
- entry flags
- linked rate sections

### Note
This screen prevents service/rating mapping from being stranded in old service records.

---

## Recommended user flow

### Add new on-demand rate
1. Choose **On-Demand**
2. Choose **Zone** or **Distance**
3. Complete drawer steps
4. Review linked components
5. Save as draft or publish

### Add new air freight rate
1. Choose **Air Freight**
2. Select client/rate card/service
3. Enter flight pricing
4. attach break group + unit type
5. review fuel/surcharge rules
6. publish

### Add new routed rate
1. Choose **Scheduled / Routed**
2. Open routed builder
3. define legs
4. define pricing per leg
5. attach shared charges
6. review and publish

---

## Recommendation
Keep the product simple by using:
- **drawer-first editing** for 80% of rating objects
- **progress steps** for linked/dependent setup
- **full-page builders** only for routed and bulk-distribution complexity

That gives tenants one coherent mental model without flattening genuinely different rating structures into one giant form.
