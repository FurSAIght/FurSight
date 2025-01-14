create table "public"."central_config" (
    "id" bigint generated by default as identity not null,
    "central_id" bigint not null,
    "name" text not null,
    "description" text not null,
    "flows" jsonb not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now()
);

comment on table "public"."central_config" is 'Table containing the models of the processors in use.';
comment on column "public"."central_config"."flows" is 'JSON object containing the configuration of Node Red flows for the sensors and actuators.';

alter table "public"."central_config" enable row level security;

CREATE UNIQUE INDEX central_config_pkey ON public.central_config USING btree (id);

alter table "public"."central_config" add constraint "central_config_pkey" PRIMARY KEY using index "central_config_pkey";

alter table "public"."central_config" add constraint "central_config_central_central_id_fkey" FOREIGN KEY ("central_id") REFERENCES "public"."central" ("id") ON DELETE CASCADE not valid;

grant delete on table "public"."central_config" to "anon";

grant insert on table "public"."central_config" to "anon";

grant references on table "public"."central_config" to "anon";

grant select on table "public"."central_config" to "anon";

grant trigger on table "public"."central_config" to "anon";

grant truncate on table "public"."central_config" to "anon";

grant update on table "public"."central_config" to "anon";

grant delete on table "public"."central_config" to "authenticated";

grant insert on table "public"."central_config" to "authenticated";

grant references on table "public"."central_config" to "authenticated";

grant select on table "public"."central_config" to "authenticated";

grant trigger on table "public"."central_config" to "authenticated";

grant truncate on table "public"."central_config" to "authenticated";

grant update on table "public"."central_config" to "authenticated";

grant delete on table "public"."central_config" to "service_role";

grant insert on table "public"."central_config" to "service_role";

grant references on table "public"."central_config" to "service_role";

grant select on table "public"."central_config" to "service_role";

grant trigger on table "public"."central_config" to "service_role";

grant truncate on table "public"."central_config" to "service_role";

grant update on table "public"."central_config" to "service_role";

--------------------------------------------------------
-- Policies
--------------------------------------------------------



--------------------------------------------------------
-- Functions & Triggers
--------------------------------------------------------
