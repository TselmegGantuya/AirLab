<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMetersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('meters', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('device_id')->unsigned()->nullable();
            $table->decimal('temperature');
            $table->decimal('relative_humidity');
            $table->decimal('pm2_5');
            $table->decimal('tvoc');
            $table->decimal('co2');
            $table->decimal('co');
            $table->decimal('air_pressure');
            $table->decimal('ozone');
            $table->decimal('no2');
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
        Schema::dropIfExists('meters');
    }
}
