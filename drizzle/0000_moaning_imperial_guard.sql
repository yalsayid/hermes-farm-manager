CREATE TABLE `printers` (
	`id` integer,
	`name` text NOT NULL,
	`ip` text NOT NULL,
	`access_code` text NOT NULL,
	`serial_number` text NOT NULL,
	PRIMARY KEY(`id`, `serial_number`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `printers_access_code_unique` ON `printers` (`access_code`);