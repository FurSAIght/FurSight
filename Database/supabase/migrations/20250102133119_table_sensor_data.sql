create table "public"."sensor_data" (
    "timestamp" timestamp with time zone not null default now(),
    "sensor_id" text not null,
    "value" numeric not null
);

comment on table "public"."sensor_data" is 'Table to store real-time metrics of a sensor.';

alter table "public"."sensor_data" enable row level security;

CREATE UNIQUE INDEX sensor_data_pkey ON public.sensor_data USING btree ("sensor_id", "timestamp");

CREATE INDEX sensor_data_timestamp_idx ON public.sensor_data USING btree ("timestamp" DESC);

alter table "public"."sensor_data" add constraint "sensor_data_pkey" PRIMARY KEY using index "sensor_data_pkey";

alter table "public"."sensor_data" add constraint "sensor_data_sensor_id_fkey" FOREIGN KEY ("sensor_id") REFERENCES sensor(id) ON DELETE SET NULL not valid;

alter table "public"."sensor_data" validate constraint "sensor_data_sensor_id_fkey";

grant delete on table "public"."sensor_data" to "anon";

grant insert on table "public"."sensor_data" to "anon";

grant references on table "public"."sensor_data" to "anon";

grant select on table "public"."sensor_data" to "anon";

grant trigger on table "public"."sensor_data" to "anon";

grant truncate on table "public"."sensor_data" to "anon";

grant update on table "public"."sensor_data" to "anon";

grant delete on table "public"."sensor_data" to "authenticated";

grant insert on table "public"."sensor_data" to "authenticated";

grant references on table "public"."sensor_data" to "authenticated";

grant select on table "public"."sensor_data" to "authenticated";

grant trigger on table "public"."sensor_data" to "authenticated";

grant truncate on table "public"."sensor_data" to "authenticated";

grant update on table "public"."sensor_data" to "authenticated";

grant delete on table "public"."sensor_data" to "service_role";

grant insert on table "public"."sensor_data" to "service_role";

grant references on table "public"."sensor_data" to "service_role";

grant select on table "public"."sensor_data" to "service_role";

grant trigger on table "public"."sensor_data" to "service_role";

grant truncate on table "public"."sensor_data" to "service_role";

grant update on table "public"."sensor_data" to "service_role";

select extensions.create_hypertable('public.sensor_data', 'timestamp');

--------------------------------------------------------
-- Policies
--------------------------------------------------------



--------------------------------------------------------
-- Functions & Triggers
--------------------------------------------------------
