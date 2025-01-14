create table "public"."users" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now()
);

comment on table "public"."users" is 'Table containing all the users of the application';

alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

--------------------------------------------------------
-- Policies
--------------------------------------------------------

create policy "Enable Selection for authenticated users only for its own data"
on "public"."users"
as permissive
for select
to authenticated
using ((select  auth.uid()) = id);

create policy "Enable Update for users based on its id"
on "public"."users"
as permissive
for update
to authenticated
using ((select  auth.uid()) = id);

--------------------------------------------------------
-- Functions & Triggers
--------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path TO ''
AS $function$
BEGIN
    insert into public.users (id)
    values (new.id);

    return new;
END;
$function$;

comment on function public.handle_new_user() is 'Creates a new user from the new Authentication system. This function is triggered whenever a new user is created.';


CREATE TRIGGER handle_new_user
    AFTER INSERT
    ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

comment on trigger handle_new_user on auth.users is 'Trigger that creates a new user row whenever a new user is created in the Authentication system.';
