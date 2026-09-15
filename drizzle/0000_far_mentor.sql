CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author" varchar(255) DEFAULT '' NOT NULL,
	"url" text NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL
);
