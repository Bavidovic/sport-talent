import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1734538059218 implements MigrationInterface {
    name = 'UserTable1734538059218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Create the "users" table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" SERIAL NOT NULL,
                "firstName" character varying NOT NULL,
                "lastName" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "account_type" character varying NOT NULL,
                "resetToken" character varying,
                "resetTokenExpiry" TIMESTAMP,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            );
        `);

        // Step 2: Insert sample data into the "users" table
        await queryRunner.query(`
            INSERT INTO "users" ("firstName", "lastName", "email", "password", "account_type")
            VALUES 
                ('John', 'Doe', 'test@example.com', 'testpassword', 'athlete'),
                ('Jane', 'Smith', 'jane.smith@example.com', 'password123', 'coach'),
                ('Alice', 'Johnson', 'alice.johnson@example.com', 'password123', 'admin');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Delete the sample data (optional, but recommended for consistency)
        await queryRunner.query(`
            DELETE FROM "users" 
            WHERE email IN (
                'john.doe@example.com', 
                'jane.smith@example.com', 
                'alice.johnson@example.com'
            );
        `);

        // Step 2: Drop the "users" table
        await queryRunner.query(`DROP TABLE "users"`);
    }
}