<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
 public function login()
    {
        $credentials = request(['email', 'password']);
        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public static function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    /**
     * [Method for changing/updating password]
     * @param  Request $request [description]
     * @return [type]           [description]
     */
    // public function changePassword(Request $request){
    //     if (!(Hash::check($request->get('current_password'), Auth::user()->password))) {
    //         // The passwords matches
    //         return redirect()->back()->with("error","Your current password does not matches with the password you provided. Please try again.");
    //     }

    //     if(strcmp($request->get('current_password'), $request->get('new_password')) == 0){
    //         //Current password and new password are same
    //         return redirect()->back()->with("error","New Password cannot be same as your current password. Please choose a different password.");
    //     }

    //     $validatedData = $request->validate([
    //         'current_password' => 'required',
    //         'new_password' => 'required|string|min:6|confirmed',
    //         'confirm_password' => 'required|string|min:6|confirmed'
    //     ]);

    //     //Change Password
    //     $user = Auth::user();
    //     $user->password = bcrypt($request->get('new_password'));
    //     $user->save();
    //     return redirect()->back()->with("success","Password changed successfully !");
    // }

}
