create type "public"."chart_type_enum" as enum (
    'Line',
    'Area',
    'List',
    'Other' -- This defaults to a text field
);

create table "public"."chart" (
    "id" text not null,
    "sensor_id" text not null,
    "name" text not null,
    "description" text not null,
    "type" "public"."chart_type_enum" not null default 'Other',
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now()
);

comment on table "public"."chart" is 'Table containing the models of the charts in use.';

alter table "public"."chart" enable row level security;

CREATE UNIQUE INDEX chart_pkey ON public.chart USING btree (id);

alter table "public"."chart" add constraint "chart_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensor" ("id") ON DELETE CASCADE not valid;

alter table "public"."chart" add constraint "chart_pkey" PRIMARY KEY using index "chart_pkey";

grant delete on table "public"."chart" to "anon";

grant insert on table "public"."chart" to "anon";

grant references on table "public"."chart" to "anon";

grant select on table "public"."chart" to "anon";

grant trigger on table "public"."chart" to "anon";

grant truncate on table "public"."chart" to "anon";

grant update on table "public"."chart" to "anon";

grant delete on table "public"."chart" to "authenticated";

grant insert on table "public"."chart" to "authenticated";

grant references on table "public"."chart" to "authenticated";

grant select on table "public"."chart" to "authenticated";

grant trigger on table "public"."chart" to "authenticated";

grant truncate on table "public"."chart" to "authenticated";

grant update on table "public"."chart" to "authenticated";

grant delete on table "public"."chart" to "service_role";

grant insert on table "public"."chart" to "service_role";

grant references on table "public"."chart" to "service_role";

grant select on table "public"."chart" to "service_role";

grant trigger on table "public"."chart" to "service_role";

grant truncate on table "public"."chart" to "service_role";

grant update on table "public"."chart" to "service_role";

--------------------------------------------------------
-- Policies
--------------------------------------------------------



--------------------------------------------------------
-- Functions & Triggers
--------------------------------------------------------
