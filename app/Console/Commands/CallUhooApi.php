<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\ApiController;

class CallUhooApi extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'api:get-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Call to Uhoo API to receive meter data per minute';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $uhoo_api = new ApiController();
        $uhoo_api->getUhooData();
    }
}
