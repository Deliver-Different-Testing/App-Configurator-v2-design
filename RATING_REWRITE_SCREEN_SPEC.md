# Rating Rewrite — Screen-by-Screen Spec

## Goal
Fold the rating rebuild into the agreed **Business** menu structure Kerran is starting from, rather than treating it as a separate **System → Rating** module.

Target structure:
- **Business**
  - **Clients / Customers**
    - row click opens the Client modal
  - **Pricing & Rating**
  - **Rate Codes**
  - **Pricing**
  - **Territory / rating support data**
  - **schedule-linked rating behaviour**

The induction/import layer should build on the fact that the current system already supports **rate download and upload for editing**. The new part is the AI-assisted interpretation and structure-matching layer on top.

Within that structure, bring together:

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

### Business
- Clients / Customers
- Pricing & Rating
  - Overview
  - Rate Cards
  - On-Demand
    - Zone Rates
    - Distance Rates
  - Air Freight
    - Flight Rates
  - Charges & Accessorials
    - Extra Charges
    - Accessorial Groups
  - Break Pricing
    - Break Types
    - Break Groups
  - Units & Measures
- Rate Codes
- Pricing
- Territory / rating support data
- schedule-linked rating behaviour
  - Routed / Multi-leg
  - Bulk Distribution
- Rating Induction / Import
  - Upload & intent
  - AI structure match
  - Mapping review
  - Draft output / publish

---

## Global patterns

### A. Main layout
- **Left rail:** Rating nav
- **Centre:** list / cards / table / overview panels
- **Right drawer:** add, edit, inspect, link components
- **Sticky page header:** title, summary, search, quick actions

### B. Rate setup drawer pattern
Because rating setup has many linked parts, every add/edit drawer should use progress steps.

Also split drawer intent clearly:
- **Read-only detail drawer first** when opening an existing item from a list
- **Edit drawer state second** only after the operator explicitly chooses to edit
- keep the edit state in-drawer for normal commercial changes
- escalate to a full-screen builder only when structure complexity genuinely demands it

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
- Rating Induction / Import
- schedule-linked rating behaviour
- Charges & Accessorials
- Break Pricing
- Territory / rating support data

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

## 2A. Rating Induction / Import
### Purpose
Help new tenants bring spreadsheet-based pricing into DFRNT using the current download/upload workflow as a base, plus an AI-assisted matching layer.

### Centre layout
Two-stage review pattern:
- upload + natural-language intent
- AI structure match + mapping/review

### Key requirement
The user must be able to provide a **natural language description of the intended use of the uploaded spreadsheet**.

Example prompt field:
- “This workbook contains current same-day courier zone and distance pricing plus one air-freight sheet. Recreate the current commercial logic as closely as possible in DFRNT and treat after-hours as reusable charges.”

### Core sections
#### A. Upload & intent
- workbook upload
- source type
- import mode
- natural-language intent / business description

#### B. Current-system bridge
- existing download capability
- existing upload capability
- AI induction sits on top of, rather than replaces, raw spreadsheet import

#### C. AI structure match
Show ranked candidate structures such as:
- On-Demand → Zone Rates
- On-Demand → Distance Rates
- Air Freight → Flight Rates
- schedule-linked rating behaviour

Each match should show:
- confidence
- short explanation of why it matched
- accept / review / ignore

#### D. Mapping & review
Entity-level confidence for:
- services
- vehicles
- zones
- extra charges
- units
- break groups

#### E. Row-level mapping review
Show a source-to-target table with:
- source sheet / row reference
- detected meaning
- matched DFRNT target structure
- confidence
- issue / ambiguity
- accept / remap / ignore

This is the screen that makes the induction process auditable and trustworthy instead of “AI magic”.

#### F. Exceptions & unresolved items
Show a dedicated exception screen for:
- zone-name mismatches
- vehicle alias conflicts
- free-text notes that may need to become extra charges
- rows with insufficient structure to classify safely

Operator actions should include:
- create alias
- exclude row
- force target structure

#### G. Draft output / publish readiness
Show:
- draft rate cards
- draft rates generated
- rows requiring manual review
- publish lock until human sign-off

Also show explicit state such as:
- safe to save draft
- ready for internal review
- blocked from publish

#### H. Source vs generated output
Show a side-by-side proof screen:
- source workbook meaning on the left
- generated DFRNT draft entities on the right

Purpose:
- build trust in the interpretation
- help operators spot bad mappings quickly
- make approval easier for Steve/Kerran before publish

#### I. Alias / remap workflow
Support fast operator normalisation for things like:
- vehicle aliases
- zone aliases
- service-name cleanup

Fields/actions:
- source label
- detected type
- map to existing entity
- create alias / force remap / one-off override
- reason note

The outcome should be reusable in future induction runs for that tenant.

#### J. Induction run history & audit
Show prior runs with:
- run id
- workbook name
- result state (draft saved / published / abandoned)
- overrides count
- published by / when
- open audit action

This becomes the operational memory of how a tenant’s pricing was inducted.

#### K. Final review & publish workflow
Add a dedicated final-stage screen for controlled release of inducted pricing.

Core fields:
- draft version name
- release mode
- effective start / end dates
- supersede existing rate-card version or not
- rollback window
- release note

Reviewer state should show:
- primary reviewer
- business owner approval
- resolved dependencies
- residual exclusions / follow-up items

#### L. Activation, supersede & rollback
The final screen should make activation explicit and reversible.

Must show:
- what existing live version will be superseded
- that old versions are archived, not deleted
- what rows are excluded from this release
- what the rollback target is
- what approvals are still required before publish

Final actions:
- save review pack
- request approval
- publish when approved

### Product principles
- never pretend certainty when confidence is low
- explain why a structure was chosen
- keep source traceability to workbook/sheet/row where possible
- generate drafts first, not live pricing

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
- release / effective-date state
- explicit **Open Dane's full builder** handoff button

The scheduled drawer should have two states:
1. **Read-only template summary**
   - inspect route shape, dependencies, dates, linked schedules and release context
2. **Edit summary state**
   - allow light metadata / dependency edits before escalation

This closes the “missing detail” gap without trying to cram full route composition into the drawer.

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
- handoff readiness state
- explicit **Open Dane's full builder** button

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
