create type "public"."sensor_type_enum" as enum (
    'Temperature',
    'Humidity',
    'Camera',
    'Motion',
    'Sound',
    'Other'
);

create table "public"."sensor" (
    "id" text not null,
    "central_id" bigint not null,
    "name" text not null,
    "description" text not null,
    "type" "public"."sensor_type_enum" not null default 'Other',
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now()
);

comment on table "public"."sensor" is 'Table containing the models of the sensors in use.';

alter table "public"."sensor" enable row level security;

CREATE UNIQUE INDEX sensor_pkey ON public.sensor USING btree (id);

alter table "public"."sensor" add constraint "sensor_central_id_fkey" FOREIGN KEY ("central_id") REFERENCES "public"."central" ("id") ON DELETE CASCADE not valid;

alter table "public"."sensor" add constraint "sensor_pkey" PRIMARY KEY using index "sensor_pkey";

grant delete on table "public"."sensor" to "anon";

grant insert on table "public"."sensor" to "anon";

grant references on table "public"."sensor" to "anon";

grant select on table "public"."sensor" to "anon";

grant trigger on table "public"."sensor" to "anon";

grant truncate on table "public"."sensor" to "anon";

grant update on table "public"."sensor" to "anon";

grant delete on table "public"."sensor" to "authenticated";

grant insert on table "public"."sensor" to "authenticated";

grant references on table "public"."sensor" to "authenticated";

grant select on table "public"."sensor" to "authenticated";

grant trigger on table "public"."sensor" to "authenticated";

grant truncate on table "public"."sensor" to "authenticated";

grant update on table "public"."sensor" to "authenticated";

grant delete on table "public"."sensor" to "service_role";

grant insert on table "public"."sensor" to "service_role";

grant references on table "public"."sensor" to "service_role";

grant select on table "public"."sensor" to "service_role";

grant trigger on table "public"."sensor" to "service_role";

grant truncate on table "public"."sensor" to "service_role";

grant update on table "public"."sensor" to "service_role";

--------------------------------------------------------
-- Policies
--------------------------------------------------------



--------------------------------------------------------
-- Functions & Triggers
--------------------------------------------------------
