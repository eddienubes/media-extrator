CREATE TABLE "movies" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tmdbId" varchar NOT NULL,
	"title" varchar NOT NULL,
	"overview" varchar NOT NULL,
	"releaseDate" timestamp NOT NULL,
	"subtitles" jsonb NOT NULL,
	"posterUrl" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "movies_tmdbId_unique" UNIQUE("tmdbId")
);
--> statement-breakpoint
CREATE TABLE "tv_show_episodes" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tvShowUuid" uuid,
	"season" integer NOT NULL,
	"episode" integer NOT NULL,
	"subtitles" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tv_shows" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tmdbId" varchar NOT NULL,
	"title" varchar NOT NULL,
	"overview" varchar NOT NULL,
	"releaseDate" timestamp NOT NULL,
	"posterUrl" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tv_shows_tmdbId_unique" UNIQUE("tmdbId")
);
--> statement-breakpoint
ALTER TABLE "tv_show_episodes" ADD CONSTRAINT "tv_show_episodes_tvShowUuid_tv_shows_uuid_fk" FOREIGN KEY ("tvShowUuid") REFERENCES "public"."tv_shows"("uuid") ON DELETE no action ON UPDATE no action;