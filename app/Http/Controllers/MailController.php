<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Mail\ForgetEmail;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
	/**
	 * Logic to send email to user
	 * @return [type] [description]
	 */
    public function send()
    {
        $objDemo = new \stdClass();
        $objDemo->demo_one = 'Demo One Value';
        $objDemo->demo_two = 'Demo Two Value';
        $objDemo->sender = 'SenderUserName';
        $objDemo->receiver = 'ReceiverUserName';

        Mail::to("airlab2018@gmail.com")->send(new ForgetEmail($objDemo));
    }
}
