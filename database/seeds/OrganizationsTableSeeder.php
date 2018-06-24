<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class OrganizationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('organizations')->insert([
            'name' => "Microsoft NL",
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('organizations')->insert([
            'name' => "Da Vinci College",
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('organizations')->insert([
            'name' => "Google NL",
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('organizations')->insert([
            'name' => "KPN",
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('organizations')->insert([
            'name' => "Da Vinci College",
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('organizations')->insert([
            'name' => "KFC Amsterdam 54",
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);

        DB::table('organizations')->insert([
            'name' => "KFC Amsterdam 33",
            'created_at' => Carbon::now()->format('Y-m-d H:i:s')
        ]);
    }
}
