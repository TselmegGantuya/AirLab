<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('data', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('device_id');
            $table->integer('temperature');
            $table->integer('relative_humidity');
            $table->integer('pm2.5');
            $table->integer('tvoc');
            $table->integer('co2');
            $table->integer('co');
            $table->integer('air_pressure');
            $table->integer('ozone');
            $table->integer('no2');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('data');
    }
}
