<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddBlueprintIdToDevices extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
         Schema::table('devices', function($table) {
            $table->integer('blueprint_id')->after('id');
            $table->integer('coordination')->after('blueprint_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('devices', function($table) {
            $table->dropColumn('blueprint_id');
            $table->dropColumn('coordination');
        });
    }
}
